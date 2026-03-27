class UsersHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
  }

  async postUserHandler(req, res, next) {
    try {
      this._validator.validateUserPayload(req.body);
      const userId = await this._service.addUser(req.body);
      res.status(201).json({ status: 'success', data: { userId } });
    } catch (err) { next(err); }
  }

  async getUsersHandler(req, res, next) {
    try {
      const users = await this._service.getUsers();
      res.json({ status: 'success', data: { users } });
    } catch (err) { next(err); }
  }

  async getUserByIdHandler(req, res, next) {
    try {
      const user = await this._service.getUserById(req.params.id);
      res.json({ status: 'success', data: { user } });
    } catch (err) { next(err); }
  }

  async putUserByIdHandler(req, res, next) {
    try {
      this._validator.validateUserEditPayload(req.body);
      await this._service.editUser(req.params.id, req.body);
      res.json({ status: 'success', message: 'User berhasil diperbarui' });
    } catch (err) { next(err); }
  }

  async deleteUserByIdHandler(req, res, next) {
    try {
      await this._service.deleteUser(req.params.id);
      res.json({ status: 'success', message: 'User berhasil dihapus' });
    } catch (err) { next(err); }
  }
}

module.exports = UsersHandler;
