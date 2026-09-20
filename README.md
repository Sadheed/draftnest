# DraftNest

DraftNest is a developer learning journal built with React, Express, MongoDB, and JWT authentication. It is intentionally structured as a reference project for learning Node.js backend development.

## Architecture

```text
client/                 React + Vite frontend
server/
  config/               Validated environment configuration
  controllers/          HTTP request/response translation
  middleware/           Auth, validation, security, and errors
  models/               Mongoose schemas
  routes/               Small endpoint definitions
  services/             Business logic and database operations
  utils/                Reusable errors and async helpers
  validators/           Zod request schemas
  test/                 Node test runner + Supertest API tests
```

A request flows through:

```text
HTTP request -> middleware -> route -> validation -> controller -> service -> model -> response
```

## Local Setup

1. Create `server/.env` from `server/.env.example`.
2. Add your MongoDB Atlas URI, a JWT secret of at least 32 characters, and your client URL.
3. Install dependencies:

```powershell
cd server
npm install
cd ../client
npm install
```

4. Start the backend:

```powershell
cd server
npm run dev
```

5. Start the frontend in another terminal:

```powershell
cd client
npm run dev
```

The API runs on `http://localhost:5000` and the client on `http://localhost:5173` by default.

## Environment Variables

Server variables are documented in [server/.env.example](server/.env.example). The client accepts `VITE_API_URL`; for local development its default is `http://localhost:5000/api`.

Never commit `.env` files or database credentials. In MongoDB Atlas, add your development IP under Network Access and create a least-privilege database user.

## API Reference

| Method | Endpoint           | Auth       | Purpose                 |
| ------ | ------------------ | ---------- | ----------------------- |
| GET    | `/api/health`      | No         | Service health check    |
| POST   | `/api/auth/signup` | No         | Register a user         |
| POST   | `/api/auth/login`  | No         | Issue a JWT             |
| GET    | `/api/posts`       | No         | List published posts    |
| GET    | `/api/posts/:id`   | No         | Read one published post |
| POST   | `/api/posts`       | Bearer JWT | Create a post           |
| PUT    | `/api/posts/:id`   | Bearer JWT | Update an owned post    |
| DELETE | `/api/posts/:id`   | Bearer JWT | Delete an owned post    |

## Test And Quality Checks

```powershell
cd server
npm test
node --check index.js

cd ../client
npm run lint
npm run build
```

The API tests run without Atlas and cover health checks, 404 handling, validation, and protected routes. Add a disposable MongoDB integration suite when your environment can install `mongodb-memory-server`.

## Node.js Learning Map

- `config/env.js`: fail-fast configuration and schema validation
- `index.js`: database-first startup and graceful shutdown
- `app.js`: middleware order, security headers, CORS, body limits, and rate limiting
- `middleware/`: request pipeline design and authentication
- `controllers/`: HTTP concerns kept separate from business logic
- `services/`: testable business rules and ownership authorization
- `validators/`: boundary validation with Zod
- `test/`: API behavior verification with Node's built-in test runner

## Next Portfolio Milestones

1. Add drafts, publishing states, and an edit dashboard.
2. Add pagination, search, tag filtering, and MongoDB indexes.
3. Add revision history and scheduled publishing with a background worker.
4. Add CI to run tests and client checks on every push.
5. Deploy the client and API, then add screenshots and the live URL here.
