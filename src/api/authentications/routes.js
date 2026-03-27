const express = require('express');

function createAuthenticationsRouter(handler) {
  const router = express.Router();
  router.post('/', (req, res, next) => handler.postLoginHandler(req, res, next));
  return router;
}

module.exports = createAuthenticationsRouter;
