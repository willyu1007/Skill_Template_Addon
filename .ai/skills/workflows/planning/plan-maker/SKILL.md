---
name: plan-maker
description: Create a goal-aligned macro-level roadmap (dev-docs/active/<task>/roadmap.md) by asking clarifying questions when needed; planning only (no code changes).
---

# Plan Maker

## Purpose
Produce a single, goal-aligned **roadmap** as a Markdown document that can guide execution without modifying the codebase. The roadmap captures "what to do, how to phase it, and how to verify success" at the macro level.

## Relationship to dev-docs

The plan-maker skill produces a **macro-level roadmap**; the `create-dev-docs-plan` skill produces **implementation-level documentation**. They are upstream/downstream:

| Dimension | plan-maker (roadmap.md) | dev-docs (01-plan.md etc.) |
|-----------|-------------------------|----------------------------|
| Level | Macro planning | Implementation execution |
| Content | Goals, non-goals, milestones, acceptance criteria, risks, rollback | Step details, architecture, decisions, verification evidence |
| Timing | Before task starts | During implementation |
| Update frequency | Low (directional changes only) | High (progress, decisions, issues) |
| Audience | Decision-makers, collaborators | Implementers, handoff recipients |

**Do not duplicate**: if a `roadmap.md` exists, `dev-docs` should reference it rather than redefine goals and milestones.

## When to use
Use this skill when:
- The user asks for a plan, roadmap, milestones, or an implementation plan before coding
- The task is large/ambiguous and benefits from staged execution and verification
- You need a roadmap artifact saved under `dev-docs/active/` for collaboration and handoff

Avoid plan-maker when:
- The user explicitly wants you to implement changes immediately (plan-maker is planning-only)
- A roadmap already exists and only minor edits are needed (update the existing roadmap instead)

## Inputs
- Task goal (required)
  - If the goal is ambiguous or missing critical constraints, you MUST ask clarifying questions before drafting the roadmap.

## Outputs
- `dev-docs/active/<task>/roadmap.md`
  - `<task>` is a short filesystem-safe slug derived from the goal and confirmed with the user.

## Steps
1. Restate the goal in one sentence and confirm direction.
2. Identify what is unclear and ask clarifying questions.
   - Ask only what is necessary to align the roadmap to the goal (scope, non-goals, target environment, success criteria, constraints).
   - If the user cannot answer now, record assumptions explicitly and surface the risk.
3. Propose a `<task>` slug and confirm it with the user.
   - Use kebab-case; avoid dates unless requested.
4. Draft the roadmap using `./templates/roadmap.md`.
   - Keep the roadmap macro-level: phases, milestones, deliverables, verification, risks, rollback.
   - Only include specific file paths/APIs when you have evidence; otherwise add a discovery step.
   - Include an explicit "Open questions / Assumptions" section.
   - Include an "Optional detailed documentation layout (convention)" section that declares the expected file layout under `dev-docs/active/<task>/` without creating those files.
5. Save the roadmap to `dev-docs/active/<task>/roadmap.md`.
6. Return a short handoff message to the user:
   - confirmed goal
   - where the roadmap was saved
   - the next 3 actions to start execution (without executing them)

## Verification
- [ ] Goal is restated and (where needed) confirmed with the user
- [ ] Ambiguities are resolved or recorded as explicit open questions/assumptions
- [ ] Roadmap includes milestones/phases and per-step deliverables
- [ ] Roadmap defines verification/acceptance criteria and a rollback strategy
- [ ] Roadmap is saved to `dev-docs/active/<task>/roadmap.md`
- [ ] No application/source/config files were modified

## Boundaries
- MUST NOT modify application/source code, project configuration, or database state
- MUST ask clarifying questions when the goal or constraints are ambiguous
- MUST NOT invent project-specific facts (APIs, file paths, schemas) without evidence
- SHOULD keep the roadmap macro-level; deep design details belong in separate documentation artifacts (dev-docs)
- SHOULD NOT include secrets (credentials, tokens, private keys) in the roadmap

## Included assets
- Template: `./templates/roadmap.md`
- Reference: `./reference/detailed-docs-convention.md` (optional file layout convention)
- Example: `./examples/sample-roadmap.md`
