const Joi = require('joi');

const UserPayloadSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const UserEditPayloadSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().email(),
  password: Joi.string().min(6),
}).min(1);

module.exports = { UserPayloadSchema, UserEditPayloadSchema };
