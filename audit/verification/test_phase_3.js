/**
 * Phase 03 Automated Verification Test
 * Authority: docs/PHASES.md (Phase 03) & IMPLEMENTATION-ROADMAP-STAGES.md (Stage 4)
 *
 * Verifies canonical repository structure, workspace packages, linting/formatting
 * configs, environment template & validation, static JS-only/no-Tailwind guardrails,
 * and baseline health & documentation deliverables.
 */

'use strict';

const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..', '..');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, testName, details = '') {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  [PASS] ${testName}`);
  } else {
    failedTests++;
    console.error(`  [FAIL] ${testName}${details ? ': ' + details : ''}`);
  }
}

console.log('====================================================');
console.log('       RUNNING PHASE 03 VERIFICATION TEST SUITE     ');
console.log('====================================================\n');

// 1. Canonical Directories
const requiredDirs = [
  'client/src/app',
  'client/src/config',
  'client/src/styles',
  'server/src/config',
  'server/src/api/routes',
  'shared/constants',
  'shared/schemas',
  'database/migrations',
  'tests/unit/shared',
  'tests/api',
  'scripts/dev',
  'scripts/testing',
  'config/environments',
  'audit/verification'
];

requiredDirs.forEach((relDir) => {
  const full = path.join(repoRoot, relDir);
  assert(fs.existsSync(full) && fs.statSync(full).isDirectory(), `Directory exists: ${relDir}`);
});

// 2. Core Configuration & Baseline Files
const requiredFiles = [
  '.gitignore',
  '.env.example',
  '.prettierrc',
  '.prettierignore',
  'eslint.config.mjs',
  'vitest.config.mjs',
  'package.json',
  'README.md',
  'shared/package.json',
  'shared/index.js',
  'shared/schemas/envSchema.js',
  'server/package.json',
  'server/src/app.js',
  'server/src/server.js',
  'server/src/config/environment.js',
  'server/src/api/routes/health.routes.js',
  'client/package.json',
  'client/next.config.mjs',
  'client/src/config/environment.js',
  'client/src/styles/tokens.css',
  'client/src/styles/globals.css',
  'client/src/app/layout.jsx',
  'client/src/app/page.jsx',
  'client/src/app/page.module.css',
  'scripts/testing/verify-policy.js',
  'scripts/testing/run-phase-checks.js',
  'scripts/testing/run-validate.js',
  'scripts/dev/start-dev.js',
  'tests/unit/shared/envSchema.test.js',
  'tests/api/health.test.js'
];

requiredFiles.forEach((relFile) => {
  const full = path.join(repoRoot, relFile);
  assert(fs.existsSync(full) && fs.statSync(full).isFile(), `File exists: ${relFile}`);
});

// 3. Check Package Naming Neutrality & Workspaces
const rootPkg = JSON.parse(fs.readFileSync(path.join(repoRoot, 'package.json'), 'utf8'));
assert(
  Array.isArray(rootPkg.workspaces) &&
    rootPkg.workspaces.includes('client') &&
    rootPkg.workspaces.includes('server') &&
    rootPkg.workspaces.includes('shared'),
  'Root package.json declares client, server, shared workspaces'
);
assert(rootPkg.name === '@platform/erp-workspace', 'Root package uses neutral @platform identity');

[
  'clean_scripts',
  'dev',
  'build',
  'lint',
  'format:check',
  'policy:check',
  'test',
  'test:phases',
  'validate'
]
  .slice(1)
  .forEach((scriptName) => {
    assert(
      Boolean(rootPkg.scripts && rootPkg.scripts[scriptName]),
      `Root script exists: ${scriptName}`
    );
  });

// 4. Security Hygiene (.gitignore & .env.example)
const gitignore = fs.readFileSync(path.join(repoRoot, '.gitignore'), 'utf8');
assert(
  gitignore.includes('.env') && gitignore.includes('storage/'),
  '.gitignore excludes .env and local storage/'
);
const { execFileSync } = require('child_process');
const trackedEnv = execFileSync('git', ['ls-files', '--', '.env', '.env.*'], {
  cwd: repoRoot,
  encoding: 'utf8'
})
  .split(/\r?\n/)
  .map((s) => s.trim())
  .filter((s) => s && s !== '.env.example');
assert(trackedEnv.length === 0, 'No live .env secrets file is tracked in Git');

const envExample = fs.readFileSync(path.join(repoRoot, '.env.example'), 'utf8');
assert(
  envExample.includes('CHANGE_ME_LOCAL_ONLY') && envExample.includes('NEXT_PUBLIC_API_BASE_URL'),
  '.env.example uses non-secret placeholder values'
);

// 5. Verify CSS Modules & Zero Tailwind / Zero TypeScript
const pageCss = fs.readFileSync(path.join(repoRoot, 'client/src/app/page.module.css'), 'utf8');
assert(pageCss.includes('var(--color-'), 'Client styling consumes CSS design tokens');

function scanForForbidden(dir) {
  let forbidden = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (
      ['.git', 'node_modules', '.next', 'dist', 'build', 'storage', '.gemini'].includes(entry.name)
    ) {
      continue;
    }
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      forbidden = forbidden.concat(scanForForbidden(full));
    } else {
      if (
        entry.name.endsWith('.ts') ||
        entry.name.endsWith('.tsx') ||
        entry.name.includes('tsconfig')
      ) {
        forbidden.push(`TypeScript artifact: ${full}`);
      }
      if (entry.name.includes('tailwind.config')) {
        forbidden.push(`Tailwind config: ${full}`);
      }
    }
  }
  return forbidden;
}

const forbidden = scanForForbidden(repoRoot);
assert(
  forbidden.length === 0,
  'Zero TypeScript or Tailwind artifacts across repository',
  forbidden.join(', ')
);

console.log('\n====================================================');
console.log(`TOTAL CHECKS: ${totalTests} | PASSED: ${passedTests} | FAILED: ${failedTests}`);
console.log('====================================================');

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log('\n PHASE 03 REPOSITORY & DEV ENVIRONMENT VERIFICATION PASSED!\n');
  process.exit(0);
}
