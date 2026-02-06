# 03 Implementation notes

## Decisions
- Two separate controllers:
  - `node .ai/scripts/ctl-project-state.mjs` manages `.ai/project/state.json` (feature/state)
  - `node .ai/scripts/ctl-project-governance.mjs` manages `.ai/project/<project>/` (project progress hub)
- Governance hub lives under `.ai/project/<project>/` (Basic-style) and coexists with `.ai/project/state.json`.
- CI feature skill content stays under `.ai/skills/features/ci/` (no relocations); hooks may invoke scripts but skills remain SSOT under `.ai/skills/`.
- Init Stage C apply auto-initializes the governance hub (best-effort, idempotent).

## Changes (high level)
- Added: `.ai/project/AGENTS.md`, `.ai/project/CONTRACT.md`
- Added: `.ai/scripts/ctl-project-governance.mjs`
- Renamed: `.ai/scripts/projectctl.mjs` → `.ai/scripts/ctl-project-state.mjs`
- Added: `.ai/skills/workflows/planning/project-orchestrator/`
- Added: `.ai/skills/workflows/planning/project-status-reporter/`
- Added: `.ai/skills/workflows/planning/project-sync-lint/` (+ templates)
- Added: `.githooks/` (install + pre-commit + commit-msg)
- Updated: init pipeline + feature docs + feature skills to reference `ctl-project-state.mjs`
- Updated: dev-docs overview template to single-value `State: planned`

## Open issues / follow-ups
- Optional: Decide whether `.githooks/pre-commit` should run CI verification when CI config files are staged.
