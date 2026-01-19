# Feature: DB mirror

## Conclusions (read first)

- Provides a repo-local database schema mirror under `db/` (tables + migrations)
- Keeps DB work auditable for LLMs without requiring DB credentials
- Intended for the **database SSOT** mode (`db.ssot=database`)

## Requirements

- `db.ssot` must be `database`
- `features.dbMirror` must be `true`

The init pipeline will reject invalid combinations (e.g. `features.dbMirror=true` with `db.ssot!=database`).

## How to enable

In `init/project-blueprint.json`:

```json
{
  "db": {
    "enabled": true,
    "ssot": "database",
    "kind": "postgres",
    "environments": ["dev", "staging", "prod"]
  },
  "features": {
    "dbMirror": true
  }
}
```

## What Stage C `apply` does

When enabled, Stage C:

1) Copies templates from:
- `.ai/skills/features/db-mirror/feature-db-mirror/templates/`

2) Runs the controller:

```bash
node .ai/scripts/dbctl.js init --repo-root .
```

3) Optional verification (when Stage C is run with `--verify-features`):

```bash
node .ai/scripts/dbctl.js verify --repo-root .
```

## Key outputs

- `db/` (schema mirror + migrations)
- `.ai/scripts/dbctl.js` and `.ai/scripts/migrate.js` (DB tooling)

## Common commands

```bash
# Add a table
node .ai/scripts/dbctl.js add-table --name users --columns "id:uuid:pk,email:string:unique"

# Generate migration
node .ai/scripts/dbctl.js generate-migration --name add-user-roles

# List migrations
node .ai/scripts/migrate.js list
```

## Context bridge (optional)

If context awareness is enabled, you can sync the DB mirror into `docs/context/`:

```bash
node .ai/scripts/dbctl.js sync-to-context --repo-root .
```

