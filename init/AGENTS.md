# Agent guidance for the init kit

The repository includes an `init/` bootstrap kit that is intended to be executed in a **checkpointed** manner.

Key principles:

- Do not skip stages.
- Do not advance stages without explicit user approval.
- Do not hand-edit `init/.init-state.json` to change stages; use the pipeline commands.

---

## Canonical command entry point

Run from repo root:

```bash
node init/skills/initialize-project-from-requirements/scripts/init-pipeline.cjs <command> [options]
```

---

## Stage flow (validation + approval)

### Stage A (requirements docs)

Run `start` to begin initialization. This automatically creates all templates:

```bash
node init/skills/initialize-project-from-requirements/scripts/init-pipeline.cjs start --repo-root .
```

The command creates:
- `init/stage-a-docs/` - Stage A doc templates:
  - `requirements.md`
  - `non-functional-requirements.md`
  - `domain-glossary.md`
  - `risk-open-questions.md`
- `init/project-blueprint.json` - Blueprint template

1) Edit the Stage A doc templates, then validate:
```bash
node init/skills/initialize-project-from-requirements/scripts/init-pipeline.cjs check-docs --repo-root . --strict
```

2) After user approval:
```bash
node init/skills/initialize-project-from-requirements/scripts/init-pipeline.cjs approve --stage A --repo-root .
```

### Stage B (blueprint)

1) Edit `init/project-blueprint.json`, then validate:
```bash
node init/skills/initialize-project-from-requirements/scripts/init-pipeline.cjs validate --repo-root .
```

2) After user approval:
```bash
node init/skills/initialize-project-from-requirements/scripts/init-pipeline.cjs approve --stage B --repo-root .
```

### Stage C (apply)

Apply scaffold/configs/skill packs/wrapper sync:

```bash
node init/skills/initialize-project-from-requirements/scripts/init-pipeline.cjs apply --repo-root . --providers both
```

After user approval:
```bash
node init/skills/initialize-project-from-requirements/scripts/init-pipeline.cjs approve --stage C --repo-root .
```

---

## Add-on notes (context awareness)

If the blueprint enables context awareness (`addons.contextAwareness: true`), `apply` will:
- install missing files from `addons/context-awareness/payload/` (copy-if-missing; non-destructive)
- run `.ai/scripts/contextctl.js init`
- run `.ai/scripts/projectctl.js init` and `set-context-mode` (if projectctl exists)

`context.*` is configuration only and does not trigger installation.

See `addon-docs/context-awareness.md` for details.

---

## Cleanup

Only after completion and user confirmation:

**Option A: Remove `init/` only (all init files deleted)**

```bash
node init/skills/initialize-project-from-requirements/scripts/init-pipeline.cjs cleanup-init \
  --repo-root . --apply --i-understand
```

**Option B: Archive all to `docs/project/` + remove `init/`** (recommended if maintaining docs)

```bash
node init/skills/initialize-project-from-requirements/scripts/init-pipeline.cjs cleanup-init \
  --repo-root . --apply --i-understand --archive
```

The command archives Stage A docs and blueprint from `init/` to `docs/project/` before removing `init/`.

**Option C: Archive all + prune unused add-ons**

```bash
node init/skills/initialize-project-from-requirements/scripts/init-pipeline.cjs cleanup-init \
  --repo-root . --apply --i-understand --archive --cleanup-addons
```

**Selective archive options:**
- `--archive` - Archive all (docs + blueprint)
- `--archive-docs` - Archive Stage A docs only
- `--archive-blueprint` - Archive blueprint only
