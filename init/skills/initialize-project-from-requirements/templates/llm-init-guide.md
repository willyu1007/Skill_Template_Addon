# LLM Initialization Guide

The document provides **step-by-step guidance** for an AI assistant to help a user complete project initialization using the init kit.

> **Relationship with `conversation-prompts.md`**:
> - **The llm-init-guide.md file**: End-to-end process guide with phase-by-phase instructions
> - **conversation-prompts.md**: Question bank and modular prompts for the requirements interview
> 
> Use llm-init-guide.md for the overall flow; reference conversation-prompts.md for detailed question templates.

---

## Contents

1. [Overview](#overview)
2. [Phase 1: Requirements interview](#phase-1-requirements-interview)
3. [Phase 2: Technology stack selection](#phase-2-technology-stack-selection)
4. [Phase 3: Blueprint generation](#phase-3-blueprint-generation)
5. [Phase 4: Add-on recommendations](#phase-4-add-on-recommendations)
6. [Phase 5: Configuration generation](#phase-5-configuration-generation)
7. [Decision tree reference](#decision-tree-reference)

---

## Overview

```
user starts initialization
       │
       ▼
┌────────────────────────────┐
│ Phase 1: requirements       │  ← use modules A/B in conversation-prompts.md
└─────────────┬──────────────┘
              │
              ▼
┌────────────────────────────┐
│ Phase 2: tech stack         │  ← decide language/framework/package manager
└─────────────┬──────────────┘
              │
              ▼
┌────────────────────────────┐
│ Phase 3: blueprint          │  ← generate project-blueprint.json
└─────────────┬──────────────┘
              │
              ▼
┌────────────────────────────┐
│ Phase 4: add-ons            │  ← recommend add-ons based on capabilities
└─────────────┬──────────────┘
              │
              ▼
┌────────────────────────────┐
│ Phase 5: configuration      │  ← template or LLM-generated configs
└─────────────┬──────────────┘
              │
              ▼
         run apply
```

---

## Phase 1: Requirements interview

### Must-ask checklist

Ask the 7 must-ask questions in order. See **Module A** in `conversation-prompts.md` for the detailed question templates:

1. One-sentence purpose
2. Primary user roles
3. Must-have features
4. Explicit exclusions
5. User journeys
6. Hard constraints
7. Success metrics

For projects with specific capabilities, also use the **branch modules** in `conversation-prompts.md`:
- B1: API module
- B2: Database module
- B3: BPMN/process module
- B4: CI/quality module

### Output requirements

During initialization, write the answers into these files (working location):
- `init/stage-a-docs/requirements.md` - primary requirements
- `init/stage-a-docs/non-functional-requirements.md` - non-functional requirements
- `init/stage-a-docs/domain-glossary.md` - domain glossary
- `init/stage-a-docs/risk-open-questions.md` - risks and open questions

> **Note**: After initialization completes, use `cleanup-init --archive` to move these files to `docs/project/`.

---

## Phase 2: Technology stack selection

### 2.1 Primary language

**Ask**: "What is the primary implementation language for this project?"

| Language | Built-in template | Package manager options |
|----------|-------------------|-------------------------|
| TypeScript | ✅ | pnpm, npm, yarn |
| JavaScript | ✅ | pnpm, npm, yarn |
| Go | ✅ | go |
| C/C++ | ✅ | xmake |
| Python | ❌ (LLM-generated) | pip, poetry, pipenv, uv |
| Java | ❌ (LLM-generated) | maven, gradle |
| Kotlin | ❌ (LLM-generated) | maven, gradle |
| .NET (C#) | ❌ (LLM-generated) | dotnet |
| Rust | ❌ (LLM-generated) | cargo |
| Ruby | ❌ (LLM-generated) | bundler |
| PHP | ❌ (LLM-generated) | composer |

### 2.2 Framework selection (by language)

**TypeScript/JavaScript frontend**:
- React, Vue, Svelte, Angular, Solid
- Next.js, Nuxt, Remix, Astro

**TypeScript/JavaScript backend**:
- Express, Fastify, Hono, NestJS, Koa

**Python**:
- FastAPI, Django, Flask, Litestar

**Go**:
- Gin, Echo, Fiber, Chi

**Java/Kotlin**:
- Spring Boot, Quarkus, Micronaut

### 2.3 Repo layout

**Ask**: "Is this a single app repo or a multi-app repo?"

- `single` - single app (`src/` layout)
- `monorepo` - multiple apps/packages (`apps/` + `packages/` layout)

---

## Phase 3: Blueprint generation

Based on Phases 1-2, generate `init/project-blueprint.json` (working location during initialization).

### Minimal blueprint template

```json
{
  "version": 1,
  "project": {
    "name": "<project name, kebab-case>",
    "description": "<project description>"
  },
  "repo": {
    "layout": "<single|monorepo>",
    "language": "<language>",
    "packageManager": "<package manager>"
  },
  "capabilities": {
    "frontend": { "enabled": <true|false>, "framework": "<framework>" },
    "backend": { "enabled": <true|false>, "framework": "<framework>" },
    "api": { "style": "<rest|graphql|rpc|none>", "auth": "<auth strategy>" },
    "database": { "enabled": <true|false>, "kind": "<db kind>" }
  },
  "quality": {
    "testing": { "unit": true },
    "ci": { "enabled": <true|false> }
  },
  "skills": {
    "packs": ["workflows"]
  },
  "addons": {}
}
```

### skills.packs auto-recommendation rules

| Condition | Recommended pack |
|----------|-------------------|
| Always | `workflows` |
| `capabilities.backend.enabled: true` | `backend` |
| `capabilities.frontend.enabled: true` | `frontend` |
| Needs code standards | `standards` |
| `addons.contextAwareness: true` | `context-core` (provided by the add-on) |

---

## Phase 4: Add-on recommendations

Recommend add-ons based on `capabilities` in the blueprint. See **Module D** in `conversation-prompts.md` for detailed decision prompts for each add-on.

### Quick recommendation rules

| Condition | Recommended add-on |
|----------|---------------------|
| `api.style != "none"` or `database.enabled` or `bpmn.enabled` | `contextAwareness` |
| `database.enabled: true` | `dbMirror` |
| `quality.ci.enabled: true` | `ciTemplates` |
| Needs containerization | `packaging` |
| Needs multi-environment deployment | `deployment` |
| Needs versioning/changelog workflows | `release` |
| Needs metrics/logging/tracing contracts | `observability` |

### Example prompt

```
Based on your project needs, I recommend these add-ons:

1. ✅ context-awareness - your project has an API and a database
2. ✅ db-mirror - database schema management
3. ❓ ci-templates - do you need CI/CD configuration?

Do you want to enable these add-ons?
```

---

## Phase 5: Configuration generation

### 5.1 Languages with built-in templates

For languages with built-in templates (TypeScript, Go, C/C++, etc.), `scaffold-configs.cjs` will generate configuration files automatically.

### 5.2 Languages without templates (LLM-generated)

When the selected language has no built-in template, the LLM should generate configuration files using rules like the following.

#### Python projects

**Must-generate files**:

```toml
# pyproject.toml
[project]
name = "{{project.name}}"
version = "0.1.0"
description = "{{project.description}}"
requires-python = ">=3.11"

[tool.pytest.ini_options]
testpaths = ["tests"]

[tool.ruff]
line-length = 88
target-version = "py311"

[tool.mypy]
python_version = "3.11"
strict = true
```

**Optional files** (based on package manager):
- `requirements.txt` (pip)
- `Pipfile` (pipenv)
- Poetry: add a `[tool.poetry]` section to `pyproject.toml`

**Directory structure**:
```
src/
  {{project.name.replace('-', '_')}}/
    __init__.py
tests/
  __init__.py
  test_placeholder.py
```

#### Java projects (Maven)

**Must-generate files**:

```xml
<!-- pom.xml -->
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0">
    <modelVersion>4.0.0</modelVersion>
    <groupId>com.example</groupId>
    <artifactId>{{project.name}}</artifactId>
    <version>0.1.0-SNAPSHOT</version>
    <packaging>jar</packaging>
    
    <properties>
        <java.version>21</java.version>
        <maven.compiler.source>${java.version}</maven.compiler.source>
        <maven.compiler.target>${java.version}</maven.compiler.target>
    </properties>
</project>
```

**Directory structure**:
```
src/
  main/
    java/
      com/example/{{project.name}}/
        Application.java
    resources/
  test/
    java/
```

#### Java projects (Gradle)

**Must-generate files**:

```kotlin
// build.gradle.kts
plugins {
    java
    application
}

group = "com.example"
version = "0.1.0-SNAPSHOT"

java {
    toolchain {
        languageVersion.set(JavaLanguageVersion.of(21))
    }
}

repositories {
    mavenCentral()
}

dependencies {
    testImplementation("org.junit.jupiter:junit-jupiter:5.10.0")
}

tasks.test {
    useJUnitPlatform()
}
```

```kotlin
// settings.gradle.kts
rootProject.name = "{{project.name}}"
```

#### .NET projects

**Must-generate files**:

```xml
<!-- {{project.name}}.csproj -->
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFramework>net8.0</TargetFramework>
    <ImplicitUsings>enable</ImplicitUsings>
    <Nullable>enable</Nullable>
  </PropertyGroup>
</Project>
```

```json
// global.json
{
  "sdk": {
    "version": "8.0.0",
    "rollForward": "latestFeature"
  }
}
```

#### Rust projects

**Must-generate files**:

```toml
# Cargo.toml
[package]
name = "{{project.name}}"
version = "0.1.0"
edition = "2021"

[dependencies]

[dev-dependencies]
```

**Directory structure**:
```
src/
  main.rs  # or lib.rs
```

---

## Decision tree reference

### Language → package manager

```
choose language
├── TypeScript/JavaScript
│   └── recommended: pnpm > yarn > npm
├── Python
│   └── recommended: poetry > pip > uv
├── Go
│   └── fixed: go
├── Java/Kotlin
│   └── recommended: gradle > maven
├── .NET
│   └── fixed: dotnet
├── Rust
│   └── fixed: cargo
└── C/C++
    └── recommended: xmake > cmake
```

### Capabilities → add-on recommendations

```
check capabilities
├── api.style != "none"
│   └── recommended: contextAwareness
├── database.enabled
│   ├── recommended: contextAwareness
│   └── recommended: dbMirror
├── bpmn.enabled
│   └── recommended: contextAwareness
├── quality.ci.enabled
│   └── recommended: ciTemplates
└── devops needs
    ├── containerization → packaging
    ├── multi-environment → deployment
    └── versioning → release
```

---

## Full example conversation

```
AI: Let's start initializing your project. First, in one sentence: what problem does this project solve and for whom?

User: It's an inventory management system for small businesses, helping them track products and orders.

AI: Got it. Next questions:
1. Who are the primary users?
2. What are the must-have features?
3. What is explicitly out of scope for this version?

User: Warehouse managers and purchasing staff. Must-have: inbound/outbound inventory, inventory queries, low-stock alerts. Out of scope: finance module, supplier management.

AI: Thanks. Now let's determine the tech stack:
1. What is the primary language?
2. Do you need a web frontend?
3. Any database preference?

User: TypeScript, React for the frontend, PostgreSQL for the database.

AI: Great. I'll generate the project blueprint. Based on your needs, I recommend:

- Language: TypeScript + pnpm
- Layout: single
- Frontend: React
- Backend: Express
- Database: PostgreSQL

Recommended add-ons:
- ✅ context-awareness (API/database contract management)
- ✅ db-mirror (database schema management)
- ❓ ci-templates (CI/CD configuration)

Do you want to confirm this configuration?
```

---

## Notes

1. **Do not skip stages**: complete each phase in order.
2. **Write decisions to files**: record answers and decisions in the corresponding docs/config files.
3. **Validate inputs**: use `check-docs` and `validate` to verify inputs.
4. **User approval is required**: do not proceed to the next stage without explicit user confirmation.
