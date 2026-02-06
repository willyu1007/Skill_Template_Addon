# 04 Verification

## Repo governance checks
- Lint skills (SSOT):
  - `node .ai/scripts/lint-skills.mjs --strict`
- Result: PASS (75/75)
- Sync stubs (generated):
  - `node .ai/scripts/sync-skills.mjs --scope current --providers both --mode reset --yes`
- Result: PASS
- Lint docs formatting (optional but recommended):
  - `node .ai/scripts/lint-docs.mjs --strict`
- Result: PASS

## Governance controller checks
- Lint (CI friendly):
  - `node .ai/scripts/ctl-project-governance.mjs lint --check --project main`
  - Result: PASS (warns when hub not initialized; warns about missing `.ai-task.yaml` during migration)
- Sync (preview; no writes in the template repo):
  - `node .ai/scripts/ctl-project-governance.mjs sync --dry-run --project main --init-if-missing`
  - Result: PASS (would create `.ai/project/main/*` and allocate `.ai-task.yaml`)

## Init pipeline smoke test (throwaway repo outside template root)
- Create throwaway copy outside repo root.
- Run:
  - `node init/_tools/skills/initialize-project-from-requirements/scripts/init-pipeline.mjs start --repo-root . --lang en`
  - `node init/_tools/skills/initialize-project-from-requirements/scripts/init-pipeline.mjs apply --repo-root . --providers both --no-stage-gate`
- Expected/observed: apply logs include `[ok] Project hub initialized.` and `.ai/project/main/registry.yaml` exists.
