# Central Tests (feature packs)

This folder centralizes smoke/system tests for feature-pack skills.

## Why
- Keep `.ai/skills/**` clean (no per-skill `tests/` folders)
- Standardize test evidence and cleanup behavior
- Provide a single, cross-platform entry point (Windows/macOS/Linux)

## Run
From repo root:

- List suites: `node .ai/tests/run.cjs --list`
- UI suite: `node .ai/tests/run.cjs --suite ui`
- Environment suite: `node .ai/tests/run.cjs --suite environment`
- Database suite: `node .ai/tests/run.cjs --suite database`

## Evidence + cleanup
- Evidence is written under `.ai/.tmp/tests/<suite>/<run-id>/`.
- PASS: evidence is deleted automatically.
- FAIL: evidence is kept and the path is printed.

To keep evidence even on PASS (debug): set `KEEP_TEST_ARTIFACTS=1` or pass `--keep-artifacts`.
