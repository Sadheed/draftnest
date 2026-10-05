# DraftNest

DraftNest is a developer learning journal built with React, Express, MongoDB, and JWT authentication. It is intentionally structured as a reference project for learning Node.js backend development.

## Private Drafts And Author Dashboard

Sign in and open **My posts** to manage your journal. New posts are private drafts by default. Save a draft, edit it later, or select **Publish to the public feed** to make it public. The dashboard filters drafts and published posts and lets you publish, return a post to draft, or delete it after confirmation.

Only the author can read a draft through the private API or change a post. Public read endpoints return 404 for drafts, including when the author sends a token. Existing published posts keep their saved publication status; changing the schema default affects new posts only.

This release adds the dashboard and API access rules. Pagination, deployment, and revision history remain future work.

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
| GET    | `/api/posts/mine`  | Bearer JWT | List the author's drafts and published posts |
| GET    | `/api/posts/mine/:id` | Bearer JWT | Read one owned post for editing |
| GET    | `/api/posts/:id`   | No         | Read one published post |
| POST   | `/api/posts`       | Bearer JWT | Create a post           |
| PUT    | `/api/posts/:id`   | Bearer JWT | Update an owned post    |
| DELETE | `/api/posts/:id`   | Bearer JWT | Delete an owned post    |

Create requests accept `title`, `content`, `tags`, and optional boolean `isPublished` (defaults to `false`). Update requests accept any nonempty subset of those fields. Send `{ "isPublished": true }` to publish or `{ "isPublished": false }` to return to draft. Omitted fields retain their existing values. Ownership comes from authentication and cannot be changed through the request body. Whitespace-only titles/content are rejected; tags are limited to 10 entries of 30 characters each.

## Test And Quality Checks

```powershell
cd server
npm test
node --check index.js

cd ../client
npm run lint
npm run build
```

The default suite runs without MongoDB or a personal `.env` file. It covers health checks, validation, private-route authentication, author-scoped queries, unauthorized edits/publishing/deletion, publication defaults, and updates that preserve tags. Database calls in the draft API tests are mocked; they do not establish database integration correctness.

The separate integration suite runs against a disposable local MongoDB instance, creates a uniquely named test database, and drops only that database during cleanup. It exercises actual signup/login, public/private visibility, ownership, publishing/unpublishing, and deletion. Remote/Atlas URLs are refused.

```powershell
# Start a disposable database if Docker is installed:
docker run --rm --name draftnest-test-mongo -p 27017:27017 mongo:7

# In another terminal, from server/:
$env:TEST_MONGO_URI = 'mongodb://127.0.0.1:27017'
npm run test:integration
```

GitHub Actions runs both backend suites with a MongoDB service, frontend lint, and a production build on pushes and pull requests. Its first run still needs to be verified on GitHub.

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

1. Add pagination, search, tag filtering, and MongoDB indexes.
2. Deploy the client and API, then add screenshots and the live URL here.
3. Add revision history; consider scheduled publishing after the core workflow is deployed.

## Manual Release Check

1. Register two test users with different emails.
2. As user A, save a private draft; confirm it appears in My posts but not the feed.
3. As user B, confirm that user A's draft is absent from My posts and private reads return 404. Attempts to update or delete it must return 403.
4. As user A, edit the draft, publish it, and confirm its public detail page is available.
5. Return it to draft and confirm the public detail page returns 404.
6. Check dashboard filters, delete confirmation/cancellation, failed saves, and the layout on a narrow screen.

No deployment or real-user metrics are claimed by this repository.
