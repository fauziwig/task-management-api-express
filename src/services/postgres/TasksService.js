const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class TasksService {
  constructor() {
    this._pool = new Pool();
  }

  async addTask({ title, description, userId }) {
    const id = `task-${nanoid(16)}`;
    const result = await this._pool.query(
      'INSERT INTO tasks (id, title, description, completed, user_id) VALUES($1, $2, $3, false, $4) RETURNING id',
      [id, title, description || null, userId],
    );
    return result.rows[0].id;
  }

  async getTasks() {
    const result = await this._pool.query('SELECT * FROM tasks');
    return result.rows;
  }

  async getMyTasks(userId) {
    const result = await this._pool.query('SELECT * FROM tasks WHERE user_id = $1', [userId]);
    return result.rows;
  }

  async getTaskById(id) {
    const result = await this._pool.query('SELECT * FROM tasks WHERE id = $1', [id]);
    if (!result.rowCount) throw new NotFoundError('Task tidak ditemukan');
    return result.rows[0];
  }

  async editTask(id, { title, description, completed }) {
    const fields = [];
    const values = [];
    let idx = 1;

    if (title !== undefined) { fields.push(`title = $${idx++}`); values.push(title); }
    if (description !== undefined) { fields.push(`description = $${idx++}`); values.push(description); }
    if (completed !== undefined) { fields.push(`completed = $${idx++}`); values.push(completed); }

    if (!fields.length) return;

    values.push(id);
    const result = await this._pool.query(
      `UPDATE tasks SET ${fields.join(', ')} WHERE id = $${idx} RETURNING id`,
      values,
    );
    if (!result.rowCount) throw new NotFoundError('Task tidak ditemukan');
  }

  async deleteTask(id) {
    const result = await this._pool.query('DELETE FROM tasks WHERE id = $1 RETURNING id', [id]);
    if (!result.rowCount) throw new NotFoundError('Task tidak ditemukan');
  }

  async getTasksByUserId(userId) {
    const result = await this._pool.query('SELECT * FROM tasks WHERE user_id = $1', [userId]);
    return result.rows;
  }

  async verifyTaskOwner(taskId, userId) {
    const result = await this._pool.query('SELECT user_id FROM tasks WHERE id = $1', [taskId]);
    if (!result.rowCount) throw new NotFoundError('Task tidak ditemukan');
    if (result.rows[0].user_id !== userId) throw new AuthorizationError('Anda tidak berhak mengakses task ini');
  }
}

module.exports = TasksService;
