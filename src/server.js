require('dotenv').config();
const express = require('express');
const cors = require('cors');
const ClientError = require('./exceptions/ClientError');

const usersPlugin = require('./api/users');
const authenticationsPlugin = require('./api/authentications');
const tasksPlugin = require('./api/tasks');
const UsersService = require('./services/postgres/UsersService');
const TasksService = require('./services/postgres/TasksService');
const UsersValidator = require('./validator/users');
const AuthenticationsValidator = require('./validator/authentications');
const TasksValidator = require('./validator/tasks');

const app = express();

app.use(cors());
app.use(express.json());

const usersService = new UsersService();
const tasksService = new TasksService();

// API Routes
usersPlugin(app, { service: usersService, validator: UsersValidator });
authenticationsPlugin(app, { usersService, validator: AuthenticationsValidator });
tasksPlugin(app, { service: tasksService, validator: TasksValidator });

// GET /users/:id/tasks
app.get('/users/:id/tasks', async (req, res, next) => {
  try {
    const tasks = await tasksService.getTasksByUserId(req.params.id);
    res.json({ status: 'success', data: { tasks } });
  } catch (err) { next(err); }
});

// Centralized Error Handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err instanceof ClientError) {
    return res.status(err.statusCode).json({
      status: 'fail',
      message: err.message,
    });
  }

  console.error(err);
  return res.status(500).json({
    status: 'error',
    message: 'Terjadi kegagalan pada server',
  });
});

const host = process.env.HOST || 'localhost';
const port = process.env.PORT || 5000;

app.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port}`);
});
