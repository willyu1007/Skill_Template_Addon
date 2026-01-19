---
name: feature-db-mirror
description: Enable and operate the DB Mirror feature (db/ schema snapshots + migration workdocs) for projects where the real database is the schema SSOT.
---

# DB Mirror Feature

## Intent

Maintain a **repo-local mirror** of the current database schema under `db/` so developers and LLMs can work without direct database access.

This feature is designed for the **`database` SSOT mode**:

- **SSOT**: the running database
- **Repo artifacts (derived)**:
  - `prisma/schema.prisma` (introspected)
  - `db/schema/tables.json` (normalized snapshot)
  - `docs/context/db/schema.json` (LLM contract; via `dbssotctl`)

## What gets enabled

When enabled, this feature materializes these paths:

- `db/**`
  - `db/schema/tables.json` (generated snapshot; do not hand-edit)
  - `db/migrations/` (optional human-authored SQL)
  - `db/workdocs/` (change proposals, rollout plans)

Controller scripts are provided by the template SSOT under `.ai/scripts/`:

- `node .ai/scripts/dbctl.js` — mirror management (init/import/list/verify)
- `node .ai/scripts/migrate.js` — optional migration bookkeeping
- `node .ai/scripts/dbssotctl.js` — refresh LLM DB contract under `docs/context/`

## Preconditions

- DB SSOT mode MUST be `database`.
  - Check: `docs/project/db-ssot.json`
- If you want `docs/context/db/schema.json`, you should also enable **Context Awareness**.

## How to enable

### Path A — During init (recommended)

In `init/project-blueprint.json`:

- Set `db.ssot = "database"`
- Set `features.dbMirror = true`

Then run init Stage C apply:

```bash
node init/skills/initialize-project-from-requirements/scripts/init-pipeline.cjs apply --providers both
```

### Path B — Enable in an existing repo

1. Copy templates from:
   - `.ai/skills/features/db-mirror/feature-db-mirror/templates/`
   into the repo root.
2. Initialize:

```bash
node .ai/scripts/dbctl.js init
node .ai/scripts/dbctl.js verify --strict
```

## Operating workflow (DB is SSOT)

1. Humans apply DB schema changes (DDL/migrations) in the target environment.
2. Humans run introspection (example):

- `npx prisma db pull`

3. Update repo mirrors:

```bash
node .ai/scripts/dbctl.js import-prisma
node .ai/scripts/dbssotctl.js sync-to-context
```

## Verification

```bash
node .ai/scripts/dbctl.js verify --strict
node .ai/scripts/dbctl.js list-tables
```

## Boundaries

- Do NOT connect to databases from the AI agent.
- Do NOT store credentials.
- Do NOT hand-edit `db/schema/tables.json` (generated).
