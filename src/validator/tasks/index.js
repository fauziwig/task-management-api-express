const InvariantError = require('../../exceptions/InvariantError');
const { TaskPayloadSchema } = require('./schema');

const TasksValidator = {
  validateTaskPayload: (payload) => {
    const { error } = TaskPayloadSchema.validate(payload);
    if (error) throw new InvariantError(error.message);
  },
};

module.exports = TasksValidator;
