# Init kit (robust 3-stage pipeline)

> Human-facing documentation. If you are an LLM/AI assistant, skip the file to save tokens and follow `init/AGENTS.md` instead.

The `init/` package provides a 3-stage, checkpointed workflow to bootstrap a repository from requirements:

- **Stage A**: Requirements docs (working location: `init/stage-a-docs/`)
- **Stage B**: Blueprint (working location: `init/project-blueprint.json`)
- **Stage C**: Scaffold + configs + skill packs + add-ons + wrapper sync

It is designed for **robustness and auditability**:
- Each stage has a **validation step** (written into `init/.init-state.json`)
- Stage transitions require **explicit user approval** (`approve` command)
- Optional add-ons are installed **only when enabled in the blueprint**

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

# After the user explicitly approves Stage B:
node init/skills/initialize-project-from-requirements/scripts/init-pipeline.cjs approve --stage B --repo-root .
```

### 3) Stage C: apply scaffold/configs/packs/addons/wrappers → approve
```bash
node init/skills/initialize-project-from-requirements/scripts/init-pipeline.cjs apply \
  --repo-root . \
  --providers both

# Optional: verify add-ons after installation (fail-fast by default).
# Use --non-blocking-addons to continue despite verify failures.
# node init/skills/initialize-project-from-requirements/scripts/init-pipeline.cjs apply \
#   --repo-root . \
#   --providers both \
#   --verify-addons

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

**Option C: Archive + prune unused add-ons** (recommended for minimal final repo)

```bash
node init/skills/initialize-project-from-requirements/scripts/init-pipeline.cjs cleanup-init \
  --repo-root . \
  --apply \
  --i-understand \
  --archive \
  --cleanup-addons
```

The command archives files, removes `init/`, and deletes add-on source directories under `addons/` that were not enabled in the blueprint.

---

## Documentation Structure

### Single Sources of Truth (SSOT)

| Topic | Location |
|-------|----------|
| Init behavior & commands | `skills/initialize-project-from-requirements/SKILL.md` |
| Technical reference | `skills/initialize-project-from-requirements/reference.md` |
| LLM guidance | `skills/initialize-project-from-requirements/templates/llm-init-guide.md` |
| Question bank | `skills/initialize-project-from-requirements/templates/conversation-prompts.md` |
| Add-on conventions | `addon-docs/README.md` |

### Supporting docs

| Document | Purpose |
|----------|---------|
| `README.md` (this file) | Quick start overview |
| `AGENTS.md` | AI agent guidance |
| `stages/*.md` | Stage-specific details |
| `addon-docs/*.md` | Individual add-on documentation |

---

## Available Add-ons

This init kit supports multiple optional add-ons:

| Add-on | Blueprint Toggle | Purpose |
|--------|-----------------|---------|
| Context Awareness | `addons.contextAwareness` | API/DB/BPMN contracts for LLM |
| DB Mirror | `addons.dbMirror` | Database schema mirroring |
| Packaging | `addons.packaging` | Container/artifact packaging |
| Deployment | `addons.deployment` | Multi-environment deployment |
| Release | `addons.release` | Version/changelog management |
| Observability | `addons.observability` | Metrics/logs/traces contracts |

### Enabling Add-ons

In `project-blueprint.json`:

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

**Important:** Only `addons.*` toggles trigger add-on installation. The top-level configuration blocks (`db`, `ci`, `packaging`, `deploy`, `release`, `observability`) are for **configuration parameters only** and do not trigger installation:

```json
{
  "addons": {
    "dbMirror": true,          // ← triggers db-mirror add-on installation
    "packaging": true          // ← triggers packaging add-on installation
  },
  "db": {
    "kind": "postgres",        // ← configuration only, does NOT trigger installation
    "migrationTool": "prisma"
  },
  "ci": {
    "platform": "github-actions",  // ← configuration only, does NOT trigger installation
    "features": ["lint", "test"]
  }
}
```

Use `suggest-addons` to get recommendations based on your blueprint capabilities:

```bash
node init/skills/initialize-project-from-requirements/scripts/init-pipeline.cjs suggest-addons \
  --blueprint init/project-blueprint.json --write
```

See:
- `addon-docs/README.md` - Add-on conventions
- `addon-docs/*.md` - Individual add-on documentation
- `addons/CONVENTION.md` - Full convention specification

---

## LLM-Guided Initialization

The init kit supports an AI assistant guiding users through the full initialization workflow.

### Flow

```
requirements interview → tech stack selection → blueprint generation → add-on recommendations → config generation → apply
```

### Supported languages

| Language | Template support | Config generation |
|----------|------------------|------------------|
| TypeScript/JavaScript | ✅ | built-in templates |
| Go | ✅ | built-in templates |
| C/C++ (xmake) | ✅ | built-in templates |
| React Native | ✅ | built-in templates |
| Python | ❌ | LLM-generated |
| Java/Kotlin | ❌ | LLM-generated |
| .NET (C#) | ❌ | LLM-generated |
| Rust | ❌ | LLM-generated |
| Other | ❌ | LLM-generated |

### Guidance docs

- `skills/initialize-project-from-requirements/templates/llm-init-guide.md` - full guide for LLM-driven initialization
- `skills/initialize-project-from-requirements/templates/conversation-prompts.md` - question bank / conversation modules

### Handling languages without templates

When the user selects a language without a built-in template:
1. `scaffold-configs.cjs` prints guidance and config recommendations
2. The LLM generates config files based on `llm-init-guide.md`
3. After user confirmation, continue with `apply`

---

## DevOps scaffold (optional)

If the blueprint indicates CI/DevOps needs, Stage C scaffolding can create an `ops/` convention folder:

- `ops/packaging/{services,jobs,apps,scripts,workdocs}/`
- `ops/deploy/{http_services,workloads,clients,scripts,workdocs}/`

When add-ons are enabled, they provide more complete implementations with management scripts.

---

## Files in the init kit

- `stages/` - stage guidance docs
- `skills/initialize-project-from-requirements/` - the skill definition and scripts
  - `templates/project-blueprint.example.json` - full example (all add-ons enabled)
  - `templates/project-blueprint.min.example.json` - minimal example (backend only)
  - `templates/llm-init-guide.md` - LLM initialization guide
  - `templates/conversation-prompts.md` - question bank and conversation modules
- `addon-docs/` - add-on documentation
  - `README.md` - add-on conventions and index
  - `*.md` - individual add-on documentation
- `.init-kit` - marker file
