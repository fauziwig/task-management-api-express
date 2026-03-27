const AuthenticationsHandler = require('./handler');
const createAuthenticationsRouter = require('./routes');

module.exports = function authenticationsPlugin(app, { usersService, validator }) {
  const handler = new AuthenticationsHandler(usersService, validator);
  app.use('/users/login', createAuthenticationsRouter(handler));
};
