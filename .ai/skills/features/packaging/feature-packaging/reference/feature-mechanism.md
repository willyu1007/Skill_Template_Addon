# Packaging Feature (Optional)

## Conclusions (read first)

- This feature provides **container and artifact packaging** infrastructure.
- Manages Dockerfiles, build scripts, and artifact registries.
- AI proposes packaging configurations; humans execute builds.

## What this feature writes (blast radius)

New files/directories (created if missing):

- `ops/packaging/` (packaging root)
  - `ops/packaging/AGENTS.md` (LLM guidance)
  - `ops/packaging/services/` (service Dockerfiles)
  - `ops/packaging/jobs/` (job/batch Dockerfiles)
  - `ops/packaging/apps/` (app Dockerfiles)
  - `ops/packaging/templates/` (Dockerfile templates)
  - `ops/packaging/scripts/` (build scripts)
  - `ops/packaging/workdocs/` (packaging plans)
- `docs/packaging/registry.json` (artifact registry)
- `.ai/scripts/packctl.js` (packaging management)
- `.ai/scripts/build.js` (build execution)
- `.ai/skills/features/packaging/` (feature documentation)

## Install

### Option A: Via init pipeline (recommended)

Enable in your blueprint:

```json
{
  "features": {
    "packaging": true
  },
  "packaging": {
    "enabled": true,
    "containerize": true,
    "targets": ["services", "jobs"],
    "registry": "ghcr.io/${GITHUB_REPOSITORY}"
  }
}
```

Then run:

```bash
node init/skills/initialize-project-from-requirements/scripts/init-pipeline.cjs apply --blueprint init/project-blueprint.json
```

### Option B: Install manually

1. Materialize templates into the repository root:
   - From: `.ai/skills/features/packaging/feature-packaging/templates/`
   - To: repo root
   - Copy-if-missing (non-destructive merge)
2. Initialize packaging:
   ```bash
   node .ai/scripts/packctl.js init
   ```

## Usage

### Register Targets

```bash
# Register a service
node .ai/scripts/packctl.js add-service --id api --module apps/backend

# Register a job
node .ai/scripts/packctl.js add-job --id cron-task --module jobs/cron

# List all targets
node .ai/scripts/packctl.js list
```

### Build Artifacts

```bash
# Build a specific target
node .ai/scripts/packctl.js build --target api --tag v1.0.0

# Build all targets
node .ai/scripts/packctl.js build-all --tag v1.0.0

# Verify packaging configuration
node .ai/scripts/packctl.js verify
```

## Artifact Registry

`docs/packaging/registry.json` tracks all packaging targets:

```json
{
  "targets": [
    {
      "id": "api",
      "type": "service",
      "module": "apps/backend",
      "dockerfile": "ops/packaging/services/api.Dockerfile"
    }
  ]
}
```

## Dockerfile Templates

Templates in `ops/packaging/templates/`:

- `Dockerfile.node` - Node.js applications
- `Dockerfile.python` - Python applications
- `Dockerfile.go` - Go applications

## Verification

```bash
# Verify packaging configuration
node .ai/scripts/packctl.js verify

# List registered targets
node .ai/scripts/packctl.js list
```

## Rollback / Uninstall

Delete these paths:

- `ops/packaging/`
- `docs/packaging/`
- `.ai/scripts/packctl.js`
- `.ai/scripts/build.js`
- `.ai/skills/features/packaging/`
