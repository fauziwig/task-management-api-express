const TasksHandler = require('./handler');
const createTasksRouter = require('./routes');

module.exports = function tasksPlugin(app, { service, validator }) {
  const handler = new TasksHandler(service, validator);
  app.use('/tasks', createTasksRouter(handler));
};
