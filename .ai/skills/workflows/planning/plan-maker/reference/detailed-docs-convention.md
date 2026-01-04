# Optional detailed documentation convention

The reference below describes an optional file layout convention for maintaining task-level development documentation alongside the roadmap produced by plan-maker.

## Convention
When a task requires detailed documentation (architecture notes, implementation notes, verification logs), the repository convention is to place all files flat under the task directory:

```
dev-docs/active/<task>/
  roadmap.md              # Macro-level planning (plan-maker)
  00-overview.md
  01-plan.md
  02-architecture.md
  03-implementation-notes.md
  04-verification.md
  05-pitfalls.md
```

Notes:
- The plan-maker skill **only** produces `roadmap.md`. Plan-maker does not create or update other files.
- The implementation-level files (`00-overview.md` through `05-pitfalls.md`) are created by the `create-dev-docs-plan` skill.
- The detailed bundle is intended to be a long-lived, high-fidelity record for collaboration and handoff.

## Relationship between roadmap.md and implementation docs

`roadmap.md` is the **macro-level input** for the implementation documentation:

| Layer | Artifact | Content | Update frequency |
|-------|----------|---------|------------------|
| Macro | `roadmap.md` | Goals, milestones, acceptance criteria, risks, rollback | Low |
| Detail | `00-overview.md` through `05-pitfalls.md` | Step details, architecture, decisions, verification evidence | High |

**Avoid duplication**: if `roadmap.md` exists, the implementation docs should reference it rather than redefine goals and milestones.

## Suggested mapping
Use this mapping to expand `roadmap.md` into detailed documentation:

- `roadmap.md` (macro roadmap) → source for:
  - `00-overview.md`: goal, non-goals, scope, impact
  - `01-plan.md`: milestones, phases, step sequencing, DoD
  - `02-architecture.md`: high-level architecture direction and interfaces (details added during execution)
  - `03-implementation-notes.md`: decisions, deviations, trade-offs, runbooks, links to PRs/commits
  - `04-verification.md`: verification strategy, commands, expected outcomes, evidence
  - `05-pitfalls.md`: resolved failures, dead ends, do-not-repeat notes

## Guidance
- Keep `roadmap.md` macro-level and executable: phases, deliverables, verification, rollback.
- Push deep technical detail (API signatures, schema evolution, edge cases) into the detailed bundle.
- Record unresolved questions early; update assumptions as soon as they are answered.
