# GitHub PR/Push Management for NavGate

## Overview

A discipline skill that enforces Git best practices, English-only Conventional Commits, and automated quality checks for NavGate project. All changes must pass pre-commit, pre-push, and CI validation.

## When to Use

**Triggered by:**

- Creating a new branch
- Creating a Pull Request
- Pushing commits to remote
- Committing changes locally

**When NOT to use:**

- Simple documentation-only commits in separate workflows
- Experimental branches (use `wip/` prefix instead)
- Manual pushes without validation
- Non-English commit messages (see commitlint.rules below)

## Core Pattern: Three-Stage Validation Flow

```
┌───────────────────────────────────────────┐
│ Developer         │
├────────────────────────┴────────────────┤
│ Pre-Commit Stage │
│ (Local, Fast)                │
│  • lint-staged                  │
│  • commitlint                  │
│  • type-check                 │
└────────────────────────┴────────────────┤
│ ✓                                    │
┌───────────────────────────────────────────┐
│ Pre-Push Stage     │
│ (Local, Comprehensive)         │
│  • Full lint                  │
│  • format:check               │
│  • All tests                  │
│  • verify-clean.sh             │
└────────────────────────┴────────────────┤
│ ✓                                    │
┌───────────────────────────────────────────┐
│ CI Pipeline         │
│ (Remote, Final)               │
│  • Type check all packages      │
│  • Lint all packages           │
│  • Build frontend (main mode)    │
│  • Build backend                 │
│  • Run all tests               │
│  • Security scan                │
└────────────────────────┴────────────────┤
│ ✓                                    │
┌───────────────────────────────────────────┐
│ PR Review & Merge   │
├────────────────────────┴────────────────┤
│ • Review title, description, checklist   │
│ • CI must pass                   │
│ • At least one approval required     │
│  • Squash and merge after              │
└───────────────────────────────────────────┘
```

## Quick Reference: Branch Naming

| Type     | Prefix      | Example                               |
| -------- | ----------- | ------------------------------------- |
| Feature  | `feature/`  | `feature/export-import-data`          |
| Bugfix   | `bugfix/`   | `bugfix/auth-timeout`                 |
| Hotfix   | `hotfix/`   | `hotfix/critical-security-issue`      |
| Refactor | `refactor/` | `refactor/utils-storage-optimization` |
| Docs     | `docs/`     | `docs/update-readme`                  |
| Chore    | `chore/`    | `chore/deps-upgrade`                  |
| Style    | `style/`    | `style/formatting-consistency`        |
| Test     | `test/`     | `test/add-unit-tests`                 |
| Build    | `build/`    | `build/optimize-webpack`              |
| CI/CD    | `ci/`       | `ci/add-workflow-checks`              |

## Quick Reference: Commit Message Format

**Mandatory Structure:**

```
<type>(<scope>): <subject>

<body>

<footer>

# Example
feat(frontend): add export/import data functionality

- Add ExportImportDialog component
- Implement localStorage data export
- Add JSON file import capability
- Add menu items in Header

Closes #123
```

**Allowed Types:**

- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `chore` - Maintenance tasks (dependencies, config)
- `refactor` - Code refactoring (no functionality change)
- `style` - Code style/formatting (no logic change)
- `test` - Adding or updating tests
- `build` - Build system or dependencies
- `ci` - CI/CD configuration

**Allowed Scopes:**

- `frontend` - Frontend app changes
- `backend` - Backend server changes
- `packages/types` - Shared types
- `packages/utils` - Shared utilities
- `packages/validation` - Shared validation
- `docker` - Docker configuration
- `ci` - CI/CD workflows

**Good Examples:**

```
feat(frontend): add export/import data functionality
feat(frontend): implement drag-and-drop site reordering
feat(backend): add API rate limiting
fix(backend): handle API authentication timeout
fix(frontend): fix mobile menu layout issue
fix(backend): fix database connection pool exhaustion
docs(readme): update quick start guide
chore(deps): upgrade react from 18 to 19
refactor(frontend): extract API client to separate file
style(frontend): fix code formatting issues
test(frontend): add unit tests for storage utility
build(backend): upgrade Docker base image to Alpine 3.18
ci(github): add Cloudflare cleanup verification
```

**Bad Examples:**

```
add new feature        ❌ Missing type prefix
feat: 添加新功能           ❌ Non-English description
feat(frontend): 新增导出功能          ❌ Non-English description
feat: add new feature # ❌ Wrong - commit message should not have comments

fix bug in auth        ❌ Missing scope
fix(auth): fix bug           ❌ Missing scope and description
fix: #123             ❌ Missing description
fix(auth): Fixed issue #123  ❌ Format mismatch
```
