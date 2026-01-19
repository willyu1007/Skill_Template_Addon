# Context Awareness Feature (Optional)

## Conclusions (read first)

- The feature installs a **stable, verifiable project context layer** under `docs/context/` (API, DB schema mapping, BPMN, and additional artifacts).
- The feature also provides **environment configuration management** under `docs/context/config/` and `config/environments/`.
- The feature provides **project-level scripts** that MUST be used to change the context:
  - `node .ai/scripts/contextctl.js` (context artifacts + registry + environments)
  - `node .ai/scripts/projectctl.js` (project state/config)
  - `node .ai/scripts/skillsctl.js` (skills pack switching + wrapper sync)
- The goal is to make an LLM "context-aware" without relying on ad-hoc folder scans:
  - The LLM reads `docs/context/INDEX.md` and `docs/context/registry.json` as the entry point.
  - Environment constraints are in `docs/context/config/environment-registry.json`.
  - CI can run `contextctl verify --strict` to enforce "changes go through scripts".

## What this feature writes (blast radius)

New files/directories (created if missing):

- `docs/context/**` (context artifacts and registry)
- `docs/context/config/**` (environment registry)
- `.ai/skills/features/context-awareness/**` (documentation for this feature)
- `config/environments/**` (environment config templates)
- `.ai/scripts/{contextctl.js,projectctl.js,skillsctl.js,explain-context-feature.js}`
- `.ai/project/{state.json,state.schema.json}`
- `.ai/skills/scaffold/**` (optional scaffold skills for context/packs/state)
- `.ai/skills/_meta/packs/{context-core.json,scaffold-core.json}` (pack definitions)


## Install

### Option A: Via init pipeline (recommended)

Enable in your blueprint:

```json
{
  "features": {
    "contextAwareness": true
  },
  "context": {
    "enabled": true,
    "mode": "contract",
    "environments": ["dev", "staging", "prod"]
  }
}
```

Then run:

```bash
node init/skills/initialize-project-from-requirements/scripts/init-pipeline.cjs apply \
  --blueprint init/project-blueprint.json
```

### Option B: Materialize templates manually

If you are not using the init pipeline, you can materialize the feature templates directly:

1. Copy the feature templates into the repository root (merge, copy-if-missing):
   - Source: `.ai/skills/features/context-awareness/feature-context-awareness/templates/`
   - Destination: repo root
2. Initialize (idempotent):
   ```bash
   node .ai/scripts/projectctl.js init
   node .ai/scripts/projectctl.js set-context-mode contract
   node .ai/scripts/projectctl.js set context.enabled true
   node .ai/scripts/contextctl.js init
   ```
3. (Optional) Enable the scaffold/context pack and sync wrappers:
   ```bash
   node .ai/scripts/skillsctl.js enable-pack context-core --providers both
   ```


## Environment Configuration

The feature includes environment configuration management:

### Environment Registry

`docs/context/config/environment-registry.json` defines:
- Available environments (dev, staging, prod, etc.)
- Database access policies per environment
- Deployment permissions
- Secrets source information

### Config Templates

`config/environments/` contains YAML templates:
- `dev.yaml.template` - Development configuration
- `staging.yaml.template` - Staging configuration
- `prod.yaml.template` - Production configuration

Copy templates to actual config files (remove `.template` suffix) and fill in values.
**Never commit actual secrets to version control.**

### Environment Commands

```bash
# Add a new environment
node .ai/scripts/contextctl.js add-env --id qa --description "QA environment"

# List all environments
node .ai/scripts/contextctl.js list-envs

# Verify environment configuration
node .ai/scripts/contextctl.js verify-config --env staging
```

## Artifact Commands

```bash
# Add an artifact
node .ai/scripts/contextctl.js add-artifact --id my-api --type openapi --path docs/context/api/my-api.yaml

# Remove an artifact
node .ai/scripts/contextctl.js remove-artifact --id old-api

# Update checksums after editing artifacts
node .ai/scripts/contextctl.js touch

# List all artifacts
node .ai/scripts/contextctl.js list
```

## Verification

- Context layer exists and is consistent:
  ```bash
  node .ai/scripts/contextctl.js verify --strict
  ```
- Environment configuration is valid:
  ```bash
  node .ai/scripts/contextctl.js verify-config
  ```
- Project state is valid:
  ```bash
  node .ai/scripts/projectctl.js verify
  ```
- Skills wrappers are synced (if you enabled packs):
  ```bash
  node .ai/scripts/skillsctl.js sync --providers both
  ```

## Rollback / Uninstall

Delete these paths (if you want a clean uninstall):

- `docs/context/`
- `.ai/skills/features/context-awareness/`
- `config/environments/`
- `.ai/scripts/contextctl.js`
- `.ai/scripts/projectctl.js`
- `.ai/scripts/skillsctl.js`
- `.ai/scripts/explain-context-feature.js`
- `.ai/project/`
- `.ai/skills/scaffold/` (only if you installed the feature's scaffold skills)
- `.ai/skills/_meta/packs/context-core.json`
- `.ai/skills/_meta/packs/scaffold-core.json`

Then re-sync wrappers:
```bash
node .ai/scripts/sync-skills.cjs --scope current --providers both --mode update
```
