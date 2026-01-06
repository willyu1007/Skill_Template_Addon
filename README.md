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


## Optional add-ons (addon template)

This template includes opt-in add-ons under `addons/` (kept out of the default paths until enabled).

- `addons/context-awareness/` provides a context layer (`docs/context/`) and scripts that force all context updates through reproducible commands.

Enable via `init/project-blueprint.json`:

```json
{
  "addons": { "contextAwareness": true },
  "context": { "mode": "contract" }
}
```

`context.*` is optional configuration and does not trigger installation.

Then run Stage C (`init/.../init-pipeline.cjs apply`).
