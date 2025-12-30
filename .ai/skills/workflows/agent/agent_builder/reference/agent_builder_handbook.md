# `agent_builder` Usage Guide

This document explains how to use the `agent_builder` skill pack to produce a **complete, repo-integrated Agent** (configuration + runnable adapters + prompt pack + docs + registry entry).

> This guide is written for humans who will run the helper script and/or review generated artifacts, LLM readers can skip it.
> In practice, an LLM agent can follow the same steps programmatically while building an agent for a concrete requirement.

---

## 1. Primary use cases

`agent_builder` is designed for real production embedding. In v1, the default shape is:

- **Primary embedding**: `API` (HTTP)
- **Attach candidates (implemented in this version)**:
  - `worker` (async processing / background execution)
  - `sdk` (in-process library usage)
  - `cron` (scheduled invocation)
  - `pipeline` (CI / ETL / pipeline step invocation)

A common embedding point is an **API interface call** (yes, API calls are supported and are the default primary embedding).

---

## 2. What gets generated

Given an approved blueprint, `agent_builder` generates:

### 2.1 Agent module (runnable)

Under `deliverables.agent_module_path` (default example: `agents/<agent_id>`):

- `src/core/`  
  Provider-agnostic agent logic. This must be stable and testable.
- `src/adapters/`  
  Entrypoints for `http`, `worker`, `sdk`, `cron`, `pipeline`.
- `prompts/`  
  Tiered prompt pack selected by complexity tier.
- `schemas/`  
  JSON schema files for RunRequest / RunResponse / AgentError.
- `config/default.json`  
  Non-secret runtime defaults.
- `.env.example`  
  Example environment variable list.

### 2.2 Project documentation (maintainability)

Under `deliverables.docs_path` (default example: `agents/<agent_id>`):

- `doc/overview.md`
- `doc/integration.md`
- `doc/configuration.md`
- `doc/dataflow.md`
- `doc/runbook.md`
- `doc/evaluation.md`

### 2.3 Agent registry update

`deliverables.registry_path` (default example: `agents/registry.json`) is created or updated.

This registry is the project’s **single place** to discover:
- What agents exist
- Where they live (module path)
- How to invoke them
- Owners and operational notes

---

## 3. Staged execution flow (A–E)

### Stage A — Interview (temporary workdir only)

**Rule:** During Stage A, do not write anything to the repo.

Artifacts live in a temporary workdir and are deleted at the end.

Outputs:
- `stageA/interview-notes.md`
- `stageA/integration-decision.md`

Checkpoint:
- The user must explicitly approve:
  - embedding target (where the agent runs)
  - upstream/downstream contracts
  - failure contract
  - rollback/disable plan

### Stage B — Blueprint (JSON)

Create a blueprint (`stageB/agent-blueprint.json`) that is compatible with the schema:
- `templates/agent-blueprint.schema.json`

Checkpoint:
- The user must explicitly approve the blueprint before scaffolding.

### Stage C — Scaffold (repo writes)

Generate code, prompts, docs, registry updates in the repo:
- No overwrites
- Core/adapters separation enforced
- Registry must be updated

### Stage D — Implement

Implement the actual business logic (agent tools, domain logic, integration logic) in `src/core/` and real tools.

### Stage E — Verify + Docs + Cleanup

- Verify acceptance scenarios
- Ensure docs and registry are correct
- Delete the temporary workdir

---

## 4. Helper script: `scripts/agent-builder.js`

The helper script is dependency-free (Node.js only).

Path:
- `.ai/skills/workflows/agent/agent_builder/scripts/agent-builder.js`

### 4.1 Commands overview

| Command | Purpose |
|--------|---------|
| `start` | Create a temporary workdir and initial state + Stage A/B templates |
| `status` | Show current run state and next suggested action |
| `validate-blueprint` | Validate a blueprint JSON for required fields, enums, and constraints |
| `plan` | Show what files would be generated/updated (dry-run) |
| `apply` | Apply the scaffold into the repo (requires `--apply`) |
| `finish` | Delete the temporary workdir (auto-safe for default temp paths) |

### 4.2 Quickstart (manual)

From your repo root:

```bash
# 1) Start a new run (creates a temp workdir)
node .ai/skills/workflows/agent/agent_builder/scripts/agent-builder.js start

# 2) Open the printed workdir path and fill Stage A artifacts:
#    - stageA/interview-notes.md
#    - stageA/integration-decision.md

# 3) Draft the blueprint in:
#    - stageB/agent-blueprint.json
# (use the example files in templates/ as guidance)

# 4) Validate the blueprint
node .ai/skills/workflows/agent/agent_builder/scripts/agent-builder.js validate-blueprint --workdir <WORKDIR>

# 5) Plan scaffold changes (dry-run)
node .ai/skills/workflows/agent/agent_builder/scripts/agent-builder.js plan --workdir <WORKDIR> --repo-root .

# 6) Apply scaffold changes
node .ai/skills/workflows/agent/agent_builder/scripts/agent-builder.js apply --workdir <WORKDIR> --repo-root . --apply

# 7) Finish (cleanup workdir)
node .ai/skills/workflows/agent/agent_builder/scripts/agent-builder.js finish --workdir <WORKDIR>
```
--- 

