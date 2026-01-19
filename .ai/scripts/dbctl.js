#!/usr/bin/env node
/**
 * dbctl.js
 *
 * Database mirror controller.
 *
 * In this template, the **real database** is the SSOT when this feature is enabled.
 * The repository stores a structured mirror under db/ so an LLM can reason
 * about the schema without DB access.
 *
 * Core invariant:
 * - db/schema/tables.json is a mirror snapshot (NOT a hand-edited SSOT).
 *
 * Typical flow (human + LLM):
 * 1) Human runs: prisma db pull ...  (updates prisma/schema.prisma)
 * 2) LLM/human runs: node .ai/scripts/dbctl.js import-prisma
 * 3) LLM/human runs: node .ai/scripts/dbctl.js sync-to-context
 */

import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

import {
  readTextIfExists,
  readJsonIfExists,
  writeJson,
  parsePrismaSchema,
  buildNormalizedDbSchema,
  normalizeDbMirrorSchema
} from './lib/normalized-db-schema.js';

function usage(exitCode = 0) {
  const msg = `
Usage:
  node .ai/scripts/dbctl.js <command> [options]

Commands:
  help
    Show this help.

  init
    --repo-root <path>          Repo root (default: cwd)
    Create db/ skeleton (idempotent).

  import-prisma
    --repo-root <path>          Repo root (default: cwd)
    --schema <path>             Prisma schema path (default: prisma/schema.prisma)
    --out <path>                Output mirror path (default: db/schema/tables.json)
    Import prisma/schema.prisma into db/schema/tables.json (normalized-db-schema-v2).

  list-tables
    --repo-root <path>          Repo root (default: cwd)
    --format <text|json>        Output format (default: text)
    List tables in db/schema/tables.json.

  verify
    --repo-root <path>          Repo root (default: cwd)
    --strict                    Fail if the mirror is missing or malformed
    Verify the mirror file is parseable.

  sync-to-context
    --repo-root <path>          Repo root (default: cwd)
    Regenerate docs/context/db/schema.json via dbssotctl (best effort).

  generate-migration
    --repo-root <path>          Repo root (default: cwd)
    --name <migration-name>     Required
    Create an empty SQL migration file under db/migrations/.

Notes:
- This feature does NOT connect to databases.
- Humans own credentials and execute real migrations.
`;
  console.log(msg.trim());
  process.exit(exitCode);
}

function die(msg, exitCode = 1) {
  console.error(msg);
  process.exit(exitCode);
}

function parseArgs(argv) {
  const args = argv.slice(2);
  if (args.length === 0 || args[0] === '-h' || args[0] === '--help') usage(0);

  const command = args.shift();
  const opts = {};

  while (args.length > 0) {
    const token = args.shift();
    if (token === '-h' || token === '--help') usage(0);

    if (token.startsWith('--')) {
      const key = token.slice(2);
      if (args.length > 0 && !args[0].startsWith('--')) {
        opts[key] = args.shift();
      } else {
        opts[key] = true;
      }
    }
  }

  return { command, opts };
}

function toPosix(p) {
  return String(p).replace(/\\/g, '/');
}

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function nowStamp() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return (
    d.getUTCFullYear() +
    pad(d.getUTCMonth() + 1) +
    pad(d.getUTCDate()) +
    pad(d.getUTCHours()) +
    pad(d.getUTCMinutes()) +
    pad(d.getUTCSeconds())
  );
}

function repoPaths(repoRoot) {
  return {
    dbRoot: path.join(repoRoot, 'db'),
    mirrorPath: path.join(repoRoot, 'db', 'schema', 'tables.json'),
    migrationsDir: path.join(repoRoot, 'db', 'migrations'),
    envsPath: path.join(repoRoot, 'db', 'config', 'db-environments.json'),
    workdocsDir: path.join(repoRoot, 'db', 'workdocs')
  };
}

function cmdInit(repoRoot) {
  const p = repoPaths(repoRoot);

  ensureDir(path.join(p.dbRoot, 'schema'));
  ensureDir(path.join(p.dbRoot, 'config'));
  ensureDir(p.migrationsDir);
  ensureDir(path.join(p.dbRoot, 'samples'));
  ensureDir(p.workdocsDir);

  // Skeleton mirror file (v2)
  if (!fs.existsSync(p.mirrorPath)) {
    const mirror = buildNormalizedDbSchema({
      mode: 'database',
      source: { kind: 'database', path: '' },
      database: { kind: 'relational', dialect: 'generic', name: '', schemas: [] },
      enums: [],
      tables: [],
      notes: 'DB mirror skeleton. Populate via: node .ai/scripts/dbctl.js import-prisma'
    });
    writeJson(p.mirrorPath, mirror);
  }

  // Environment configuration
  if (!fs.existsSync(p.envsPath)) {
    writeJson(p.envsPath, {
      environments: [
        {
          id: 'dev',
          description: 'Local development',
          connectionTemplate: 'postgresql://${DB_USER}:${DB_PASSWORD}@localhost:5432/${DB_NAME}',
          permissions: { migrations: true, seedData: true, directQueries: true }
        },
        {
          id: 'staging',
          description: 'Staging environment',
          connectionTemplate: 'postgresql://${DB_USER}:${DB_PASSWORD}@staging-host:5432/${DB_NAME}',
          permissions: { migrations: true, seedData: false, directQueries: false }
        },
        {
          id: 'prod',
          description: 'Production environment',
          connectionTemplate: 'postgresql://${DB_USER}:${DB_PASSWORD}@prod-host:5432/${DB_NAME}',
          permissions: { migrations: false, seedData: false, directQueries: false }
        }
      ]
    });
  }

  // Workdocs README
  const workdocsReadme = path.join(p.workdocsDir, 'README.md');
  if (!fs.existsSync(workdocsReadme)) {
    fs.writeFileSync(
      workdocsReadme,
      `# DB workdocs\n\nUse this folder for:\n- DB change proposals (desired-state)\n- Migration plans and risk notes\n- Rollout and verification checklists\n\nSSOT note:\n- The real database is SSOT.\n- Keep db/schema/tables.json as a mirror snapshot (generated).\n`,
      'utf8'
    );
  }

  console.log('[ok] db-mirror initialized.');
  console.log(`  - Mirror: ${toPosix(path.relative(repoRoot, p.mirrorPath))}`);
}

