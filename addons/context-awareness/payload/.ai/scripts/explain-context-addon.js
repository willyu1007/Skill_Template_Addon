#!/usr/bin/env node
/**
 * explain-context-addon.js
 *
 * Quick reference for the Context Awareness add-on.
 */

console.log(`
Context Awareness Add-on
========================

Purpose
- Provide a stable, verifiable context layer for AI/LLM.
- Primary entry point: docs/context/ (NOT ad-hoc repo scanning).

Key files
- docs/context/INDEX.md                 Human/LLM entry point
- docs/context/registry.json            Canonical artifact index + checksums
- docs/context/db/schema.json           DB schema contract (generated)
- docs/context/api/openapi.yaml         API contract (if used)
- docs/context/process/*.bpmn           Process contracts (if used)

Scripts
- node .ai/scripts/contextctl.js init              Initialize docs/context/ (idempotent)
- node .ai/scripts/contextctl.js touch             Update registry checksums
- node .ai/scripts/contextctl.js verify --strict   Verify registry consistency (CI-friendly)

- node .ai/scripts/projectctl.js init              Initialize .ai/project/state.json
- node .ai/scripts/projectctl.js show              Display current project state

- node .ai/scripts/skillsctl.js status             Show enabled skill packs + manifest
- node .ai/scripts/skillsctl.js list-packs         List available packs

Database schema contract
- Do NOT hand-edit docs/context/db/schema.json.
- Update it via the SSOT-aware generator:
  node .ai/scripts/dbssotctl.js sync-to-context

Quick start
1) node .ai/scripts/contextctl.js init
2) node .ai/scripts/projectctl.js init
3) node .ai/scripts/dbssotctl.js status
4) node .ai/scripts/contextctl.js verify --strict
`);
