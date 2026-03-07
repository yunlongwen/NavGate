# FRONTEND APPLICATION

**Generated:** 2026-03-07T02:27:31Z
**Commit:** 373f515

## OVERVIEW

React 19 SPA with Material UI 7 and Tailwind CSS 4. Supports three deployment modes: localStorage, GitHub Gist sync, and backend API.

## STRUCTURE

```
apps/frontend/
├── src/
│   ├── api/           # Mode-switching API layer
│   ├── components/     # React components (12 components)
│   ├── App.tsx        # Main app component
│   └── main.tsx       # Vite entry point
├── dist/             # Build output (excluded from Git)
├── public/           # Static assets
└── vite.config.ts     # Vite configuration
```

## WHERE TO LOOK

| Task             | Location           | Notes                                   |
| ---------------- | ------------------ | --------------------------------------- |
| API router       | `src/api/index.ts` | Mode abstraction (local/gist/http)      |
| LocalStorage API | `src/api/local.ts` | Browser localStorage implementation     |
| Gist API         | `src/api/gist.ts`  | GitHub Gist sync implementation         |
| HTTP API         | `src/api/http.ts`  | Backend API fetch calls                 |
| Main app         | `src/App.tsx`      | State management, routing, theme        |
| Components       | `src/components/`  | UI components (dialogs, cards, sidebar) |
| Entry point      | `src/main.tsx`     | React mount to #root                    |

## CONVENTIONS

**Three Deployment Modes:**

- Runtime mode via `VITE_DEPLOY_MODE` env var: `github-pages`, `gist`, `backend`
- `api/index.ts` uses conditional dynamic imports to switch API implementations

**Component Architecture:**

- Dialog components for all modals (LoginDialog, SiteDialog, GroupDialog)
- DND Kit for drag-and-drop sorting (groups and sites)
- Material UI 7 with Emotion styling

**State Management:**

- React 19 hooks (useState, useEffect, useMemo, useCallback)
- No external state library (Redux, Zustand)
- Component-level state with props drilling

## ANTI-PATTERNS (FRONTEND)

**API Usage:**

- DON'T import API implementations directly (always use `api/index.ts`)
- DON'T mix deployment modes in same build
- DON'T hardcode API URLs

**Component Development:**

- DON'T bypass DND Kit for drag-and-drop
- DON'T ignore accessibility features (keyboard navigation, ARIA)

**State Management:**

- DON'T introduce external state library without justification
- DON'T use class components (functional components only)

## UNIQUE STYLES

**Multi-Mode API Architecture:**

- Single codebase, three deployment strategies
- Runtime mode switching via environment variable

**Component Organization:**

- All dialog components follow naming pattern: `[Entity]Dialog.tsx`
- Dialogs handle both create and edit operations

## NOTES

**Gotchas:**

- `index.html` is in project root, not `apps/frontend/`
- Base path changes between deployment modes
- API proxy only works in backend mode

**Key Dependencies:**

- React 19.0.0
- Material UI 7.0.1 (@mui/material, @mui/icons-material)
- Tailwind CSS 4.1.2 (@tailwindcss/vite)
- @dnd-kit/core, @dnd-kit/sortable

**Import Conventions:**

- Shared types: `import { Group, Site } from '@navgate/types'`
- Shared utils: `import { storage, isValidUrl } from '@navgate/utils'`
- API: `import { login, getGroups, createSite } from './api'`
