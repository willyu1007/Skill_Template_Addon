# Init kit (robust 3-stage pipeline)

> Human-facing documentation. If you are an LLM/AI assistant, skip the file to save tokens and follow `init/AGENTS.md` instead.

The `init/` package provides a 3-stage, checkpointed workflow to bootstrap a repository from requirements:

- **Stage A**: Requirements docs (working location: `init/stage-a-docs/`)
- **Stage B**: Blueprint (working location: `init/project-blueprint.json`)
- **Stage C**: Scaffold + configs + skill packs + features + wrapper sync

It is designed for **robustness and auditability**:
- Each stage has a **validation step** (written into `init/.init-state.json`)
- Stage transitions require **explicit user approval** (`approve` command)
- Optional features are materialized **only when enabled in the blueprint** (`features.*`)

> **Working directory vs. final location**: During initialization, all working files are stored in `init/`. After completion, use `cleanup-init --archive` to move Stage A docs and blueprint to `docs/project/` for long-term retention.

---

## Quick start (run from repo root)

### 0) Initialize state
```bash
node init/skills/initialize-project-from-requirements/scripts/init-pipeline.cjs start --repo-root .
```

The command creates:
- `init/stage-a-docs/` - Stage A document templates
- `init/project-blueprint.json` - Blueprint template
- `init/.init-state.json` - State tracking file

### Preflight (recommended): terminology alignment

Before drafting Stage A docs, ask whether the user wants to align/confirm terminology now.

- If YES (sync): use `init/stage-a-docs/domain-glossary.md` as the terminology SSOT and align terms across Stage A docs.
- If NO (skip): record the decision in `init/stage-a-docs/domain-glossary.md` and continue.

See: `init/stages/00-preflight-terminology.md`.

### 1) Stage A: validate docs → approve
```bash
# Edit templates in init/stage-a-docs/, then validate:
node init/skills/initialize-project-from-requirements/scripts/init-pipeline.cjs check-docs \
  --repo-root . \
  --strict

# After the user explicitly approves Stage A:
node init/skills/initialize-project-from-requirements/scripts/init-pipeline.cjs approve --stage A --repo-root .
```

### 2) Stage B: validate blueprint → approve
```bash
# Edit init/project-blueprint.json, then validate:
node init/skills/initialize-project-from-requirements/scripts/init-pipeline.cjs validate \
  --repo-root .

# Optional: report recommended packs/features
node init/skills/initialize-project-from-requirements/scripts/init-pipeline.cjs suggest-packs \
  --repo-root .
node init/skills/initialize-project-from-requirements/scripts/init-pipeline.cjs suggest-features \
  --repo-root .

# After the user explicitly approves Stage B:
node init/skills/initialize-project-from-requirements/scripts/init-pipeline.cjs approve --stage B --repo-root .
```

### 3) Stage C: apply scaffold/configs/packs/features/wrappers → approve
```bash
node init/skills/initialize-project-from-requirements/scripts/init-pipeline.cjs apply \
  --repo-root . \
  --providers both

# After the user explicitly approves Stage C:
node init/skills/initialize-project-from-requirements/scripts/init-pipeline.cjs approve --stage C --repo-root .
```

### 4) Optional: cleanup after init

**Option A: Remove `init/` only** (Stage A docs and blueprint will be deleted)

```bash
node init/skills/initialize-project-from-requirements/scripts/init-pipeline.cjs cleanup-init \
  --repo-root . \
  --apply \
  --i-understand
```

**Option B: Archive to `docs/project/` + remove `init/`** (recommended for retaining docs)

```bash
node init/skills/initialize-project-from-requirements/scripts/init-pipeline.cjs cleanup-init \
  --repo-root . \
  --apply \
  --i-understand \
  --archive
```

The command archives Stage A docs and blueprint to `docs/project/`, then removes `init/`.

---

## Blueprint anatomy

The blueprint schema is:

- `init/skills/initialize-project-from-requirements/templates/project-blueprint.schema.json`

Key sections:

- `project.*`: name, description, and domain basics
- `db.ssot`: database schema single-source-of-truth
  - `none` | `repo-prisma` | `database`
- `context.*`: context configuration (does not enable the feature by itself)
- `capabilities.*`: informs scaffold and pack selection
- `features.*`: optional features to materialize during Stage C

## Optional features

This template does **not** ship an `addons/` directory. Feature assets are integrated under `.ai/`:

- Feature skills + templates: `.ai/skills/features/...`
- Control scripts: `.ai/scripts/...`
- Project state (feature flags): `.ai/project/state.json`

Stage C `apply` materializes a feature by copying templates into the repo and running the corresponding `*ctl.js init`.

| Feature | Blueprint toggle | Materializes | Control script |
|---------|------------------|--------------|----------------|
| Context awareness | `features.contextAwareness` | `docs/context/**`, `config/environments/**` | `.ai/scripts/contextctl.js` |
| DB mirror | `features.dbMirror` (requires `db.ssot=database`) | `db/**` | `.ai/scripts/dbctl.js` |
| Packaging | `features.packaging` | `ops/packaging/**`, `docs/packaging/**` | `.ai/scripts/packctl.js` |
| Deployment | `features.deployment` | `ops/deploy/**` | `.ai/scripts/deployctl.js` |
| Observability | `features.observability` (requires context awareness) | `docs/context/observability/**`, `observability/**` | `.ai/scripts/obsctl.js` |
| Release | `features.release` | `release/**`, `.releaserc.json.template` | `.ai/scripts/releasectl.js` |

For feature-specific details, see:

- `init/feature-docs/README.md`
- `.ai/skills/features/<feature-id>/feature-<feature-id>/SKILL.md`

## Apply flags (Stage C)

- `--force-features`: overwrite existing feature files when materializing templates
- `--verify-features`: run `*ctl.js verify` after `init` (fail-fast by default)
- `--non-blocking-features`: continue despite feature init/verify errors (not recommended)
