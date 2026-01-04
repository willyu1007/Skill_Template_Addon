---
name: create-dev-docs-plan
description: Create a structured dev-docs task bundle (overview/plan/architecture/notes/verification/pitfalls) with clear scope, acceptance criteria, and handoff-ready artifacts.
---

# Create Dev Docs Plan

## Purpose
Generate a structured, repeatable "task documentation bundle" so implementation work has clear scope, steps, and verification, and can be handed off cleanly.

## Relationship to plan-maker

The create-dev-docs-plan skill produces **implementation-level documentation**; the `plan-maker` skill produces a **macro-level roadmap**. They are upstream/downstream:

| Dimension | plan-maker (roadmap.md) | dev-docs (01-plan.md etc.) |
|-----------|-------------------------|----------------------------|
| Level | Macro planning | Implementation execution |
| Content | Goals, non-goals, milestones, acceptance criteria, risks, rollback | Step details, architecture, decisions, verification evidence |
| Timing | Before task starts | During implementation |
| Update frequency | Low (directional changes only) | High (progress, decisions, issues) |
| Audience | Decision-makers, collaborators | Implementers, handoff recipients |

**If a `roadmap.md` already exists** for the task, use the roadmap as input rather than redefining goals and milestones. Reference the roadmap in `00-overview.md` and expand roadmap phases into detailed steps in `01-plan.md`.

## When to use
Use this skill when:
- Starting a non-trivial task or project
- Work spans multiple modules/services
- You need a shared plan for multiple contributors
- You want a consistent handoff artifact for later context recovery
- A `roadmap.md` exists and you need to expand it into implementation-level documentation

## Inputs
- Task name (short, kebab-case recommended)
- High-level goal and success criteria
- Constraints (deadline, non-goals, areas that must not change)
- Known dependencies (APIs, data models, infra)
- **Optional**: existing `roadmap.md` (from `plan-maker` skill) — if present, use as macro-level input

## Outputs
A new task directory with a standard set of docs, e.g.:

```
dev-docs/active/<task-name>/
  roadmap.md              # optional, from plan-maker (macro-level)
  00-overview.md          # from this skill (implementation-level)
  01-plan.md
  02-architecture.md
  03-implementation-notes.md
  04-verification.md
  05-pitfalls.md
```

(Adjust directory naming to match your repository conventions if different.)

## Rules
- The overview MUST state the goal and non-goals.
- The plan MUST include milestones and acceptance criteria.
- The architecture doc MUST capture boundaries and contracts.
- Verification MUST be concrete (commands/checks, expected results).
- The task bundle MUST include `05-pitfalls.md` and `05-pitfalls.md` MUST be updated when failures are resolved (historical lessons, append-only).
- Avoid embedding secrets or real credentials.
- **If `roadmap.md` exists**: reference it in `00-overview.md`; do not duplicate goals, non-goals, or milestones — instead, link or summarize and expand into implementation details.

## Steps
1. Create `dev-docs/active/<task-name>/`.
2. Check if `roadmap.md` exists in the task directory. If so, use the roadmap as macro-level input.
3. Write `00-overview.md`:
   - problem statement
   - goal (reference `roadmap.md` if the roadmap exists)
   - non-goals
   - high-level acceptance criteria
4. Write `01-plan.md`:
   - milestones (expand from `roadmap.md` if the roadmap exists)
   - step order
   - risks and mitigations
5. Write `02-architecture.md`:
   - boundaries
   - interfaces/contracts
   - data migrations (if any)
6. Write `03-implementation-notes.md`:
   - decisions made
   - deviations from plan (with rationale)
   - open issues requiring follow-up action (current state, actionable TODOs)
7. Write `04-verification.md`:
   - automated checks
   - manual smoke checks
   - rollout/backout notes (if needed)
8. Write `05-pitfalls.md`:
   - a short `do-not-repeat` summary (fast scan for future contributors)
   - an append-only log of resolved failures and dead ends (historical lessons, not current issues)

## Verification
- [ ] Task directory follows the standard layout (`00-overview.md`, `01-plan.md`, etc.)
- [ ] Overview clearly states goals and non-goals
- [ ] Plan includes milestones with acceptance criteria
- [ ] Architecture captures boundaries and contracts
- [ ] Verification has concrete commands/checks and expected results
- [ ] `05-pitfalls.md` exists and is structured for fast scanning + append-only updates
- [ ] No secrets or real credentials are embedded
- [ ] Documentation is sufficient for handoff to another contributor
- [ ] If `roadmap.md` exists, dev-docs reference the roadmap rather than duplicating content

## Boundaries
- MUST NOT embed secrets or real credentials in docs
- MUST NOT skip verification section (must be concrete and testable)
- MUST NOT create plans without acceptance criteria
- MUST NOT duplicate goals/milestones if `roadmap.md` already defines them
- SHOULD NOT deviate from the standard directory layout without justification
- SHOULD keep overview high-level (implementation detail belongs elsewhere)

## Included assets
- Templates:
  - `./templates/00-overview.md`
  - `./templates/01-plan.md`
  - `./templates/02-architecture.md`
  - `./templates/03-implementation-notes.md`
  - `./templates/04-verification.md`
  - `./templates/05-pitfalls.md`
- Examples: `./examples/` includes a minimal task bundle layout.
