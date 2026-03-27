const Joi = require('joi');

const LoginPayloadSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

module.exports = { LoginPayloadSchema };
