# Project Progress Governance — Roadmap

## Goal
- Add a project-level governance layer (hub + lint/sync/query) that aggregates progress across `dev-docs/**` while preserving the existing task-level workflow.

## Non-goals
- Move or restructure any CI feature skill content under `.ai/skills/features/ci/`.
- Pre-create runtime project hub data in the template repo (hub is created by init/pipeline/hook).

## Open questions and assumptions
### Open questions (answer before execution)
- Q1: Should pre-commit also run CI verification (`cictl.mjs verify`) when CI config files are staged?

### Assumptions (if unanswered)
- A1: `pre-commit` only runs governance sync on `dev-docs/` changes (risk: low).

## Scope and impact
- Affected areas/modules: `.ai/project/`, `.ai/scripts/`, `.ai/skills/workflows/planning/`, `dev-docs/`, `init/_tools/`, `.githooks/`
- External interfaces/APIs: none (repo-internal governance tooling only)
- Data/storage impact: new hub files under `.ai/project/<project>/`
- Backward compatibility: breaking change for script names; mitigated by updating all repo references (optional deprecation shims are possible if needed).

## Milestones
1. **Milestone 1**: Governance layer introduced
   - Deliverable: contract/docs + `ctl-project-governance` + new skills + hub templates
   - Acceptance criteria: governance `init/lint/sync/query` works on this repo
2. **Milestone 2**: Repo integration complete
   - Deliverable: `ctl-project-state` rename + `.githooks` + Stage C apply auto-init hub
   - Acceptance criteria: init pipeline Stage C apply creates hub in a fresh throwaway repo

## Step-by-step plan (phased)
### Phase 0 — Discovery
- Objective: map all references to `projectctl.mjs` (state) and decide which are governance vs state.
- Verification:
  - `rg -n \"\\.ai/scripts/projectctl\\.mjs\" -S .`

### Phase 1 — Governance scaffolding
- Deliverables:
  - `.ai/project/CONTRACT.md`, `.ai/project/AGENTS.md`
  - `.ai/scripts/ctl-project-governance.mjs`
  - Planning workflow skills + hub templates
- Verification:
  - `node .ai/scripts/ctl-project-governance.mjs lint --check --project main`

### Phase 2 — State controller rename
- Deliverables:
  - `.ai/scripts/ctl-project-state.mjs`
  - Updated docs/pipeline/skills references
- Verification:
  - init pipeline Stage C apply does not reference old path

### Phase 3 — Hooks + Stage C integration
- Deliverables:
  - `.githooks/install.mjs`, `.githooks/pre-commit`, `.githooks/commit-msg`
  - Stage C apply runs `ctl-project-governance init`
- Verification:
  - Smoke test in throwaway repo

## Verification and acceptance criteria
- Automated checks:
  - `node .ai/scripts/lint-skills.mjs --strict`
  - `node .ai/scripts/lint-docs.mjs --strict`
- Manual checks:
  - Run Stage C apply in a throwaway repo and confirm `.ai/project/main/registry.yaml` exists.

## Risks and mitigations
| Risk | Likelihood | Impact | Mitigation | Detection | Rollback |
|---|---:|---:|---|---|---|
| Script rename breaks init pipeline | med | high | update all references; smoke test | Stage C apply fails | revert rename |
| Governance hub/state dir confusion | low | med | explicit docs in `.ai/project/AGENTS.md` | reviewer confusion | add docs clarifying |

## To-dos
- [ ] Decide whether pre-commit should also invoke CI verify on CI config changes
