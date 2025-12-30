---
name: agent_builder
description: Build a production-ready, repo-integrated Agent (API + Worker/SDK/Cron/Pipeline) using a staged, blueprint-driven workflow with explicit user sign-off, maintainable scaffolding, prompt packs, docs, and registry updates.
---

# Agent Builder

## Purpose

`agent_builder` is a **builder skill** that produces a **complete, repo-integrated Agent** when there is a real, concrete need.

The output is not a toy demo. The generated agent is designed to:
- Embed into an existing production workflow (at minimum, an **API** integration point).
- Optionally attach to **Worker**, **SDK**, **Cron**, and/or **Pipeline** entrypoints.
- Include maintainable structure (**Core** vs **Adapters** separation).
- Include prompt pack templates appropriate to complexity.
- Include operational docs and a registry entry so the project can maintain the agent long-term.

## When to use

Use this skill when:
- You have a real feature/workflow requirement and want an agent embedded into it.
- You need a repeatable way to go from “requirements” → “blueprint” → “scaffold” → “implementation” → “docs/ops”.
- You must keep outputs verifiable, reviewable, and safe for production.

## Outputs (what “done” looks like)

A successful build produces, at minimum:
- A blueprint JSON validated against the included schema.
- A new agent module under `deliverables.agent_module_path` with:
  - `src/core/` (provider-agnostic business logic)
  - `src/adapters/` (http/worker/sdk/cron/pipeline entrypoints)
  - `prompts/` (tiered prompt pack)
  - `schemas/` (request/response/error schemas)
- Project docs under `deliverables.docs_path/doc` (overview, integration, configuration, data flow, runbook, evaluation).
- An updated registry at `deliverables.registry_path` (MUST be written).

## Workflow (Stages A–E)

### Stage A — Interview (temporary workdir only)
**Hard rule:** Stage A artifacts must be written to a temporary workdir, not to the repo.

Goals:
- Clarify scope, constraints, tools, data flow, ops requirements.
- Choose integration embedding (**MUST be user-approved**).
- Decide prompt complexity tier and example strategy.

Checkpoint (must be explicit):
- The user **signs off** on the embedding decision and the failure/rollback contract.

### Stage B — Blueprint (JSON + schema)
Create a comprehensive `agent-blueprint.json` that:
- Distinguishes required vs optional fields
- Encodes integration decisions, interfaces, schemas, model selection, configuration, acceptance scenarios, deliverables
- Supports **API + Worker**, **API + SDK** as primary paths, and includes **Cron** and **Pipeline** attachments

Checkpoint:
- User reviews and approves the blueprint.

### Stage C — Scaffold (repo writes)
Generate the agent structure and docs into the repo:
- MUST NOT overwrite existing files.
- MUST separate `core/` from `adapters/`.
- MUST update the agent registry.

### Stage D — Implement (real functionality)
Implement core logic and any real tools:
- Respect tool contracts, timeouts, retries, idempotency.
- Do not embed secrets.
- Keep outputs stable and schema-compliant.

### Stage E — Verify, document, and cleanup
- Verify acceptance scenarios.
- Ensure docs are complete and registry is updated.
- Delete the temporary workdir used in Stage A.

## Non-negotiable constraints

- Interview stage uses a temporary workdir; do not write Stage A artifacts into the repo.
- `run` and `health` are **fixed** API route names.
- Failure handling does **not** allow suppressing errors (no “suppress_and_alert”).
- Core vs adapter separation is required.
- Agent registry must be written/updated.

## Included assets

- Schemas:
  - `templates/agent-blueprint.schema.json`
  - `templates/agent-builder-state.schema.json`
- Examples:
  - `templates/agent-blueprint.example.*.json`
- Interview templates:
  - `templates/conversation-prompts.md`
  - `templates/integration-decision.template.md`
  - `templates/interview-notes.template.md`
- Prompt packs:
  - `templates/prompt-pack/` (tier1/tier2/tier3)
- Scaffold kit:
  - `templates/agent-kit/node/layout/` (core + adapters)

## Helper script

This skill includes a dependency-free helper:

- `scripts/agent-builder.js`

It can:
- Create a temporary workdir and state file (`start`)
- Validate blueprint JSON (`validate-blueprint`)
- Plan and apply repo scaffolding (`plan`, `apply`)
- Clean up the temporary workdir (`finish`)

See `examples/usage.md` for the full workflow and command reference.

## Boundaries

- MUST NOT embed real credentials, API keys, or secrets into any generated files.
- MUST NOT overwrite existing repo files (skip or create new paths instead).
- MUST require explicit user sign-off for integration embedding decisions.
- SHOULD keep the blueprint and docs provider-agnostic where possible.