## 5. Blueprint schema

The canonical schema is:
- templates/agent-blueprint.schema.json

This guide summarizes key required fields, optional sections, and implemented enums.

### 5.1 Top-level required fields

| **Field** | **Required** |  **Notes**|
|--|--| -- |
| kind | Yes | Must be agent_blueprint |
| version | Yes | Integer ≥ 1 |
| meta | Yes | Generation metadata |
| agent | Yes | id, name, summary, owners |
| scope | Yes | In-scope / out-of-scope / DoD |
| integration | Yes | Primary + attachments + contracts + failure/rollback |
| interfaces | Yes | Entrypoints and contract refs |
| schemas | Yes | Must include RunRequest, RunResponse, AgentError |
| model | Yes | Primary model selection |
| configuration | Yes | Env var list (no secrets in repo) |
| acceptance | Yes | ≥ 2 scenarios |
| deliverables | Yes |  Where to write code, docs, registry|

### 5.2 Enum reference (naming + values)

These enums are enforced by validation and/or schema.

integration.primary
- api (v1 supports api as the primary embedding)

integration.attach[]
- worker
- sdk
- cron
- pipeline

integration.trigger.kind
- sync_request
- async_event
- scheduled
- manual
- batch

integration.target.kind
- service
- repo_module
- pipeline_step
- queue
- topic
- job
- function
- other

integration.failure_contract.mode
Important: suppression is not allowed.
- propagate_error
- return_fallback
- enqueue_retry

integration.rollback_or_disable.method
- feature_flag
- config_toggle
- route_switch
- deployment_rollback

interfaces[].type
- http
- worker
- sdk
- cron
- pipeline
- cli

API route names (fixed)
- api.routes[].name must be one of:
  - run
  - health

The api.routes array must include both run and health.

### 5.3 Conditional required blocks

If you include an attach type, its config block becomes required:

| **Attach** | **Required block** |  
|--|--| 
| worker | worker | 
| sdk | sdk | 
| cron | cron | 
| pipeline | pipeline | 

--- 

## 6. Generated adapter behavior

### 6.1 HTTP adapter
- GET <base_path>/health → 200 { status: "ok" }
- POST <base_path>/run → 200 RunResponse on success

Errors:
- 503 AgentError when agent disabled
- 500 AgentError otherwise

### 6.2 Worker adapter (dev default)

Implements a file-queue worker:
- Reads *.json from AGENT_WORKER_INPUT_DIR
- Writes *.out.json or *.error.json to AGENT_WORKER_OUTPUT_DIR
- Moves processed files to .done / .failed

This is a production-friendly pattern only as a placeholder. Replace the source with your real queue/topic/task system.

### 6.3 Cron adapter
- Reads RunRequest from:
  - AGENT_CRON_INPUT_JSON (preferred)
  - or AGENT_CRON_INPUT_FILE
- Writes output to:
  - AGENT_CRON_OUTPUT_FILE if provided
  - otherwise stdout

### 6.4 Pipeline adapter
- Reads RunRequest JSON from stdin (or --input <file>)
- Writes RunResponse JSON to stdout (or --output <file>)
- Exit code 1 on error (writes AgentError to stderr)

### 6.5 SDK adapter

Exports runAgent() for in-process usage.

---

## 7. Implementation logic

When apply runs:
1.	Blueprint is validated (structural + enum + key constraints).
2.	The agent module folder is created (no overwrite).
3.	Core and selected adapters are written from templates/agent-kit/node/layout/.
4.	Prompt pack tier is copied from templates/prompt-pack/<tier>/.
5.	schemas/*.schema.json are written from blueprint.schemas.
6.	Docs are generated under deliverables.docs_path.
7.	Registry JSON is created/updated under deliverables.registry_path.

The generator follows a strict rule:
- If a file already exists, it is not overwritten (it is reported as skipped).

---

## 8. Operational and maintenance guidance

### 8.1 No secrets in repo

The blueprint requires configuration.env_vars[] as the canonical list.
- sensitivity: secret must always remain out of the repo.
- Use .env.example placeholders only.

### 8.2 Data flow documentation is mandatory

Generated docs include dataflow.md.
You should extend it to:
- Document data classes (PII / confidential / internal)
- Explain what is sent to the LLM provider
- nclude retention rules for logs/artifacts

### 8.3 Kill switch required

AGENT_ENABLED is required to support safe rollback/disable.

---

## 9. Extending / customizing agent_builder

Typical extensions:
- Add new adapter templates under templates/agent-kit/
- Add more tier templates or scenario-specific prompt packs
- Expand blueprint schema for additional platforms/integrations

When you add new templates, keep the Core vs Adapters boundary intact.

---

## 10. File list (where to look)
- Skill instructions: SKILL.md
- Examples and this guide: examples/usage.md
- Blueprint schema: templates/agent-blueprint.schema.json
- State schema: templates/agent-builder-state.schema.json
- Scaffold kit: templates/agent-kit/node/layout/
- Prompt pack templates: templates/prompt-pack/

---