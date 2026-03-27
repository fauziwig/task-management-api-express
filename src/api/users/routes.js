const express = require('express');

function createUsersRouter(handler) {
  const router = express.Router();

  router.post('/', (req, res, next) => handler.postUserHandler(req, res, next));
  router.get('/', (req, res, next) => handler.getUsersHandler(req, res, next));
  router.get('/:id', (req, res, next) => handler.getUserByIdHandler(req, res, next));
  router.put('/:id', (req, res, next) => handler.putUserByIdHandler(req, res, next));
  router.delete('/:id', (req, res, next) => handler.deleteUserByIdHandler(req, res, next));

  return router;
}

module.exports = createUsersRouter;
