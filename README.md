# personnel-fm-be

The MyFinance REST API: a backend for personal monthly finance management, built with Node.js, Express 5, TypeScript, MongoDB and Mongoose.

## Requirements

- Node.js 20 or later
- MongoDB running as a **replica set**. Atomic account transfers use multi-document transactions, which need one. Use MongoDB Atlas, or a local single-node replica set:

  ```bash
  brew tap mongodb/brew && brew install mongodb-community mongosh
  printf 'replication:\n  replSetName: rs0\n' >> /opt/homebrew/etc/mongod.conf
  brew services start mongodb/brew/mongodb-community
  mongosh --eval 'rs.initiate({_id:"rs0",members:[{_id:0,host:"localhost:27017"}]})'
  ```

## Getting started

```bash
cp .env.example .env   # then adjust MONGO_URI / CORS_ORIGINS
npm install
npm run dev            # http://localhost:4000
```

- The health check is at `GET /api/v1/health`.
- Swagger UI is at `/api/docs`, and the raw OpenAPI JSON is at `/api/docs.json`.

## Scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Start with hot reload (tsx) |
| `npm run build` / `npm start` | Compile to `dist/` and run |
| `npm test` | Run the Jest + Supertest suite against an in-memory MongoDB replica set |
| `npm run test:coverage` | Run the tests with a coverage report |
| `npm run lint` / `npm run typecheck` | Run ESLint / the TypeScript checks |
| `npm run format` / `npm run format:check` | Format with Prettier / check formatting |

## Conventions

- **Paths:** every endpoint is versioned under `/api/v1`.
- **Responses:** success is `{ success: true, data, meta? }`, errors are `{ success: false, error: { code, message, details? } }`.
- **Layering:** each feature module in `src/modules/<feature>/` keeps routes, controllers, services, models and Zod schemas separate. Business logic lives in services, not controllers.
- **Validation and docs:** request validation uses Zod through `middleware/validate.ts`. The same schemas are registered with `docs/openapi.ts`, so Swagger stays in sync with what the API accepts.
- **Money:** amounts are stored as integer **paise** (₹1 = 100 paise), and floating-point maths is never used for totals.
- **Ownership:** every query is scoped to the authenticated user's ID.
