---
name: feature-context-awareness
description: Enable and operate the Context Awareness feature (docs/context contracts + environment registry) so LLMs can work from a verified context layer instead of ad-hoc repo scans.
---

# Context Awareness Feature

## Intent

Provide a **stable, verifiable, LLM-readable context layer** under `docs/context/`.

This feature standardizes how the project exposes:

- API contracts (OpenAPI)
- Database schema contract (LLM-readable JSON)
- Process contracts (BPMN)
- Environment registry (what exists; policies; *no secrets*)

The main outcome is that the LLM can load a small number of canonical entry points and avoid fragile whole-repo discovery.

## What gets enabled

When enabled (typically during init), the feature **materializes** these paths in the repo root:

- `docs/context/**` (contracts + registry)
- `config/environments/**` (environment config templates; no secrets)

And it assumes these controller scripts exist (they are part of the template SSOT under `.ai/scripts/`):

- `node .ai/scripts/contextctl.js` — context registry + artifacts + env registry
- `node .ai/scripts/projectctl.js` — project state (`.ai/project/state.json`)
- `node .ai/scripts/skillsctl.js` — skill pack switching + wrapper sync

## Canonical entry points for LLMs

1. `docs/context/INDEX.md`
2. `docs/context/registry.json`
3. `docs/context/config/environment-registry.json`

If a DB schema exists, the canonical DB contract is:

- `docs/context/db/schema.json`

That DB contract is produced by the DB SSOT workflow (see `dbssotctl`, and the database workflow skills).

## How to enable

### Path A — During init (recommended)

In `init/project-blueprint.json`:

- Set `features.contextAwareness = true`

Then run init Stage C apply:

```bash
node init/skills/initialize-project-from-requirements/scripts/init-pipeline.cjs apply --providers both
```

Init will:

- Copy this feature’s templates into the repo root
- Run `contextctl init` and `projectctl init`
- Record feature flags in `.ai/project/state.json`

### Path B — Enable in an existing repo

If you must enable after init, you can:

1. Copy templates from:
   - `.ai/skills/features/context-awareness/feature-context-awareness/templates/`
   into the repo root.
2. Run:

```bash
node .ai/scripts/projectctl.js init
node .ai/scripts/projectctl.js set context.enabled true
node .ai/scripts/contextctl.js init
node .ai/scripts/contextctl.js touch
```

## Operating rules

### Editing artifacts

After editing any file under `docs/context/**`:

```bash
node .ai/scripts/contextctl.js touch
```

### Managing environments

```bash
node .ai/scripts/contextctl.js list-envs
node .ai/scripts/contextctl.js add-env --id qa --description "QA environment"
node .ai/scripts/contextctl.js verify-config
```

## Verification

```bash
node .ai/scripts/contextctl.js verify --strict
node .ai/scripts/projectctl.js verify
```

## Related skills

- `manage-project-context` (scaffold skill)
- `manage-project-state` (scaffold skill)
- `manage-skill-packs` (scaffold skill)

These live under `.ai/skills/scaffold/**` and can be enabled via packs.

## Boundaries

- Do NOT store credentials or secrets in `docs/context/` or `config/`.
- Do NOT hand-edit generated context artifacts without re-running `contextctl touch`.
- Use DB SSOT workflows to update `docs/context/db/schema.json`.
