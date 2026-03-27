class TasksHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
  }

  async postTaskHandler(req, res, next) {
    try {
      this._validator.validateTaskPayload(req.body);
      const taskId = await this._service.addTask({ ...req.body, userId: req.auth.id });
      res.status(201).json({ status: 'success', data: { taskId } });
    } catch (err) { next(err); }
  }

  async getTasksHandler(req, res, next) {
    try {
      const tasks = await this._service.getTasks();
      res.json({ status: 'success', data: { tasks } });
    } catch (err) { next(err); }
  }

  async getMyTasksHandler(req, res, next) {
    try {
      const tasks = await this._service.getMyTasks(req.auth.id);
      res.json({ status: 'success', data: { tasks } });
    } catch (err) { next(err); }
  }

  async getTaskByIdHandler(req, res, next) {
    try {
      const task = await this._service.getTaskById(req.params.id);
      res.json({ status: 'success', data: { task } });
    } catch (err) { next(err); }
  }

  async putTaskByIdHandler(req, res, next) {
    try {
      this._validator.validateTaskPayload(req.body);
      await this._service.verifyTaskOwner(req.params.id, req.auth.id);
      await this._service.editTask(req.params.id, req.body);
      res.json({ status: 'success', message: 'Task berhasil diperbarui' });
    } catch (err) { next(err); }
  }

  async deleteTaskByIdHandler(req, res, next) {
    try {
      await this._service.verifyTaskOwner(req.params.id, req.auth.id);
      await this._service.deleteTask(req.params.id);
      res.json({ status: 'success', message: 'Task berhasil dihapus' });
    } catch (err) { next(err); }
  }

  async getTasksByUserIdHandler(req, res, next) {
    try {
      const tasks = await this._service.getTasksByUserId(req.params.id);
      res.json({ status: 'success', data: { tasks } });
    } catch (err) { next(err); }
  }
}

module.exports = TasksHandler;
