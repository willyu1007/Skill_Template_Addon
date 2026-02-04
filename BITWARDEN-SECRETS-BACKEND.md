# Bitwarden Secrets Manager (`bws`) backend for `env_localctl` / `env_contractctl`

## Purpose

Enable using **Bitwarden Secrets Manager** as the **external SSOT for secret values** while keeping the repo as SSOT for:
- env contract / variable names
- values/secrets references (`secret_ref`)
- generation tooling (`env_localctl`)

This is designed for the v1 environment strategy where:
- `staging/prod` runtime workloads are **role-only** (no AK fallback at runtime)
- secret values are **never** stored in repo, `.env.*`, IaC state, or outputs

## Motivation

- **Convenience + multi-project reuse**: Bitwarden can be the shared secret store across projects without tying SSOT to one cloud vendor.
- **Security boundary**: keep secret values out of Git and out of IaC state/outputs.
- **Operational clarity**: use a pull-based workflow to generate `.env.local` (dev) or deployment env-files (ops), rather than giving runtime workloads access to Bitwarden.

## Solution (high level)

- Add a new secrets backend: `backend: bws`.
- Resolve secrets via the **Bitwarden Secrets Manager CLI** (`bws`) using an access token provided at runtime in the shell:
  - `BWS_ACCESS_TOKEN` environment variable
- Support mapping styles:
  - Explicit fields: `project_id` or `project_name` + `key`
  - Compact `ref` form: `bws://<PROJECT_ID>?key=<SECRET_KEY>`

## Security invariants (MUST)

- **Do not commit tokens**: `BWS_ACCESS_TOKEN` must be provided via the user shell / CI secret store only.
- **Do not print secret values**: `env_localctl.py` must not log or echo values returned by `bws`.
- **Prefer read-only tokens**: Machine Accounts used for `compile` should typically be read-only for their target Project.
- **No runtime Bitwarden access**: in the recommended deployment model, ECS/runtime does not receive Bitwarden tokens; env/config is injected during deploy.

## Config format

### Recommended (`project_name` + `key`)

In your env secrets reference file (example shape):

```yaml
version: 1
secrets:
  db/password:
    backend: bws
    project_name: "<your-bitwarden-project-name>"
    key: "project/dev/db/password"
    hint: "Bitwarden Secrets Manager key in the dev Project"
```

### Alternative (compact `ref`)

```yaml
version: 1
secrets:
  db/password:
    backend: bws
    ref: "bws://<PROJECT_ID>?key=project/dev/db/password"
```

## Implementation details

### Code

`env_localctl.py` secret resolver now supports:
- `backend == "bws"`:
  - validates `BWS_ACCESS_TOKEN` exists
  - resolves `project_id` (direct) or `project_name` (via `bws project list`)
  - loads secrets (via `bws secret list <projectId>`) and finds the matching `key`
  - caches project IDs and secret maps in-memory for the current run

CLI safety choices:
- Always pass `--color no` to avoid ANSI noise in JSON output.
- Avoid including `stdout` in errors for `bws secret list` failures (because some CLIs may print sensitive content on error).

### Docs

The reference docs for env contracts now list `bws` as a supported backend and include examples.

## What changed (files)

- `.ai/skills/features/environment/env-localctl/scripts/env_localctl.py`
  - Add `bws` backend support and safe CLI runner.
- `.ai/skills/features/environment/env-localctl/references/secrets-backends.md`
  - Document `bws` backend usage and prerequisites.
- `.ai/skills/features/environment/env-contractctl/references/values-and-secrets-format.md`
  - Document `bws` backend in the contract format reference.

## How to verify (no secrets printed)

1. Ensure `bws` is installed and in `PATH`.
2. Export the access token (PowerShell):
   - `$env:BWS_ACCESS_TOKEN = "<token>"`
3. Confirm access (safe field selection):
   - `bws project list --output json --color no | ConvertFrom-Json | Select-Object name,id`
   - `bws secret list <PROJECT_ID> --output json --color no | ConvertFrom-Json | Select-Object key,id`
4. Run env tooling:
   - `python .ai/skills/features/environment/env-localctl/scripts/env_localctl.py doctor --env dev`
   - `python .ai/skills/features/environment/env-localctl/scripts/env_localctl.py compile --env dev`

## Non-goals (v1)

- Automatically creating Bitwarden Projects / secrets from the repo.
- Runtime fetching secrets from Bitwarden (dynamic secrets injection at runtime).
- Cloud-provider-specific secret manager integration (e.g., Alibaba Cloud KMS/Credentials Manager).

