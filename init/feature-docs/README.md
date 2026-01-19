# Feature Documentation

This directory contains human-facing docs for optional **features** that can be materialized during init **Stage C** (`apply`).

This template does **not** ship an `addons/` directory. Feature assets are integrated under `.ai/`:

- Templates: `.ai/skills/features/<feature-id>/feature-<feature-id>/templates/`
- Control scripts: `.ai/scripts/*ctl.js`
- Feature flags/state: `.ai/project/state.json` (via `.ai/scripts/projectctl.js`)

## Available features

| Feature ID | Blueprint toggle | Control script | Documentation |
|------------|------------------|----------------|---------------|
| `context-awareness` | `features.contextAwareness` | `contextctl.js` | [context-awareness.md](context-awareness.md) |
| `db-mirror` | `features.dbMirror` (requires `db.ssot=database`) | `dbctl.js` | [db-mirror.md](db-mirror.md) |
| `packaging` | `features.packaging` | `packctl.js` | [packaging.md](packaging.md) |
| `deployment` | `features.deployment` | `deployctl.js` | [deployment.md](deployment.md) |
| `release` | `features.release` | `releasectl.js` | [release.md](release.md) |
| `observability` | `features.observability` (requires `features.contextAwareness=true`) | `obsctl.js` | [observability.md](observability.md) |

## Enabling features

In `init/project-blueprint.json`:

```json
{
  "features": {
    "contextAwareness": true,
    "dbMirror": true,
    "packaging": true,
    "deployment": true,
    "release": true,
    "observability": true
  }
}
```

Then run Stage C apply:

```bash
node init/skills/initialize-project-from-requirements/scripts/init-pipeline.cjs apply --repo-root . --providers both
```

## Materialization semantics (Stage C)

By default, Stage C is **non-destructive**:

- Templates are copied into the repo using **copy-if-missing** (existing files are kept).
- Each enabled feature runs `node .ai/scripts/<ctl>.js init`.

Useful flags:

- `--force-features`: overwrite existing files when copying templates
- `--verify-features`: run `node .ai/scripts/<ctl>.js verify` after `init` (when available)
- `--non-blocking-features`: continue despite feature errors (default is fail-fast)

