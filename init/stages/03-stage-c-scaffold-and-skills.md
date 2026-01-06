# Stage C: Scaffold + configs + skills

> **SSOT**: For the complete command reference, see `init/skills/initialize-project-from-requirements/SKILL.md`.

Stage C applies the blueprint to the repository:

- create minimal directory scaffold
- generate configuration files (SSOT: `scripts/scaffold-configs.cjs`)
- enable skill packs (manifest / skillsctl scheme A)
- sync provider wrappers (`.ai/scripts/sync-skills.cjs`)
- optionally install/initialize add-ons (context awareness)
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
4. Generates config files via `scripts/scaffold-configs.cjs`
5. If context awareness is enabled in the blueprint:
   - installs missing add-on payload files from `addons/context-awareness/payload/` (copy-if-missing)
   - runs `.ai/scripts/contextctl.js init`
   - runs `.ai/scripts/projectctl.js init` and `set-context-mode` (if projectctl exists)
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

Note: in an interactive shell, the approve step will ask whether to keep the `addons/` directory; choosing to clean will delete the add-on payloads under `addons/` (installed project files remain).

Optional: remove `init/` bootstrap kit after completion:

```bash
node init/skills/initialize-project-from-requirements/scripts/init-pipeline.cjs cleanup-init --repo-root . --apply --i-understand
```
