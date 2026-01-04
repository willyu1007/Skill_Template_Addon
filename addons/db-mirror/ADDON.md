# Database Mirror Add-on (Optional)

## Conclusions (read first)

- The add-on provides a **database schema mirroring** system under `db/`.
- Real databases are the **single source of truth**; the repository holds structured mirrors.
- AI/LLM uses these mirrors to understand schema, propose changes, and plan migrations.
- All database operations go through scripts - no direct database manipulation by AI.

## What this add-on writes (blast radius)

New files/directories (created if missing):

- `db/` (database artifacts root)
  - `db/AGENTS.md` (LLM guidance)
  - `db/schema/` (table structure mirrors)
  - `db/migrations/` (migration files)
  - `db/config/` (database environment configuration)
  - `db/samples/` (sample/seed data)
  - `db/workdocs/` (design decisions and plans)
- `.ai/scripts/dbctl.js` (schema mirror management)
- `.ai/scripts/migrate.js` (migration execution)
- `docs/addons/db-mirror/` (add-on documentation)

## Install

### Option A: Via init-pipeline (recommended)

Enable in your `project-blueprint.json`:

```json
{
  "addons": {
    "dbMirror": true
  },
  "db": {
    "enabled": true,
    "kind": "postgres",
    "environments": ["dev", "staging", "prod"],
    "migrationTool": "prisma"
  }
}
```

Then run:
```bash
node init/skills/initialize-project-from-requirements/scripts/init-pipeline.cjs apply --blueprint docs/project/project-blueprint.json
```

### Option B: Install manually

1. Copy payload contents into the repository root.
2. Initialize the database mirror (idempotent):
   ```bash
   node .ai/scripts/dbctl.js init
   ```

## Usage

### Schema Management

```bash
# Initialize db mirror structure
node .ai/scripts/dbctl.js init

# Add a table to the schema mirror
node .ai/scripts/dbctl.js add-table --name users --columns "id:uuid:pk,email:string:unique,created_at:timestamp"

# List tables in the schema
node .ai/scripts/dbctl.js list-tables

# Verify schema consistency
node .ai/scripts/dbctl.js verify --env dev
```

### Migration Management

```bash
# Generate a new migration
node .ai/scripts/dbctl.js generate-migration --name add-user-roles

# List pending migrations
node .ai/scripts/migrate.js list

# Apply migrations (requires human confirmation for non-dev)
node .ai/scripts/migrate.js apply --env staging
```

### Context Awareness Bridge (optional)

If the context-awareness add-on is enabled, sync the mirror into `docs/context/`:

```bash
node .ai/scripts/dbctl.js sync-to-context
```

The command updates `docs/context/db/schema.json` and refreshes the registry checksum so `contextctl verify` passes.

### Environment Configuration

Database environments are defined in `db/config/db-environments.json`:

```json
{
  "environments": [
    {
      "id": "dev",
      "description": "Local development",
      "connectionTemplate": "postgresql://${DB_USER}:${DB_PASSWORD}@localhost:5432/${DB_NAME}",
      "permissions": {
        "migrations": true,
        "seedData": true,
        "directQueries": true
      }
    }
  ]
}
```

## AI/LLM Guidelines

When working with this add-on, AI SHOULD:

1. **Read** `db/schema/tables.json` to understand current schema
2. **Propose** schema changes by editing the mirror files
3. **Generate** migrations via `dbctl generate-migration`
4. **Document** intentions in `db/workdocs/`
5. **Never** directly connect to databases or run arbitrary SQL

Humans execute migrations and handle credentials.

## Verification

```bash
# Verify schema mirror is consistent
node .ai/scripts/dbctl.js verify

# Check migration status
node .ai/scripts/migrate.js status --env staging
```

## Rollback / Uninstall

Delete these paths:

- `db/`
- `.ai/scripts/dbctl.js`
- `.ai/scripts/migrate.js`
- `docs/addons/db-mirror/`
