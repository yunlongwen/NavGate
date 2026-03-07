# PROJECT KNOWLEDGE BASE

**Generated:** 2026-03-07T02:27:31Z
**Commit:** 373f515
**Branch:** master

## OVERVIEW

Personal website navigation management system with three deployment modes: localStorage (default), GitHub Gist sync, and full-stack backend. Monorepo with React frontend, Express backend, and shared TypeScript packages.

## STRUCTURE

```
navgate/
├── apps/
│   ├── frontend/      # React 19 SPA (Vite + MUI 7 + Tailwind 4)
│   └── server/       # Express.js API with JSON file storage
├── packages/
│   ├── types/        # Shared TypeScript interfaces
│   ├── utils/        # Helper functions (storage, validation)
│   └── validation/   # Data validation schemas
├── docker/          # Multi-service deployment configs
├── scripts/         # CLI utilities (hash-password, verify-clean)
└── .github/         # GitHub Actions workflows
```

## WHERE TO LOOK

| Task            | Location                                  | Notes                                        |
| --------------- | ----------------------------------------- | -------------------------------------------- |
| Frontend entry  | `apps/frontend/src/main.tsx`              | React app mount point                        |
| API router      | `apps/frontend/src/api/index.ts`          | Mode-switching abstraction (local/gist/http) |
| Backend server  | `apps/server/src/index.ts`                | Express app, port 3000                       |
| API routes      | `apps/server/src/routes/`                 | /auth, /groups, /sites, /config              |
| Controllers     | `apps/server/src/controllers/`            | Business logic layer                         |
| Storage layer   | `apps/server/src/storage/jsonDatabase.ts` | JSON file persistence                        |
| Shared types    | `packages/types/index.ts`                 | Group, Site, Config interfaces               |
| Shared utils    | `packages/utils/index.ts`                 | storage helpers, URL validators              |
| Data validation | `packages/validation/index.ts`            | Schema validation functions                  |

## CONVENTIONS

**Code Style:**

- No semicolons, single quotes, 100-char line limit
- Strict TypeScript with no-unused rules enforced
- Prettier auto-format on save (VS Code)
- ESLint + Husky pre-commit/pre-push enforcement

**Commit Messages:**

- Conventional commits: `feat:`, `fix:`, `docs:`, etc.
- Scopes: `frontend`, `backend`, `packages/types`, etc.
- English only, lowercase, type: subject format
- Max 100 chars (subject), 72 chars recommended

**Monorepo:**

- pnpm workspace: `pnpm --filter [package] [command]`
- Shared packages use `workspace:*` protocol
- Apps import from `@navgate/types`, `@navgate/utils`, `@navgate/validation`

**Frontend API:**

- Three modes via `VITE_DEPLOY_MODE`: `github-pages` (default), `gist`, `backend`
- Conditional dynamic imports in `api/index.ts` switch implementations
- LocalStorage mode: `api/local.ts`
- Gist mode: `api/gist.ts`
- Backend mode: `api/http.ts`

**Backend:**

- Express 4.19 with TypeScript 5.7
- JSON file storage (no database)
- Controllers terminology (not standard Express pattern)
- Middleware: auth (bcrypt), error handling

## ANTI-PATTERNS (THIS PROJECT)

**Security:**

- NEVER commit `.env` files (contains secrets)
- NEVER expose GitHub tokens in client code (use backend proxy)
- NEVER store passwords in plaintext (use bcrypt via `pnpm hash-password`)
- DON'T use localStorage for sensitive data in Gist/backend modes

**Architecture:**

- DON'T duplicate API logic across modes (use `api/index.ts` abstraction)
- DON'T bypass validation layer (`@navgate/validation`)
- DON'T directly mutate state without validation
- AVOID coupling components to specific API implementations

**Development:**

- DON'T skip type checking (`noUnusedLocals`, `noUnusedParameters` enforced)
- DON'T commit with failing pre-push hooks (lint + format:check + type-check)
- DON'T use non-English in commit messages (enforced by commitlint)
- AVOID `any` type (strict mode enabled)

**Deployment:**

- DON'T mix deployment mode artifacts (clean dist/ before switching)
- DON'T hardcode API URLs (use VITE_API_BASE_URL)
- NEVER push `.env.production` to repository

## UNIQUE STYLES

**Three Deployment Modes in One Codebase:**

- Single frontend build supports localStorage, Gist, and backend modes
- Runtime mode selection via environment variable
- Vite config adapts base path and API proxy dynamically

**JSON File-Based Backend:**

- No database layer (unconventional for Express apps)
- Custom storage abstraction in `storage/jsonDatabase.ts`
- Simple, file-based persistence for multi-user scenarios

**Multi-Strategy API Client:**

- Separate API implementations per deployment mode
- Router pattern in `api/index.ts` for mode switching
- Enables cross-device sync without full backend

## COMMANDS

```bash
# Development
pnpm dev              # Start frontend (port 5173)
pnpm dev:backend       # Start backend (port 3000)
pnpm --filter [app] dev  # Start specific app

# Build
pnpm build            # Build frontend
pnpm build:backend     # Build backend (TypeScript compile)

# Quality
pnpm lint             # Run ESLint across all workspaces
pnpm format           # Format code with Prettier
pnpm format:check     # Check formatting without fixing
pnpm test             # Run tests recursively

# Deployment
pnpm deploy:github-pages  # Deploy frontend to GitHub Pages
pnpm deploy:aliyun        # Deploy to Aliyun via Docker
docker-compose -f docker/docker-compose.yml up -d  # Full stack in Docker

# Utilities
pnpm hash-password    # Generate bcrypt hash for .env
```

## NOTES

**Gotchas:**

- Pre-push hook runs full checks but backend type-check skipped (DB connection needed)
- `index.html` is in project root, not `apps/frontend/`
- Root has `tsconfig.app.json` alongside workspace configs (potential duplication)
- Postcommit hook auto-pushes with `--follow-tags` (pushes tags immediately)
- Build artifacts in `apps/frontend/dist/` excluded from Git

**Project Scale:**

- 76 files total
- 4,695 lines of code
- Max depth: 5 directories
- Only 1 test file exists (`packages/utils/storage.test.ts`)
- No integration tests or E2E tests
