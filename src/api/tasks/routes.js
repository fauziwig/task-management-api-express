const express = require('express');
const auth = require('../../middleware/auth');

function createTasksRouter(handler) {
  const router = express.Router();

  router.post('/', auth, (req, res, next) => handler.postTaskHandler(req, res, next));
  router.get('/', (req, res, next) => handler.getTasksHandler(req, res, next));
  // my-tasks MUST be before /:id to avoid being matched as a param
  router.get('/my-tasks', auth, (req, res, next) => handler.getMyTasksHandler(req, res, next));
  router.get('/:id', (req, res, next) => handler.getTaskByIdHandler(req, res, next));
  router.put('/:id', auth, (req, res, next) => handler.putTaskByIdHandler(req, res, next));
  router.delete('/:id', auth, (req, res, next) => handler.deleteTaskByIdHandler(req, res, next));

  return router;
}

module.exports = createTasksRouter;
