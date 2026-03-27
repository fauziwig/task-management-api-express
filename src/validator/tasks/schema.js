const Joi = require('joi');

const TaskPayloadSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().optional(),
  completed: Joi.boolean().optional(),
});

module.exports = { TaskPayloadSchema };
