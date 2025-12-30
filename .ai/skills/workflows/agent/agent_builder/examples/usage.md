# `agent_builder` Usage Guide

`agent_builder` scaffolds a **complete, repo-integrated Agent** for a real feature request.

It produces:
- a runnable agent module (`agents/<agent_id>/`),
- maintainability docs (`agents/<agent_id>/doc/`),
- a project registry entry (`agents/registry.json`),
- plus a validated, versioned **blueprint** that becomes the single source of truth for subsequent implementation.

This guide is written for human operators. An LLM can follow the same steps programmatically.

---

## 1) What `agent_builder` is for

`agent_builder` is for building production-embedded agents, not demos.

**Primary embedding**
- `api` (HTTP)

**Attach types implemented in v1**
- `worker` (async processing / background execution)
- `sdk` (in-process library usage)
- `cron` (scheduled invocation)
- `pipeline` (CI / ETL / pipeline step invocation)

**API interface calls are supported** and are the default primary embedding.

---

## 2) Deliverables and default paths (v1)

When a blueprint is applied, `agent_builder` generates (or updates):

### 2.1 Agent module (code + runtime templates)

Path:
- `deliverables.agent_module_path` (default: `agents/<agent_id>`)

Minimum layout (Core vs Adapters separation is mandatory):

- `src/core/` — provider-agnostic logic (prompt loading, LLM orchestration, tool execution, conversation memory)
- `src/adapters/http/` — HTTP server + WebSocket streaming server
- `src/adapters/worker/` — async worker placeholder (file-queue by default)
- `src/adapters/cron/` — scheduled runner CLI
- `src/adapters/pipeline/` — stdin/stdout runner for pipelines
- `src/adapters/sdk/` — in-process API wrapper
- `prompts/` — prompt pack chosen by complexity tier (`tier1|tier2|tier3`)
- `schemas/` — schema files generated from `blueprint.schemas.*`
- `config/` — non-secret defaults
- `.env.example` — env var names and placeholders only (no secrets)

### 2.2 Agent docs (maintainability)

Path:
- `deliverables.docs_path` (default: `agents/<agent_id>/doc`)

Generated docs:
- `overview.md`
- `integration.md`
- `configuration.md`
- `dataflow.md`
- `runbook.md`
- `evaluation.md`

### 2.3 Agent registry

Path:
- `deliverables.registry_path` (default: `agents/registry.json`)

The registry is the project’s discovery index:
- agent id/name
- owners
- entrypoints
- docs path
- attachments and operational notes

Registry update is mandatory.

---

## 3) Staged flow (A–E)

### Stage A — Interview (temporary workdir only)

**Rule:** During Stage A, do not write anything to the repo.

Artifacts live in a temporary workdir and are deleted at the end.

Stage A outputs (in the workdir):
- `stageA/interview-notes.md`
- `stageA/integration-decision.md`

Checkpoint A:
- Explicit user approval is required before moving to Stage B.

### Stage B — Blueprint (JSON)

Create a blueprint in the workdir:
- `stageB/agent-blueprint.json`

Schema reference:
- `templates/agent-blueprint.schema.json`

Checkpoint B:
- Explicit user approval is required before scaffolding (Stage C).

### Stage C — Scaffold (repo writes)

Generate code + docs + registry entry in the repo:
- no overwrites; existing files are skipped and reported
- core/adapters separation enforced
- registry update enforced

### Stage D — Implement

Implement real domain logic and real tool connectors in `src/core/` and connectors.
Expand tests to cover acceptance scenarios.

### Stage E — Verify + Cleanup

- verify acceptance scenarios
- confirm docs and registry are correct
- delete the temporary workdir

---

## 4) Helper tool: `scripts/agent-builder.js`

Path:
- `.ai/skills/workflows/agent/agent_builder/scripts/agent-builder.js`

This script is dependency-free (Node.js only).

### Commands

| Command | Purpose |
|--------|---------|
| `start` | Create a temporary workdir and initial state + Stage A/B templates |
| `status` | Show current run state and next steps |
| `approve` | Mark Stage A and Stage B approvals (required before apply) |
| `validate-blueprint` | Validate blueprint JSON for required fields, enums, and key constraints |
| `plan` | Dry-run: show files that would be created/updated |
| `apply` | Apply scaffold into the repo (requires `--apply` and approvals A+B) |
| `finish` | Delete the temporary workdir (safe-guarded) |

### Quickstart (manual)

From repo root:

```bash
# Start a new run (creates temp workdir)
node .ai/skills/workflows/agent/agent_builder/scripts/agent-builder.js start

# Fill Stage A docs in the printed workdir:
# - stageA/interview-notes.md
# - stageA/integration-decision.md

# Approve Stage A (explicit operator approval)
node .../agent-builder.js approve --workdir <WORKDIR> --stage A

# Draft blueprint in:
# - stageB/agent-blueprint.json
# Validate blueprint
node .../agent-builder.js validate-blueprint --workdir <WORKDIR>

# Approve Stage B (explicit operator approval)
node .../agent-builder.js approve --workdir <WORKDIR> --stage B

# Dry-run plan
node .../agent-builder.js plan --workdir <WORKDIR> --repo-root .

# Apply scaffold (writes to repo)
node .../agent-builder.js apply --workdir <WORKDIR> --repo-root . --apply

# Cleanup temp workdir
node .../agent-builder.js finish --workdir <WORKDIR>
```

