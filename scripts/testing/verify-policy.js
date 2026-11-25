'use strict';

const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..', '..');
const IGNORED_DIRS = new Set([
  '.git',
  'node_modules',
  '.next',
  'dist',
  'build',
  'coverage',
  'storage',
  '.gemini'
]);

const violations = [];

function scanTree(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (IGNORED_DIRS.has(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    const relPath = path.relative(repoRoot, fullPath);

    if (entry.isDirectory()) {
      scanTree(fullPath);
      continue;
    }

    // Rule 1: JavaScript only — zero TypeScript
    if (
      entry.name.endsWith('.ts') ||
      entry.name.endsWith('.tsx') ||
      entry.name.startsWith('tsconfig')
    ) {
      violations.push(`[JS-ONLY VIOLATION] TypeScript file not permitted: ${relPath}`);
    }

    // Rule 2: Zero Tailwind CSS config or dependency
    if (entry.name.startsWith('tailwind.config')) {
      violations.push(`[NO-TAILWIND VIOLATION] Tailwind config not permitted: ${relPath}`);
    }

    if (entry.name === 'package.json') {
      const pkg = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
      const allDeps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
      for (const dep of Object.keys(allDeps)) {
        if (dep === 'typescript' || dep.includes('tailwindcss')) {
          violations.push(`[TECH-STACK VIOLATION] Forbidden dependency "${dep}" in ${relPath}`);
        }
      }
    }

    // Rule 3: No real .env files committed/present with non-example names (warn/check tracked secrets)
    if (
      entry.name === '.env' ||
      (entry.name.startsWith('.env.') && entry.name !== '.env.example')
    ) {
      const text = fs.readFileSync(fullPath, 'utf8');
      if (text.includes('BEGIN PRIVATE KEY') || text.includes('BEGIN RSA PRIVATE KEY')) {
        violations.push(`[SECRET VIOLATION] Private key found inside ${relPath}`);
      }
    }
  }
}

scanTree(repoRoot);

if (violations.length > 0) {
  console.error(
    'Policy check FAILED with violations:\n' + violations.map((v) => `  - ${v}`).join('\n')
  );
  process.exit(1);
}

console.log(
  '[PASS] Static Policy Check: JavaScript-only, No-Tailwind, and secret hygiene verified.'
);
