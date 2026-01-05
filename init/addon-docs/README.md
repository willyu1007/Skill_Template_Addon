# Add-on Documentation

The directory contains documentation for each optional add-on supported by the init pipeline.

---

## Available Add-ons

| Add-on ID | Purpose | Control Script | Documentation |
|-----------|---------|----------------|---------------|
| `context-awareness` | API/DB/BPMN contracts for LLM context | `contextctl.js` | [context-awareness.md](context-awareness.md) |
| `db-mirror` | Database schema mirroring | `dbctl.js` | [db-mirror.md](db-mirror.md) |
| `packaging` | Container/artifact packaging | `packctl.js` | [packaging.md](packaging.md) |
| `deployment` | Multi-environment deployment | `deployctl.js` | [deployment.md](deployment.md) |
| `release` | Version and changelog management | `releasectl.js` | [release.md](release.md) |
| `observability` | Metrics/logs/traces contracts | `obsctl.js` | [observability.md](observability.md) |

---

## Add-on Convention

The init pipeline only uses add-ons when enabled in the blueprint.

### Expected structure

By default, the init pipeline expects:

```
<repoRoot>/
  addons/
    <addonId>/
      ADDON.md        # Add-on documentation
      VERSION         # Semantic version
      payload/        # Files to be merged into repoRoot (copy-if-missing)
        .ai/scripts/  # Control scripts
        docs/         # Documentation
        ...
```

You can override the add-ons root directory via:

```bash
node init/skills/initialize-project-from-requirements/scripts/init-pipeline.cjs apply --addons-root <path> ...
```

---

## Enabling Add-ons

Add-ons are enabled via the `project-blueprint.json`:

```json
{
  "addons": {
    "contextAwareness": true,
    "dbMirror": true,
    "packaging": true,
    "deployment": true,
    "release": true,
    "observability": true
  }
}
```

Or via capability-specific configuration:

```json
{
  "db": { "enabled": true },
  "ci": { "enabled": true },
  "packaging": { "enabled": true },
  "deploy": { "enabled": true },
  "release": { "enabled": true },
  "observability": { "enabled": true }
}
```

---

## Copy semantics (non-destructive)

When an add-on is enabled, Stage C `apply` will:

- copy files from `payload/` into `<repoRoot>/`
- **only when the destination file does not exist** (copy-if-missing)
- it will not overwrite existing files

This design is intentional for robustness:
- you can safely re-run `apply` without clobbering local modifications
- add-ons can be shipped as "capability payloads" without making upgrades destructive by default

### Upgrades / changes to an add-on

Because the pipeline does not overwrite existing files, upgrading an already-installed add-on is a deliberate action.

Recommended options:
- Update files manually (reviewed change)
- Or remove the installed files that you want to be replaced, then re-run `apply`

---

## Add-on payload requirements

To be compatible with this init kit, an add-on payload should:

1. Be self-contained under `payload/`
2. Be idempotent (running init commands multiple times should not break)
3. Avoid overwriting unrelated repo content
4. Provide clear entry scripts under `.ai/scripts/` (if it introduces new behavior)
5. Include an `init` command that accepts `--repo-root` parameter

See `addons/CONVENTION.md` for the full add-on convention specification.
