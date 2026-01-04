---
name: naming-conventions
description: Apply consistent naming conventions for directories, files, and identifiers - covers kebab-case rules, SSOT layout, skill naming standards, and script-generated file paths (including temporary files under .ai/.tmp/).
---

# Naming Conventions

## Purpose

Define naming conventions for directories, files, and identifiers with these goals:
- **Scriptability**: scripts can locate files reliably with fewer branches
- **Portability**: cross OS/IDE moves should require zero or minimal renaming
- **Readability**: humans and LLMs can infer purpose and scope from names

## When to use

Use this skill when:
- Creating new directories or files
- Naming skills, workflows, or commands
- Reviewing code for naming consistency
- Setting up CI checks for naming standards
- **Scripts generating files**: scripts that create new files/directories MUST read this skill first

### For Scripts

If your script generates files or directories, import or reference this skill to ensure consistent naming:
- Skill path: `.ai/skills/standards/naming-conventions/SKILL.md`
- Apply kebab-case rules to all generated paths
- Validate output names against the conventions before writing

## Inputs

- The item to name (directory, file, skill, identifier)
- Context (SSOT content, provider stubs, general repo files)

## Outputs

- Correctly named items following conventions
- Validation results for existing names


## Steps
1. Identify what you are naming (file, directory, module, component, hook, API surface, configuration key, or data entity).
2. Choose the most relevant convention section below and follow the MUST rules first.
3. Propose 2-3 candidates and select the one that matches existing local conventions and avoids ambiguous abbreviations.
4. Apply the chosen name consistently across declarations and references (imports, exports, docs, and tests).
5. Verify that the resulting names are searchable, unambiguous, and do not collide with existing names.

## Global Rules (MUST)

- Use **kebab-case** (lowercase + hyphens) by default: `skill-name`, `sync-skills`
- Avoid spaces and special characters (except `.`-prefixed directories)
- Recommended charset: `[a-z0-9-._]`
- Directory names express "scope/role"; file names express "type/content"
- Avoid non-maintainable buckets like `misc/` or `temp/`

## Directory Layout (MUST)

### SSOT Root

- SSOT root is fixed: `.ai/`
- SSOT subdirectories:
  - `.ai/skills/` (skills and workflows live here)
  - `.ai/scripts/` (maintenance scripts)
  - `.ai/rules/` (if using rules)
  - `.ai/llm-config/` (LLM configuration and registries)
  - `.ai/.tmp/` (temporary files, gitignored - see "Temporary Files" section)

### Skill Entry Stubs

- Entry stub roots are fixed:
  - `.codex/skills/`
  - `.claude/skills/`

Notes:
- Stubs contain only `SKILL.md` pointers back to `.ai/skills/`
- Do not edit stub directories directly; regenerate with `.ai/scripts/sync-skills.cjs`

### Other Top-Level Directories (Recommended)

- `docs/project/`: project-specific documentation (requirements, blueprints)
- `scripts/`: script entrypoints (cross-platform can share the same base name with different suffixes)
- `init/`: bootstrap materials (if present)

## Skill Naming (MUST)

### Skill Directory

- Path: `.ai/skills/.../<skill-name>/SKILL.md` (taxonomy directories are allowed)
- `<skill-name>`: kebab-case; encode capability/domain/tool
- Avoid ambiguous names

Examples:
- `skill-creator`
- `repo-init`
- `doc-style-guide`

### Skill Name Field

- The `name` in SKILL.md frontmatter MUST match the **leaf** directory name
- Use capability-oriented names (verb + domain/tool)

### Supporting Files

- Use kebab-case or snake_case for filenames
- Allowed: `reference.md`, `examples.md`, `scripts/`, `templates/`
- Forbidden: `resources/` subdirectory

## Workflow Naming

- Workflows are stored as skills
- Name by intent/process: `refactor-planner`, `release-checklist`
- Path: `.ai/skills/.../<workflow-name>/SKILL.md`

## Temporary Files and Environments (MUST)

When scripts or workflows need to create temporary files or staging environments:

### Designated Temporary Directory

- **Path**: `.ai/.tmp/`
- **Purpose**: temporary/intermediate files, staging environments, build artifacts
- **Lifecycle**: contents may be deleted at any time; do not store persistent data here

### Usage Guidelines

Use `.ai/.tmp/` for:
- Temporary test environments or sandboxes
- Intermediate build or generation outputs
- Staging files before final placement
- Script-generated scratch data

### Naming within `.ai/.tmp/`

- Use descriptive subdirectories: `.ai/.tmp/<script-name>/`, `.ai/.tmp/<task-name>/`
- Include timestamps for disambiguation if needed: `.ai/.tmp/build-2024-01-15/`
- Clean up after task completion when possible

### .gitignore Requirement

Ensure `.ai/.tmp/` is listed in `.gitignore`:

```
# Temporary files
.ai/.tmp/
```

### Boundaries

- Do NOT use project root for temporary files
- Do NOT create ad-hoc `temp/`, `tmp/`, or `scratch/` directories elsewhere
- Do NOT commit contents of `.ai/.tmp/` to version control

## Versioning and Changes (SHOULD)

- Prefer explicit version fields / change logs for SSOT content
- If the directory structure changes, update all of:
  - Naming conventions documentation
  - Path constants/mappings in `.ai/scripts/`
  - Usage examples in `README.md`

## Verification

Check naming compliance:
- All directories use kebab-case
- No spaces or special characters in names
- Skill `name` field matches directory name
- No `resources/` directories under skills

## Boundaries

- Do NOT use spaces in directory or file names
- Do NOT create `misc/`, `temp/`, or similar catch-all directories
- Do NOT use uppercase in directory names (except for special files like `SKILL.md`, `README.md`)

## Included assets

None.
