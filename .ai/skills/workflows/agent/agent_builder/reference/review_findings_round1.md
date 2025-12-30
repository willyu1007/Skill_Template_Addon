# Agent Builder Review Findings

## Purpose
Record the initial review findings for `agent_builder` against `agent_builder_handbook.md`.

## Scope
These findings reflect the first review only and MAY be outdated after subsequent changes.

## Findings

### 1) Incomplete blueprint validation
- Severity: High
- Issue: `validate-blueprint` did not enforce several schema-required fields and enums (for example: `meta`, `integration.trigger`, `integration.target`, `api.protocol`, `api.auth`, `api.degradation`).
- Risk: Invalid blueprints could pass validation and generate incompatible scaffolds.
- Evidence: `reference/agent_builder_handbook.md`, `templates/agent-blueprint.schema.json`, `scripts/agent-builder.js`.

### 2) Acceptance scenarios mismatch
- Severity: Medium
- Issue: Handbook required >= 2 scenarios, while schema/validator required >= 3.
- Risk: Conflicting requirements in docs vs validation logic.
- Evidence: `reference/agent_builder_handbook.md`, `templates/agent-blueprint.schema.json`, `scripts/agent-builder.js`.

### 3) Docs output path mismatch
- Severity: Medium
- Issue: Handbook required docs under `deliverables.docs_path/doc`, but generator wrote directly under `deliverables.docs_path`.
- Risk: Generated files did not match documented structure.
- Evidence: `reference/agent_builder_handbook.md`, `scripts/agent-builder.js`, `examples/usage.md`.

### 4) Worker archive behavior mismatch
- Severity: Medium
- Issue: Handbook specified `.done/.failed` directories, but worker adapter used filename suffixes (and `.bad` for invalid JSON).
- Risk: Operators expecting directories could not rely on the documented behavior.
- Evidence: `reference/agent_builder_handbook.md`, `templates/agent-kit/node/layout/src/adapters/worker/worker.js.template`.

### 5) Kill switch not enforced
- Severity: Low
- Issue: `AGENT_ENABLED` was only a warning in validation, despite being required for safe rollback/disable.
- Risk: Blueprints could omit the kill switch without failing validation.
- Evidence: `reference/agent_builder_handbook.md`, `scripts/agent-builder.js`.

## Verification
- Confirm the findings against the files listed in each “Evidence” field.
