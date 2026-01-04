# Dev Docs

Persistent task documentation for context preservation across sessions.

## Trigger Conditions

| Condition | Action |
|-----------|--------|
| Complex task (multi-module, multi-session, >2 hours) | Create task bundle |
| Context reset on ongoing work | Read `00-overview.md` first |
| Task paused or handed off | Update docs via `update-dev-docs-for-handoff` |
| Task completed and verified | Archive via `update-dev-docs-for-handoff` with status=done |

## Directory Structure

```
dev-docs/
  active/<task-name>/
    roadmap.md              # Macro-level planning (plan-maker)
    00-overview.md          # Goal, non-goals, status
    01-plan.md              # Phases, milestones, acceptance criteria
    02-architecture.md      # Boundaries, interfaces, risks
    03-implementation-notes.md  # Decisions, changes, rationale
    04-verification.md      # Checks run, results
    05-pitfalls.md          # Resolved failures, historical lessons, "do-not-repeat" notes
  archive/                  # Completed tasks
```

## File Purposes

| File | Contains | Update Frequency |
|------|----------|------------------|
| `roadmap.md` | Macro-level goals, milestones, risks, rollback (from plan-maker) | Low (directional changes) |
| `00-overview.md` | Goal, non-goals, current status | On status change |
| `01-plan.md` | Phases, steps, acceptance criteria | On scope change |
| `02-architecture.md` | Boundaries, interfaces, key risks | On design decision |
| `03-implementation-notes.md` | What changed, why, and open issues (actionable TODOs) | After each milestone |
| `04-verification.md` | Checks run and results | After each check |
| `05-pitfalls.md` | Resolved failures, dead ends, historical lessons (not current issues) | After issue is resolved |

## AI Instructions

### On Context Reset

1. Read `dev-docs/active/<task-name>/00-overview.md`
2. Read `01-plan.md`
3. Read `05-pitfalls.md` (scan the `do-not-repeat` summary first)
4. Consult other files as needed

### During Work

- Update `00-overview.md` status field on state change
- Append to `03-implementation-notes.md` after milestones
- Record all verification runs in `04-verification.md`
- Record pitfalls in `05-pitfalls.md` after resolving a significant error/bug/dead-end (historical lessons, not current issues):
  - MUST include: symptom, root cause, what was tried, fix/workaround, and a prevention note

### Workflows

| Workflow | Use When |
|----------|----------|
| `create-dev-docs-plan` | Starting new complex task |
| `update-dev-docs-for-handoff` | Pausing, resuming, handing off, or completing |

### Archive Rules

When task status changes to "done" and all verification passes:
1. Move `dev-docs/active/<task-name>/` to `dev-docs/archive/<task-name>/`
2. This is handled by `update-dev-docs-for-handoff` when status=done

## Skip Conditions

Do NOT create dev docs for:
- Single-file changes
- Trivial fixes (<30 min)
- Simple refactors with clear scope
