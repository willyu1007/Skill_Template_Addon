# 01 Plan

## Phases (task-level)
1. **Phase 1 — Documentation & contract**
   - Define SoT separation, statuses, IDs, scanning rules, and drift policies.
2. **Phase 2 — Governance runtime**
   - Add `ctl-project-governance` (init/lint/sync/query/map) + hub templates + planning workflow skills.
3. **Phase 3 — State controller rename**
   - Rename current `.ai/scripts/projectctl.mjs` → `.ai/scripts/ctl-project-state.mjs` and update all references.
4. **Phase 4 — Hooks + init pipeline integration**
   - Add `.githooks/` and wire Stage C apply to auto-init the governance hub.
5. **Phase 5 — Verification**
   - Repo lints + smoke tests in a throwaway repo outside the template root.

## Detailed steps
- Create this dev-docs bundle under `dev-docs/active/project-progress-governance/`.
- Port from `D:/Else/Skill_Template_Basic` (with name adjustments):
  - `.ai/project/CONTRACT.md`, `.ai/project/AGENTS.md`
  - `.ai/scripts/projectctl.mjs` → `.ai/scripts/ctl-project-governance.mjs`
  - `.ai/skills/workflows/planning/{project-orchestrator,project-sync-lint,project-status-reporter}/`
  - `.ai/skills/workflows/planning/project-sync-lint/templates/main/*`
  - `.githooks/{install.mjs,pre-commit,commit-msg}`
- Update current repo task docs templates to be governance-compatible:
  - `.ai/skills/workflows/dev-docs/create-dev-docs-plan/templates/00-overview.md` `State:` becomes single-value `planned`.
  - Update `create-dev-docs-plan` docs to describe single-value State (if needed).
- Rename current repo state controller:
  - Move `.ai/scripts/projectctl.mjs` → `.ai/scripts/ctl-project-state.mjs`
  - Update references in:
    - `init/_tools/feature-docs/context-awareness.md`
    - `init/_tools/feature-docs/README.md`
    - `init/_tools/skills/initialize-project-from-requirements/scripts/init-pipeline.mjs`
    - any skills/docs that mention `.ai/scripts/projectctl.mjs`
- Integrate Stage C apply:
  - Ensure Stage C apply runs:
    - `node .ai/scripts/ctl-project-state.mjs init ...` (feature flags/state)
    - `node .ai/scripts/ctl-project-governance.mjs init --project main ...` (governance hub)
- Update `.githooks/pre-commit`:
  - When staged paths include `dev-docs/`, run `ctl-project-governance sync --apply` for all initialized projects.
  - Stage any generated/updated hub files and `.ai-task.yaml` files.

## Risks & mitigations
- Risk: Script rename breaks init pipeline or feature docs.
  - Mitigation: rg-scan + update all references; add verification commands + smoke test.
- Risk: `.ai/project/` becomes semantically overloaded (`state.json` vs governance hub).
  - Mitigation: Explicit docs: `.ai/project/state.json` is state; `.ai/project/<project>/` is governance hub.
- Risk: Governance sync rewrites `registry.yaml` formatting/comments.
  - Mitigation: Treat registry as machine-managed SSOT; document the rule in contract.
