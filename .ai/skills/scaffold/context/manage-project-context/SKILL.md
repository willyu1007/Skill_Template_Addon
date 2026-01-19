---
name: manage-project-context
description: Maintain docs/context (API, DB schema mapping, BPMN) via contextctl so LLM context stays accurate and verifiable.
---

# Manage Project Context

## Purpose

Provide a script-driven workflow to create, update, and verify the repository's curated context artifacts under `docs/context/`.

## When to use

Use this skill when you need to:

- add or update an API contract (`openapi.yaml`)
- add or update the database schema mapping (`schema.json`)
- add or update BPMN process files (`*.bpmn`)
- ensure CI can verify that context changes were performed correctly

Do NOT use this skill if:

- the repository does not include `docs/context/` and the Context Awareness feature is not installed

## Inputs

- Target repository root (the working directory where `.ai/` and `docs/` live).
- The intended context change:
  - artifact type (`openapi`, `db-schema`, `bpmn`, etc.)
  - artifact path (repo-relative, MUST be under `docs/context/`)
  - whether the artifact is **contract** (authoritative) or **generated** (produced by a command)

## Outputs

- Updated/created context artifacts under `docs/context/**`
- Updated `docs/context/registry.json` with:
  - sha256 checksums (`checksumSha256`)
  - timestamps (`updatedAt`, `lastUpdated`)
- A verification result (pass/fail) from `contextctl verify`

## Steps

1. Initialize the context layer (idempotent):
   - `node .ai/scripts/contextctl.js init`

2. If adding a new artifact, create the file under `docs/context/**`, then register it:
   - `node .ai/scripts/contextctl.js add-artifact --id <id> --type <type> --path <docs/context/...>`

3. Edit the artifact file (for example `docs/context/api/openapi.yaml`).

4. Update registry checksums after edits:
   - `node .ai/scripts/contextctl.js touch`

5. Verify consistency (CI-ready):
   - `node .ai/scripts/contextctl.js verify --strict`

## Verification

```bash
node .ai/scripts/contextctl.js verify --strict
```

## Boundaries

- You MUST NOT edit `docs/context/registry.json` by hand.
- You MUST keep artifact paths under `docs/context/` (no external paths).
- You SHOULD prefer "contract mode" unless you have a reliable generator command and CI support.
- You MUST NOT store secrets in context artifacts; store only non-secret contracts/mappings.

## References

- `reference.md`
