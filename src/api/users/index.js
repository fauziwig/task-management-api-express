const UsersHandler = require('./handler');
const createUsersRouter = require('./routes');

module.exports = function usersPlugin(app, { service, validator }) {
  const handler = new UsersHandler(service, validator);
  app.use('/users', createUsersRouter(handler));
};
