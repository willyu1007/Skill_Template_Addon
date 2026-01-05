# Add-ons

Optional feature modules installed on-demand during project initialization.

## Available Add-ons

| Add-on | Purpose | Control Script |
|--------|---------|----------------|
| `context-awareness` | API/DB/BPMN contracts for LLM context | `contextctl.js` |
| `db-mirror` | Database schema mirroring | `dbctl.js` |
| `packaging` | Container/artifact packaging | `packctl.js` |
| `deployment` | Multi-environment deployment | `deployctl.js` |
| `release` | Version and changelog management | `releasectl.js` |
| `observability` | Metrics/logs/traces contracts | `obsctl.js` |

## Routing

| Task | Entry Point |
|------|-------------|
| Understand add-on structure | `addons/CONVENTION.md` |
| Configure specific add-on | `addons/<addon-id>/ADDON.md` |
| Enable add-ons for new project | `init/AGENTS.md` |
| Add-on user documentation | `init/addon-docs/README.md` |

## Activation

Add-ons are enabled via `project-blueprint.json`:

```json
{
  "addons": {
    "contextAwareness": true,
    "dbMirror": false,
    "packaging": true
  }
}
```

Installation occurs during `init-pipeline.cjs apply`.

## Rules

- Edit `addons/<addon-id>/ADDON.md` as source of truth
- Use control scripts (`*ctl.js`) for runtime management
- Payloads use copy-if-missing semantics (idempotent)
- Do not modify installed files directly; re-run control scripts