---

## 5) Blueprint overview (key fields)

The canonical schema is:
- `templates/agent-blueprint.schema.json`

The blueprint is the SSOT used to scaffold and later to implement.

### 5.1 Required top-level blocks (v1)

- `kind` (must be `agent_blueprint`)
- `version` (integer >= 1)
- `meta`
- `agent`
- `scope`
- `integration`
- `interfaces`
- `api`
- `schemas`
- `contracts`
- `model`
- `configuration`
- `conversation`
- `budgets`
- `data_flow`
- `observability`
- `security`
- `acceptance`
- `deliverables`

> Optional blocks may include `tools`, `operations`, `prompting`, `lifecycle`, and others.

### 5.2 Enums (selected)

#### Integration
- `integration.primary`: `api`
- `integration.attach[]`: `worker | sdk | cron | pipeline`
- `integration.trigger.kind`: `sync_request | async_event | scheduled | manual | batch`
- `integration.target.kind`: `service | repo_module | pipeline_step | queue | topic | job | function | other`
- `integration.failure_contract.mode`: `propagate_error | return_fallback | enqueue_retry`
  - suppression modes are not allowed
- `integration.rollback_or_disable.method`: `feature_flag | config_toggle | route_switch | deployment_rollback`

#### Interfaces (per entrypoint)
- `interfaces[].type`: `http | worker | sdk | cron | pipeline | cli`
- `interfaces[].response_mode`: `blocking | streaming | async`
- `interfaces[].exposure_level`: `none | progress | debug`
- `interfaces[].streaming.protocol`: `websocket | sse | chunked_jsonl`
  - default is `websocket` for HTTP streaming

#### Conversation / memory
- `conversation.mode`: `no-need | buffer | buffer_window | summary | summary_buffer`
- `conversation.summary.update_method`: `llm | heuristic` (default: `llm`)
- `conversation.summary.refresh_policy`: `every_turn | threshold | periodic` (default: `threshold`)
- `conversation.summary.update_timing`: `after_turn | async_post_turn`
  - recommended default:
    - interactive streaming: `async_post_turn`
    - blocking: `after_turn`

---

## 6) Generated entrypoint behavior (scaffold default)

### 6.1 HTTP adapter

- `GET <base_path>/health` → `200 { "status": "ok" }`
- `POST <base_path>/run` → blocking: returns `RunResponse`

WebSocket (streaming):
- `WS <base_path>/ws`
  - Client sends a `RunRequest` JSON message
  - Server emits `RunEvent` messages and finally a completion event

> Route names are fixed: `run` and `health`.

### 6.2 Worker adapter (placeholder)

The default worker is a **file-queue** implementation:

- Reads `*.json` from `AGENT_WORKER_INPUT_DIR`
- Writes `*.out.json` or `*.error.json` to `AGENT_WORKER_OUTPUT_DIR`
- Moves processed input files to:
  - `<input_dir>/.done/` on success
  - `<input_dir>/.failed/` on failure or invalid JSON

This is a placeholder for real queues/topics/task tables.

### 6.3 Cron adapter

- Accepts input from:
  - `AGENT_CRON_INPUT_JSON` (preferred), or
  - `AGENT_CRON_INPUT_FILE`
- Writes output to:
  - `AGENT_CRON_OUTPUT_FILE` if set,
  - otherwise stdout

### 6.4 Pipeline adapter

- Reads `RunRequest` JSON from stdin (or `--input <file>`)
- Writes `RunResponse` JSON to stdout (or `--output <file>`)
- Exit code:
  - `0` on success
  - `1` on error (writes `AgentError` to stderr)

### 6.5 SDK adapter

Exports a stable in-process API:
- `runAgent(request, options)` → `RunResponse`

---

## 7) Operational invariants (enforced)

- No secrets in the repo. Only env var names and placeholders (`.env.example`).
- Kill switch required:
  - `AGENT_ENABLED` must be declared in `configuration.env_vars` with `required: true`.
- Registry update required:
  - `deliverables.registry_path` must be created/updated during scaffolding.
- Core/Adapters separation required:
  - core logic must not import adapter-specific modules.

---

## 8) Notes on conversation modes

### `summary` mode
- Stores only a summary state (not full raw buffer).
- Summary updates are performed by LLM by default (separate model profile optional).
- Default refresh policy is `threshold`:
  - update summary only when pending raw content exceeds a token/turn threshold.

### `summary_buffer` mode
- Stores:
  - a summary state, and
  - a recent raw window (`window_turns` / `window_tokens`)
- When the raw window overflows, overflow content is summarized into the summary state.
- Summary updates may be asynchronous for interactive streaming interfaces.

---

## 9) Where to look in the skill pack

- Skill instructions: `SKILL.md`
- This guide: `examples/usage.md`
- Decision checklist: `reference/decision_checklist.md`
- Blueprint schema: `templates/agent-blueprint.schema.json`
- State schema: `templates/agent-builder-state.schema.json`
- Scaffold kit templates: `templates/agent-kit/node/layout/`
- Prompt pack templates: `templates/prompt-pack/`

