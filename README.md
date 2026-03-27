# Task Management API

A RESTful API for a task management system. Users can register, log in, create tasks, assign ownership, edit, delete, and view tasks.

## Tech Stack

- **Runtime** — Node.js
- **Framework** — Express.js
- **Database** — PostgreSQL
- **Migration** — node-pg-migrate
- **Validation** — Joi
- **Auth** — JWT (jsonwebtoken)
- **Password hashing** — bcrypt
- **ID generation** — nanoid

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
```
Edit `.env` with your values (see table below).

### 3. Run database migrations
```bash
npm run migrate up
```

### 4. Start the server
```bash
# production
npm start

# development (auto-reload)
npm run dev
```

## Environment Variables

| Variable | Description |
|---|---|
| `HOST` | Server host (default: `localhost`) |
| `PORT` | Server port (default: `5000`) |
| `PGUSER` | PostgreSQL username |
| `PGPASSWORD` | PostgreSQL password |
| `PGDATABASE` | PostgreSQL database name |
| `PGHOST` | PostgreSQL host |
| `PGPORT` | PostgreSQL port |
| `ACCESS_TOKEN_KEY` | Secret key for signing JWT — generate with: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` |

## API Endpoints

### Users

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | /users | ❌ | Register new user |
| GET | /users | ❌ | Get all users |
| GET | /users/:id | ❌ | Get user by id |
| PUT | /users/:id | ❌ | Edit user |
| DELETE | /users/:id | ❌ | Delete user |
| GET | /users/:id/tasks | ❌ | Get tasks by user id |

### Authentications

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | /users/login | ❌ | Login, returns `accessToken` |

### Tasks

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | /tasks | ✅ | Create task |
| GET | /tasks | ❌ | Get all tasks |
| GET | /tasks/my-tasks | ✅ | Get my tasks |
| GET | /tasks/:id | ❌ | Get task by id |
| PUT | /tasks/:id | ✅ | Edit task (owner only) |
| DELETE | /tasks/:id | ✅ | Delete task (owner only) |

> Protected routes require `Authorization: Bearer <accessToken>` header.

## Example Requests

### Register
```http
POST /users
Content-Type: application/json

{
  "name": "Alice",
  "email": "alice@mail.com",
  "password": "secret123"
}
```
```json
{ "status": "success", "data": { "userId": "user-xxxx" } }
```

### Login
```http
POST /users/login
Content-Type: application/json

{
  "email": "alice@mail.com",
  "password": "secret123"
}
```
```json
{ "status": "success", "data": { "accessToken": "eyJ..." } }
```

### Create Task
```http
POST /tasks
Authorization: Bearer eyJ...
Content-Type: application/json

{
  "title": "Buy groceries",
  "description": "Milk, eggs, bread"
}
```
```json
{ "status": "success", "data": { "taskId": "task-xxxx" } }
```

## Reset Database (for testing)
```sql
TRUNCATE tasks, authentications, users;
```
