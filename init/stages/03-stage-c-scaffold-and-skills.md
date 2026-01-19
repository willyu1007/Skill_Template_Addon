# Stage C: Scaffold + configs + skills

> **SSOT**: For the full command reference, see `init/skills/initialize-project-from-requirements/SKILL.md`.

Stage C applies the blueprint to the repository:

- create minimal directory scaffold
- generate configuration files (SSOT: `init/skills/initialize-project-from-requirements/scripts/scaffold-configs.cjs`)
- enable skill packs (prefers `skillsctl` when available)
- sync provider wrappers (`.ai/scripts/sync-skills.cjs`)
- materialize/initialize optional features (context awareness, db mirror, packaging, deployment, release, observability)
- optionally create DevOps convention scaffold (`ops/`)

---

## Dry-run scaffold (optional)

Before writing anything, you can preview the scaffold plan:

```bash
node init/skills/initialize-project-from-requirements/scripts/init-pipeline.cjs scaffold \
  --repo-root .
```

To actually create the scaffold files/folders (minimal set only):

```bash
node init/skills/initialize-project-from-requirements/scripts/init-pipeline.cjs scaffold \
  --repo-root . \
  --apply
```

Note: `scaffold` only creates directories/placeholders. It does not generate configs, enable packs, sync wrappers, or materialize features.

---

## Apply (recommended path)

From repo root:

```bash
node init/skills/initialize-project-from-requirements/scripts/init-pipeline.cjs apply \
  --repo-root . \
  --providers both
```

### What `apply` does

1. Validates the blueprint (same as `validate`)
2. Optionally validates Stage A docs (when `--require-stage-a` is set)
3. Applies scaffold (idempotent; "write-if-missing" for docs)
4. Generates config files via `init/skills/initialize-project-from-requirements/scripts/scaffold-configs.cjs`
5. Materializes enabled features by copying templates from `.ai/skills/features/**/templates/` and running the corresponding control scripts under `.ai/scripts/`.
6. Enables skill packs:
   - If `.ai/scripts/skillsctl.js` exists: **scheme A** (packs enabled via skillsctl)
   - Else: additive update of `.ai/skills/_meta/sync-manifest.json` includePrefixes
7. Syncs provider wrappers via `.ai/scripts/sync-skills.cjs`

---

## DevOps scaffold (optional)

If the blueprint indicates CI/DevOps needs, Stage C scaffold will create an `ops/` convention structure:

- `ops/packaging/{services,jobs,apps,scripts,workdocs}/`
- `ops/deploy/{http_services,workloads,clients,scripts,workdocs}/`

These are provider-agnostic placeholders intended to be extended.

---

## User approval checkpoint (complete init)

After reviewing the resulting scaffold/configs/skills changes, record approval and mark init complete:

```bash
node init/skills/initialize-project-from-requirements/scripts/init-pipeline.cjs approve --stage C --repo-root .
```

Optional: remove `init/` bootstrap kit after completion:

```bash
node init/skills/initialize-project-from-requirements/scripts/init-pipeline.cjs cleanup-init --repo-root . --apply --i-understand
```

If you want to keep Stage A docs + blueprint long-term, prefer:

```bash
node init/skills/initialize-project-from-requirements/scripts/init-pipeline.cjs cleanup-init --repo-root . --apply --i-understand --archive
```
