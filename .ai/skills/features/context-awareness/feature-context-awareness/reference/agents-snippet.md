## Context Awareness (Feature)

If `docs/context/` exists:

- AI/LLM MUST treat `docs/context/INDEX.md` as the entry point for project context.
- AI/LLM MUST NOT "scan the repo" to infer APIs/DB/flows when context artifacts are available.
- AI/LLM MUST update `docs/context/` only via `node .ai/scripts/contextctl.js`.
  - Do NOT directly edit `docs/context/registry.json` by hand.
  - After any context change, run: `node .ai/scripts/contextctl.js touch` and `node .ai/scripts/contextctl.js verify --strict`.

Pack switching:

- AI/LLM MUST NOT edit `.ai/skills/_meta/sync-manifest.json` directly.
- AI/LLM MUST use: `node .ai/scripts/skillsctl.js enable-pack|disable-pack|sync ...`.

Project state:

- AI/LLM MUST treat `.ai/project/state.json` as the project "stage/state" SSOT.
- AI/LLM MUST use: `node .ai/scripts/projectctl.js` to change it.

