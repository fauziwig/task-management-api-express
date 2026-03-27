const jwt = require('jsonwebtoken');
const InvariantError = require('../exceptions/InvariantError');

const TokenManager = {
  generateAccessToken: (payload) => jwt.sign(payload, process.env.ACCESS_TOKEN_KEY),
  verifyAccessToken: (accessToken) => {
    try {
      return jwt.verify(accessToken, process.env.ACCESS_TOKEN_KEY);
    } catch {
      throw new InvariantError('Access token tidak valid');
    }
  },
};

module.exports = TokenManager;
