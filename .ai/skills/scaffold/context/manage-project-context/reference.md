# Manage Project Context - Reference

## Design goals

- **Stable entry point**: `docs/context/INDEX.md` and `docs/context/registry.json` are the only supported context entry points.
- **Verifiable updates**: artifact checksums enable CI to detect edits that bypass the scripts.
- **Tool-agnostic artifacts**: OpenAPI, BPMN 2.0, and a normalized DB schema mapping.

## Contract mode vs Generated mode

### Contract mode (recommended default)

- The artifact file is the authoritative contract.
- Human collaborators and LLMs edit the file directly.
- After edits, run:
  - `node .ai/scripts/contextctl.js touch`
  - `node .ai/scripts/contextctl.js verify --strict`

### Generated mode (opt-in)

- The artifact file is generated from code/tools.
- Register the artifact with `mode=generated` and a `source.command`.
- Run generators with:
  - `node .ai/scripts/contextctl.js update --allow-shell`
- This feature does not assume any specific generator tooling; the command is project-defined.

## Recommended CI gates

Minimum:

- `node .ai/scripts/contextctl.js verify --strict`
- `node .ai/scripts/projectctl.js verify`

Optional (if you use generated mode):

- `node .ai/scripts/contextctl.js update --allow-shell`
- `node .ai/scripts/contextctl.js verify --strict`

## Common artifact types

- `openapi`: API surface contract (`docs/context/api/openapi.yaml`)
- `db-schema`: normalized DB structure mapping (`docs/context/db/schema.json`)
- `bpmn`: BPMN 2.0 process file (`docs/context/process/*.bpmn`)

## Troubleshooting

- **Checksum mismatch**: you edited an artifact but did not run `contextctl touch`.
- **Missing file**: registry references a path that does not exist; create the file or remove the registry entry via script.