function cmdImportPrisma(repoRoot, schemaPathOpt, outPathOpt) {
  const schemaPath = path.resolve(repoRoot, schemaPathOpt || path.join('prisma', 'schema.prisma'));
  const outPath = path.resolve(repoRoot, outPathOpt || path.join('db', 'schema', 'tables.json'));

  const prismaText = readTextIfExists(schemaPath);
  if (!prismaText) {
    die(`[error] Prisma schema not found: ${toPosix(path.relative(repoRoot, schemaPath))}`);
  }

  const parsed = parsePrismaSchema(prismaText);

  const mirror = buildNormalizedDbSchema({
    mode: 'database',
    source: { kind: 'prisma-schema', path: toPosix(path.relative(repoRoot, schemaPath)) },
    database: parsed.database,
    enums: parsed.enums,
    tables: parsed.tables,
    notes: 'Mirror of real DB shape (imported via prisma/schema.prisma).'
  });

  ensureDir(path.dirname(outPath));
  writeJson(outPath, mirror);

  console.log('[ok] Imported Prisma schema into DB mirror.');
  console.log(`  - From: ${toPosix(path.relative(repoRoot, schemaPath))}`);
  console.log(`  - To:   ${toPosix(path.relative(repoRoot, outPath))}`);
}

function cmdListTables(repoRoot, format) {
  const p = repoPaths(repoRoot);
  const raw = readJsonIfExists(p.mirrorPath);
  if (!raw) die(`[error] Mirror not found: ${toPosix(path.relative(repoRoot, p.mirrorPath))}`);

  const normalized = normalizeDbMirrorSchema(raw);
  const tables = normalized.tables || [];

  if (format === 'json') {
    console.log(JSON.stringify({ count: tables.length, tables }, null, 2));
    return;
  }

  console.log(`Tables (${tables.length})`);
  for (const t of tables) {
    const cols = Array.isArray(t.columns) ? t.columns.length : 0;
    console.log(`- ${t.name}${t.dbName ? ` (db: ${t.dbName})` : ''} [columns: ${cols}]`);
  }
}

function cmdVerify(repoRoot, strict) {
  const p = repoPaths(repoRoot);
  const raw = readJsonIfExists(p.mirrorPath);
  if (!raw) {
    if (strict) die(`[error] Mirror missing: ${toPosix(path.relative(repoRoot, p.mirrorPath))}`);
    console.warn(`[warn] Mirror missing: ${toPosix(path.relative(repoRoot, p.mirrorPath))}`);
    return;
  }

  const normalized = normalizeDbMirrorSchema(raw);
  const ok = normalized.version === 2 && Array.isArray(normalized.tables);

  if (!ok && strict) die('[error] Mirror file is not a valid normalized-db-schema-v2.');

  console.log(`[ok] Mirror looks parseable (version=${normalized.version}, tables=${normalized.tables.length}).`);
}

function cmdSyncToContext(repoRoot) {
  const dbssotctl = path.join(repoRoot, '.ai', 'scripts', 'dbssotctl.js');
  if (!fs.existsSync(dbssotctl)) {
    console.warn('[warn] dbssotctl.js not found; cannot sync docs/context.');
    return;
  }

  const res = spawnSync('node', [dbssotctl, 'sync-to-context', '--repo-root', repoRoot], {
    cwd: repoRoot,
    stdio: 'inherit'
  });

  if (res.status !== 0) {
    die(`[error] dbssotctl sync-to-context failed (exit ${res.status}).`);
  }
}

function cmdGenerateMigration(repoRoot, name) {
  if (!name) die('[error] --name is required');
  const p = repoPaths(repoRoot);
  ensureDir(p.migrationsDir);

  const slug = String(name)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');

  const file = `${nowStamp()}_${slug || 'migration'}.sql`;
  const dest = path.join(p.migrationsDir, file);

  if (fs.existsSync(dest)) die(`[error] Migration already exists: ${file}`);

  const header = `-- Migration: ${file}\n-- Created: ${new Date().toISOString()}\n-- Notes: This repo treats the real DB as SSOT. Humans apply SQL.\n\n`;
  fs.writeFileSync(dest, header, 'utf8');

  console.log('[ok] Migration created:');
  console.log(`  - ${toPosix(path.relative(repoRoot, dest))}`);
}

function main() {
  const { command, opts } = parseArgs(process.argv);
  const repoRoot = path.resolve(opts['repo-root'] || process.cwd());
  const format = String(opts['format'] || 'text').toLowerCase();
  const strict = !!opts['strict'];

  if (command === 'help') return usage(0);
  if (command === 'init') return cmdInit(repoRoot);
  if (command === 'import-prisma') return cmdImportPrisma(repoRoot, opts['schema'], opts['out']);
  if (command === 'list-tables') return cmdListTables(repoRoot, format);
  if (command === 'verify') return cmdVerify(repoRoot, strict);
  if (command === 'sync-to-context') return cmdSyncToContext(repoRoot);
  if (command === 'generate-migration') return cmdGenerateMigration(repoRoot, opts['name']);

  usage(1);
}

main();
