# 00 Overview

## Status
- State: done
- Next step: Review/iterate on ergonomics (optional): pre-commit CI verification, `ctl-*` renames for other controllers.

## Goal
Implement **project-level progress governance** (project hub + lint/sync/query) that aggregates progress across `dev-docs/**` tasks while keeping the existing task-level workflow intact.

## Non-goals
- Do not change the location of any CI feature skill content under `.ai/skills/features/ci/`.
- Do not pre-create runtime project hub data (e.g. `.ai/project/main/`) in the template repository.
- Do not change any application/product code (this repo is a template/governance system).

## Context
- Current repo progress tracking is task-only (`dev-docs/**`).
- We want to adopt the Basic repo’s governance model (SoT separation + hub + controller + skills), but with renamed controllers:
  - State controller: `.ai/scripts/ctl-project-state.mjs`
  - Governance controller: `.ai/scripts/ctl-project-governance.mjs`
- Stage C `apply` in the init pipeline should auto-run `ctl-project-governance init`.

## Acceptance criteria (high level)
- [ ] `dev-docs/**/active/<task>/00-overview.md` uses a **single** `- State: <planned|in-progress|blocked|done>` value (template updated).
- [ ] Project governance contract exists at `.ai/project/CONTRACT.md` and documents SoT, enums, scanning, and lint/sync policies.
- [ ] Governance controller exists at `.ai/scripts/ctl-project-governance.mjs` with commands: `init|lint|sync|query|map`.
- [ ] State controller is renamed to `.ai/scripts/ctl-project-state.mjs` and all internal references are updated (init pipeline + docs + skills).
- [ ] `.ai/skills/workflows/planning/` includes governance skills: `project-orchestrator`, `project-sync-lint`, `project-status-reporter` (ported and updated to new script names).
- [ ] `.githooks/` exists with `install.mjs`, `pre-commit`, `commit-msg`; `pre-commit` syncs hub on staged dev-docs changes.
- [ ] Stage C `apply` auto-initializes the project hub via `node .ai/scripts/ctl-project-governance.mjs init --project main`.
- [ ] `node .ai/scripts/lint-skills.mjs --strict` passes and stub sync works.
