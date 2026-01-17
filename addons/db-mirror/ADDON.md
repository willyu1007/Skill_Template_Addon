# Database Mirror Add-on (Optional)

## Conclusions (read first)

- This add-on is intended for projects where the **real database is the SSOT**.
- The repository holds **structured mirrors** under `db/` so the LLM can understand the schema without DB access.
- `db/schema/tables.json` is a **generated snapshot** (normalized-db-schema-v2). Do NOT hand-edit it.
- The canonical LLM context contract is `docs/context/db/schema.json` and is generated via `dbssotctl`.

## What the add-on writes (blast radius)

New files/directories (created if missing):

- `db/` (database artifacts root)
  - `db/AGENTS.md` (LLM guidance)
  - `db/schema/tables.json` (generated schema mirror)
  - `db/migrations/` (optional SQL files for humans)
  - `db/config/` (environment metadata; no secrets)
  - `db/samples/` (sample/seed data)
  - `db/workdocs/` (DB change proposals, rollout plans)
- `.ai/scripts/dbctl.js` (mirror controller)
- `.ai/scripts/migrate.js` (optional migration tracking)
- `docs/addons/db-mirror/` (add-on documentation)

## Install

### Option A: Via init-pipeline (recommended)

Enable in your `project-blueprint.json`:

```json
{
  "db": {
    "enabled": true,
    "ssot": "database",
    "kind": "postgres",
    "environments": ["dev", "staging", "prod"],
    "migrationTool": "prisma"
  },
  "addons": {
    "contextAwareness": true,
    "dbMirror": true
  }
}
```

Then run:

```bash
node init/skills/initialize-project-from-requirements/scripts/init-pipeline.cjs apply --blueprint init/project-blueprint.json
```

### Option B: Install manually

1. Copy payload contents into the repository root.
2. Initialize the database mirror (idempotent):
   ```bash
   node .ai/scripts/dbctl.js init
   ```

## Usage

### Mirror management

```bash
# Initialize db mirror structure
node .ai/scripts/dbctl.js init

# Import prisma/schema.prisma into the mirror
node .ai/scripts/dbctl.js import-prisma

# List tables in the mirror
node .ai/scripts/dbctl.js list-tables

# Verify mirror file is parseable
node .ai/scripts/dbctl.js verify --strict
```

### Context awareness bridge (recommended)

If the context-awareness add-on is enabled, sync the mirror into `docs/context/`:

```bash
node .ai/scripts/dbssotctl.js sync-to-context
```

The command updates `docs/context/db/schema.json` and (best effort) runs `contextctl touch`.

### Migration tracking (optional)

This add-on may be used to track DB changes executed by humans:

```bash
# Create an empty SQL file for humans to fill/apply
node .ai/scripts/dbctl.js generate-migration --name add-user-roles

# Track applied migrations per environment (manual bookkeeping)
node .ai/scripts/migrate.js list
node .ai/scripts/migrate.js mark-applied --migration 20260101120000_add_user_roles.sql --env staging
```

## AI/LLM guidelines

When working with the add-on, AI SHOULD:

1. Read `db/schema/tables.json` for **current state**.
2. Write proposals in `db/workdocs/` (desired state, risk notes, rollout plan).
3. Ask humans to apply DDL/migrations.
4. After DB changes: re-run `prisma db pull`, `dbctl import-prisma`, and `dbssotctl sync-to-context`.

AI MUST NOT:

- directly connect to databases
- run arbitrary SQL
- store credentials
- hand-edit `db/schema/tables.json`

## Rollback / Uninstall

Delete these paths:

- `db/`
- `.ai/scripts/dbctl.js`
- `.ai/scripts/migrate.js`
- `docs/addons/db-mirror/`
