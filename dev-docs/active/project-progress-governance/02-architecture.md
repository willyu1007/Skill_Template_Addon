# 02 Architecture

## Overview
We add a **project-level governance layer** that aggregates task progress across `dev-docs/**` without changing the existing task execution workflow.

## Sources of truth (SoT)
- **Task progress SoT**: `dev-docs/**/active/<task>/00-overview.md`
  - Under `## Status`, must contain: `- State: planned|in-progress|blocked|done` (single value).
  - If a task is under `archive/`, its effective status is `archived`.
- **Task identity SoT**: `dev-docs/**/active/<task>/.ai-task.yaml`
  - `task_id: T-###` is the stable primary key.
  - Missing `.ai-task.yaml` is allowed during migration; governance `sync` can generate it.
- **Project semantic graph SoT**: `.ai/project/<project>/registry.yaml`
  - Milestone/Feature/Requirement/Task objects and mappings.
  - Defines `project.task_doc_roots` for multi-root scanning.
- **Derived views (non-SoT)**: `.ai/project/<project>/{dashboard.md,feature-map.md,task-index.md}`

## Controllers (Node ESM)
We keep two separate controllers:
- `.ai/scripts/ctl-project-state.mjs`
  - feature flags/state stored in `.ai/project/state.json`
  - used by init Stage C apply and feature docs
- `.ai/scripts/ctl-project-governance.mjs`
  - governance hub for progress aggregation and mapping
  - commands: `init|lint|sync|query|map`

## Planning + execution workflow
1. (Optional) Use `plan-maker` to create `dev-docs/active/<task>/roadmap.md`.
2. Use `create-dev-docs-plan` to create the task bundle under `dev-docs/**/active/<task>/`.
3. Update task progress in `00-overview.md` `- State: ...`.
4. Run governance sync:
   - `node .ai/scripts/ctl-project-governance.mjs sync --apply --project <project>`
5. CI / hooks enforce drift checks via lint/sync.

## Git hooks
We add `.githooks/` (optional install):
- `pre-commit`: when `dev-docs/` changes are staged, run governance sync so hub stays consistent.
- `commit-msg`: validate conventional commits.

## Init pipeline (Stage C apply)
Stage C `apply` should auto-initialize the governance hub:
- `node .ai/scripts/ctl-project-governance.mjs init --project main --repo-root .`

This is idempotent (copy-if-missing) and does not create any dev-docs bundles.
