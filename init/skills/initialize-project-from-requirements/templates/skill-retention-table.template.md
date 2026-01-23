# Skill Retention Table (Template)

Use this file during the Stage C completion checkpoint (before approving Stage C) to summarize available skills and record what to keep/delete. This file should live at `init/skill-retention-table.template.md`.

Translate the Description column to the user's preferred language if needed.

If a retention decision is not ready, note "TBD" in the Description column.

## Workflows

| Skill | Description |
|-------|-------------|
| <skill-name> | <short description> |

## Standards

| Skill | Description |
|-------|-------------|
| <skill-name> | <short description> |

Notes:
- If multiple skills share the same name, confirm the full path before deleting.
- Prefer the pipeline command (parses `## Deletion List` automatically):
  - Preview: `node init/skills/initialize-project-from-requirements/scripts/init-pipeline.mjs skill-retention --repo-root .`
  - Apply: `node init/skills/initialize-project-from-requirements/scripts/init-pipeline.mjs skill-retention --repo-root . --apply`
- (Advanced) You can still run `.ai/scripts/sync-skills.mjs` directly if needed.

## Deletion List (after confirmation)

List each skill to delete as a bullet item (the pipeline parses this section):

- <skill-name>
