# Agent Builder - Interview Question Bank (Stage A)

This file is designed for the **Stage A interview**. It is intended to be used in a **temporary workdir** (not committed to the repo).

## 0) Goal framing
- What is the **single most important outcome** this agent must achieve?
- Who are the **users / callers** (human, service, pipeline, ops tool)?
- What is the **Definition of Done** (functional + operational)?

## 1) Scope and boundaries
- In scope: What tasks should the agent perform?
- Out of scope: What must it **never** do?
- What are the **non-goals** (explicit exclusions to avoid scope creep)?
- What are the **hard constraints** (policy, compliance, latency, cost)?

## 2) Embedding / Integration (MUST user-sign-off)
- Where does this agent live in the production workflow?
  - API called by which service/module?
  - Worker consumes what queue/topic/task source?
  - SDK used by which package/module?
  - Cron runs where (k8s CronJob, system cron, scheduler)?
  - Pipeline step runs where (CI, data pipeline, ETL step)?
- What is the upstream input contract? (payload shape, required fields)
- What is the downstream output contract? (schema, stability requirements)
- What is the failure contract?
  - propagate_error vs return_fallback vs enqueue_retry
- What is the rollback/disable plan?
  - feature_flag vs config_toggle vs route_switch vs deployment_rollback
- Confirm: **User approves these integration decisions** (explicit checkpoint).

## 3) Interfaces and contracts
- Which interfaces must be supported in v1? (http / worker / sdk / cron / pipeline)
- For API:
  - Base path and route paths (run and health are mandatory)
  - Auth model (api_key / mtls / oauth2 / internal gateway)
  - Timeout budget
- For worker:
  - Source kind (queue/topic/task table)
  - Concurrency, retries, idempotency key
  - Dead-letter strategy
- For pipeline:
  - Input mode (stdin_json/file_json), output mode (stdout_json/file_json)
- For cron:
  - Schedule, timezone, input source, output destination
- For SDK:
  - Language, package name, exported functions/classes

## 4) LLM and reasoning strategy
- Preferred provider (OpenAI / OpenAI-compatible gateway / Azure / internal gateway / local)
- Candidate model(s) and why
- Do we need a fallback model/profile?
- What is the reasoning profile? (fast vs deep)
- What is the cost/latency budget?

## 5) Tools and external dependencies
- What systems must the agent call? (HTTP APIs, DBs, queues, files)
- Tool contracts:
  - Inputs/outputs, timeouts, retries, idempotency
  - Authentication mechanism (env var names only)
- What can the agent **read** vs **write**? Any destructive actions?

## 6) Data flow and compliance
- What data may be sent to the LLM? Any PII/sensitive data?
- Redaction / minimization requirements?
- Storage rules (logs, caches, artifacts) and retention period?

## 7) Observability and operations
- Required logs (correlation_id, request_id, tool timings)
- Required metrics (latency, error_rate, token_cost, tool_fail_rate)
- Alerts and oncall ownership
- Runbook expectations (deploy, rollback, disable, debugging)

## 8) Acceptance scenarios
Provide at least 2 end-to-end scenarios:
- Happy path (core function)
- Health/readiness
- Failure / kill switch / degradation behavior

## 9) Prompting complexity tier
- Tier 1: single-step, low risk, minimal tools
- Tier 2: multi-step, multiple tools, structured outputs
- Tier 3: high-risk writes, complex branching, strict formatting, heavy guardrails

Decide tier and the expected number of examples.
