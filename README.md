# AI-Friendly Repository Template (Basic)

This repository is a starter template for building **LLM-first** codebases with:

- **Single Source of Truth (SSOT)** skills under `.ai/skills/`
- Generated provider wrappers under `.codex/skills/` and `.claude/skills/`
- A **verifiable, 3-stage initialization pipeline** under `init/`

## Quick start

| For | Action |
|-----|--------|
| **AI Assistants** | Read `init/AGENTS.md` and run the Stage A/B/C pipeline |
| **Humans** | Read `init/README.md` and follow the steps |

## Repository layout (high-level)

```
init/                         # Project bootstrap kit (Stage A/B/C)
  README.md
  AGENTS.md
  stages/
  skills/                     # Init-related workflow skill + scripts/templates

.ai/
  skills/                     # SSOT skills (edit here only)
  scripts/                    # `sync-skills.cjs` (generates provider wrappers)

.codex/skills/                # Generated wrappers (DO NOT EDIT)
.claude/skills/               # Generated wrappers (DO NOT EDIT)

dev-docs/                     # Complex task documentation
```

## Key rules (SSOT + wrappers)

- **MUST** edit skills only in `.ai/skills/`.
- **MUST NOT** edit `.codex/skills/` or `.claude/skills/` directly.
- After changing `.ai/skills/`, regenerate wrappers:

```bash
node .ai/scripts/sync-skills.cjs --scope current --providers both --mode reset --yes
```

## Pointers

- Initialization: `init/README.md`
- AI assistant rules: `AGENTS.md` and `init/AGENTS.md`
- Skill authoring standard: `.ai/skills/standards/documentation-guidelines/SKILL.md`
- Documentation standard: `.ai/skills/standards/documentation-guidelines/SKILL.md`


## Optional features (no-addon template)

This template does **not** ship an `addons/` directory. Optional features are materialized during init **Stage C** based on `init/project-blueprint.json`:

- Feature toggles: `features.*` (see `init/feature-docs/README.md`)
- Assets live under `.ai/skills/features/**/templates` and `.ai/scripts/*ctl.js`
- Stage C `apply` copies templates (copy-if-missing by default) and runs `*ctl.js init`

Example:

```json
{
  "features": { "contextAwareness": true },
  "context": { "mode": "contract" }
}
```

`context.*` is configuration only and does not enable the feature by itself.
