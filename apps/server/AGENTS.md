# BACKEND API SERVER

**Generated:** 2026-03-07T02:27:31Z
**Commit:** 373f515

## OVERVIEW

Express.js 4.19 REST API with TypeScript 5.7. Custom JSON file storage layer. Handles authentication, CRUD operations for groups/sites, and configuration.

## STRUCTURE

```
apps/server/
├── src/
│   ├── routes/         # Express route definitions
│   ├── controllers/    # Business logic layer
│   ├── middleware/     # Auth and error handling
│   ├── storage/        # JSON file persistence
│   └── index.ts       # Express app entry point
├── dist/             # Compiled JavaScript output
├── .env.example       # Environment variables template
└── tsconfig.json      # TypeScript configuration
```

## WHERE TO LOOK

| Task             | Location                      | Notes                                                       |
| ---------------- | ----------------------------- | ----------------------------------------------------------- |
| Express server   | `src/index.ts`                | App initialization, middleware setup, routes                |
| API routes       | `src/routes/`                 | Express route definitions (/auth, /groups, /sites, /config) |
| Controllers      | `src/controllers/`            | Business logic (auth, config, groups, sites)                |
| Auth middleware  | `src/middleware/auth.ts`      | JWT token validation, bcrypt password verification          |
| Error middleware | `src/middleware/error.ts`     | Global error handling                                       |
| Storage layer    | `src/storage/jsonDatabase.ts` | JSON file read/write, CRUD operations                       |

## CONVENTIONS

**Route-Controller Pattern:**

- Routes in `src/routes/` define Express endpoints
- Controllers in `src/controllers/` implement business logic
- Routes delegate to controllers (not inline handlers)

**Storage Layer:**

- Custom JSON file storage (no database)
- `storage/jsonDatabase.ts` provides CRUD operations
- Data files: `groups.json`, `sites.json`, `config.json`

**Authentication:**

- JWT tokens via `jsonwebtoken` (if installed)
- bcrypt password hashing (use `pnpm hash-password`)
- Auth middleware validates tokens on protected routes

**API Endpoints:**

- `/api/auth` - login endpoint
- `/api/groups` - CRUD for group management
- `/api/sites` - CRUD for site management
- `/api/config` - configuration management

## ANTI-PATTERNS (BACKEND)

**Security:**

- NEVER store passwords in plaintext (use bcrypt)
- NEVER expose credentials in API responses
- DON'T skip authentication on protected routes
- NEVER return stack traces in production

**Data Access:**

- DON'T bypass storage layer (direct file I/O forbidden)
- DON'T write to JSON files without validation
- DON'T mix data concerns in controllers

**API Design:**

- DON'T inline business logic in routes (use controllers)
- DON'T ignore validation layer (@navgate/validation)

## UNIQUE STYLES

**JSON File-Based Storage:**

- No database ORM or driver
- Simple JSON read/write pattern
- File-based persistence for multi-user scenarios

**Controllers Terminology:**

- "controllers" naming (typically "handlers" in Express)
- Separates routing from business logic clearly

**Minimal Dependencies:**

- Express.js core + cors + dotenv only
- No database drivers or ORMs

## NOTES

**Gotchas:**

- Type-check in pre-push hook is skipped (DB connection needed)
- Data files created on first run
- No migration strategy for JSON schema changes

**Environment Variables:**

- PORT - Server port (default: 3000)
- ADMIN_USERNAME - Admin username
- ADMIN_PASSWORD - Bcrypt hash of admin password

**Development Workflow:**

- `pnpm dev:backend` - tsx watch mode
- `pnpm build:backend` - TypeScript compilation
- `pnpm start` - Run compiled server

**Key Dependencies:**

- express@4.19.0, typescript@~5.7.2
- @navgate/types, @navgate/utils, @navgate/validation
- cors@2.8.5, dotenv@16.4.0
