const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthenticationError = require('../../exceptions/AuthenticationError');

class UsersService {
  constructor() {
    this._pool = new Pool();
  }

  async addUser({ name, email, password }) {
    const existing = await this._pool.query('SELECT id FROM users WHERE email = $1', [email]); 
    if (existing.rowCount) throw new InvariantError('Email sudah digunakan');

    const id = `user-${nanoid(16)}`;
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await this._pool.query(
      'INSERT INTO users VALUES($1, $2, $3, $4) RETURNING id',
      [id, name, email, hashedPassword],
    );
    return result.rows[0].id;
  }

  async getUsers() {
    const result = await this._pool.query('SELECT id, name, email FROM users');
    return result.rows;
  }

  async getUserById(id) {
    const result = await this._pool.query('SELECT id, name, email FROM users WHERE id = $1', [id]);
    if (!result.rowCount) throw new NotFoundError('User tidak ditemukan');
    return result.rows[0];
  }

  async editUser(id, { name, email, password }) {
    await this.getUserById(id);

    if (email) {
      const existing = await this._pool.query(
        'SELECT id FROM users WHERE email = $1 AND id != $2',
        [email, id],
      );
      if (existing.rowCount) throw new InvariantError('Email sudah digunakan');
    }

    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

    const fields = [];
    const values = [];
    let idx = 1;

    if (name) { fields.push(`name = $${idx++}`); values.push(name); }
    if (email) { fields.push(`email = $${idx++}`); values.push(email); }
    if (hashedPassword) { fields.push(`password = $${idx++}`); values.push(hashedPassword); }

    if (!fields.length) return;

    values.push(id);
    await this._pool.query(`UPDATE users SET ${fields.join(', ')} WHERE id = $${idx}`, values);
  }

  async deleteUser(id) {
    const result = await this._pool.query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);
    if (!result.rowCount) throw new NotFoundError('User tidak ditemukan');
  }

  async verifyUserCredential(email, password) {
    const result = await this._pool.query('SELECT id, password FROM users WHERE email = $1', [email]);
    if (!result.rowCount) throw new AuthenticationError('Kredensial yang Anda berikan salah');

    const { id, password: hashedPassword } = result.rows[0];
    const match = await bcrypt.compare(password, hashedPassword);
    if (!match) throw new AuthenticationError('Kredensial yang Anda berikan salah');

    return id;
  }
}

module.exports = UsersService;
