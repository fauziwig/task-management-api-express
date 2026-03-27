const TokenManager = require('../../security/TokenManager');

class AuthenticationsHandler {
  constructor(usersService, validator) {
    this._usersService = usersService;
    this._validator = validator;
  }

  async postLoginHandler(req, res, next) {
    try {
      this._validator.validateLoginPayload(req.body);
      const { email, password } = req.body;

      const id = await this._usersService.verifyUserCredential(email, password);
      const accessToken = TokenManager.generateAccessToken({ id });

      res.status(201).json({ status: 'success', data: { accessToken } });
    } catch (err) { next(err); }
  }
}

module.exports = AuthenticationsHandler;
