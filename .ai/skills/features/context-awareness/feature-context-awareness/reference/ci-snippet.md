## CI snippet (generic)

Add a step in your CI pipeline that runs:

- `node .ai/scripts/contextctl.js verify --strict`
- `node .ai/scripts/projectctl.js verify`

This enforces that:
- `docs/context/registry.json` matches the current artifacts (checksums)
- the project state file is schema-valid

If you also want to enforce skills wrapper sync, add:
- `node .ai/scripts/skillsctl.js sync --providers both`
