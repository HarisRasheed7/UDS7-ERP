'use strict';

const fs = require('fs');
const path = require('path');

const IGNORED_DIRS = new Set([
  '.git',
  'node_modules',
  '.next',
  'dist',
  'build',
  'coverage',
  'reports',
  'storage',
  '.gemini'
]);

const PRIVATE_KEY_RE = /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/;
const GITHUB_TOKEN_RE = /\b(ghp_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,})\b/;
const TAILWIND_CSS_RE = /@tailwind\s+(base|components|utilities)\b/;
const IMPORT_SPECIFIER_RE = /(?:require\(\s*['"]([^'"]+)['"]\s*\)|from\s+['"]([^'"]+)['"])/g;
const CLIENT_FORBIDDEN_IMPORT_RE =
  /(?:require\(|from\s+)['"](?:pg|fastify|dotenv|\.\.?\/.*server\/)/;

/**
 * Runs static policy checks across a workspace root.
 * Enforces JS-only, No-Tailwind, secret hygiene, and modular monolith import boundaries.
 * @param {string} [targetRoot]
 * @returns {{ passed: boolean, violations: string[], filesScanned: number }}
 */
function verifyPolicy(targetRoot) {
  const repoRoot = path.resolve(targetRoot || path.join(__dirname, '..', '..'));
  const violations = [];
  let filesScanned = 0;

  function scanTree(dir) {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      if (IGNORED_DIRS.has(entry.name)) continue;
      const fullPath = path.join(dir, entry.name);
      const relPath = path.relative(repoRoot, fullPath).replace(/\\/g, '/');

      if (entry.isDirectory()) {
        scanTree(fullPath);
        continue;
      }

      filesScanned++;

      // 1. JavaScript-only rule: zero TypeScript artifacts
      if (
        entry.name.endsWith('.ts') ||
        entry.name.endsWith('.tsx') ||
        entry.name.startsWith('tsconfig')
      ) {
        violations.push(`[JS-ONLY VIOLATION] TypeScript file not permitted: ${relPath}`);
      }

      // 2. No Tailwind CSS config files
      if (entry.name.startsWith('tailwind.config')) {
        violations.push(`[NO-TAILWIND VIOLATION] Tailwind config not permitted: ${relPath}`);
      }

      // 3. Forbidden dependencies in package.json
      if (entry.name === 'package.json') {
        const pkg = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
        const allDeps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
        for (const dep of Object.keys(allDeps)) {
          if (dep === 'typescript' || dep.includes('tailwindcss')) {
            violations.push(`[TECH-STACK VIOLATION] Forbidden dependency "${dep}" in ${relPath}`);
          }
        }
      }

      // 4. CSS Tailwind directive check
      if (entry.name.endsWith('.css')) {
        const css = fs.readFileSync(fullPath, 'utf8');
        if (TAILWIND_CSS_RE.test(css)) {
          violations.push(`[NO-TAILWIND VIOLATION] @tailwind directive found in ${relPath}`);
        }
      }

      // 5. Secret hygiene in code/env/config files (excluding documentation/audit prose)
      const isDocOrTest =
        relPath.startsWith('docs/') ||
        relPath.startsWith('audit/') ||
        relPath.startsWith('tests/') ||
        entry.name.endsWith('.pdf');

      if (!isDocOrTest && /\.(js|jsx|mjs|cjs|json|yml|yaml|env)$/i.test(entry.name)) {
        const text = fs.readFileSync(fullPath, 'utf8');
        if (PRIVATE_KEY_RE.test(text) || GITHUB_TOKEN_RE.test(text)) {
          violations.push(
            `[SECRET VIOLATION] Sensitive key or token pattern detected in ${relPath}`
          );
        }
      }

      // 6. Disallow committed real .env files (only .env.example permitted)
      if (
        entry.name === '.env' ||
        (entry.name.startsWith('.env.') && entry.name !== '.env.example')
      ) {
        violations.push(
          `[SECRET VIOLATION] Environment secret file present in workspace: ${relPath}`
        );
      }

      // 7. Module boundary & client isolation checks in JS/JSX source
      if (/\.(js|jsx|mjs)$/.test(entry.name) && !relPath.startsWith('tests/')) {
        const code = fs.readFileSync(fullPath, 'utf8');

        // Check cross-module internal repository/domain imports inside server/src/modules/<slug>/
        const modMatch = relPath.match(/^server\/src\/modules\/([a-z0-9-]+)\//);
        if (modMatch) {
          const owningModule = modMatch[1];
          const relDir = path.posix.dirname('/' + relPath);
          for (const match of code.matchAll(IMPORT_SPECIFIER_RE)) {
            const spec = match[1] || match[2];
            if (!spec || (!spec.startsWith('.') && !spec.includes('modules/'))) continue;
            const resolved = spec.startsWith('.')
              ? path.posix.resolve(relDir, spec)
              : '/' + spec.replace(/^.*?server\/src\//, 'server/src/');
            const targetMatch = resolved.match(
              /^\/server\/src\/modules\/([a-z0-9-]+)\/(infrastructure|domain|repositories|application)(?:\/|$)/
            );
            if (targetMatch && targetMatch[1] !== owningModule) {
              violations.push(
                `[MODULE-BOUNDARY VIOLATION] ${relPath} imports internal "${targetMatch[2]}" of module "${targetMatch[1]}" instead of its public index.js`
              );
            }
          }
        }

        // Check client isolation
        if (relPath.startsWith('client/src/')) {
          if (CLIENT_FORBIDDEN_IMPORT_RE.test(code)) {
            violations.push(
              `[CLIENT-BOUNDARY VIOLATION] ${relPath} imports forbidden server/database dependency`
            );
          }
        }
      }
    }
  }

  scanTree(repoRoot);

  return {
    passed: violations.length === 0,
    violations,
    filesScanned
  };
}

if (require.main === module) {
  const idx = process.argv.indexOf('--target');
  const customTarget = idx !== -1 ? process.argv[idx + 1] : undefined;
  const result = verifyPolicy(customTarget);

  if (!result.passed) {
    console.error(
      'Policy check FAILED with violations:\n' + result.violations.map((v) => `  - ${v}`).join('\n')
    );
    process.exit(1);
  }

  console.log(
    `[PASS] Static Policy Check: JS-only, No-Tailwind, boundaries & secret hygiene verified (${result.filesScanned} files scanned).`
  );
}

module.exports = { verifyPolicy };
