const InvariantError = require('../../exceptions/InvariantError');
const { LoginPayloadSchema } = require('./schema');

const AuthenticationsValidator = {
  validateLoginPayload: (payload) => {
    const { error } = LoginPayloadSchema.validate(payload);
    if (error) throw new InvariantError(error.message);
  },
};

module.exports = AuthenticationsValidator;
