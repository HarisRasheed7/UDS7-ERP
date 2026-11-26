/**
 * Phase 04 Automated Verification Test
 * Authority: docs/PHASES.md (Phase 04), docs/20-TESTING-QA.md & docs/21-DEPLOYMENT-DEVOPS.md
 *
 * Verifies CI workflow configuration, PR/issue governance templates, quality-gate
 * policy documentation, fast vs full verification commands, migration checks, and
 * confirms intentional policy violations actually fail blocking gates.
 */

'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const { verifyPolicy } = require('../../scripts/testing/verify-policy');
const { checkMigrations } = require('../../scripts/testing/check-migrations');

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
console.log('       RUNNING PHASE 04 CI & QUALITY GATE SUITE     ');
console.log('====================================================\n');

// 1. Verify .github/ structure & CI pipeline
const ciPath = path.join(repoRoot, '.github', 'workflows', 'ci.yml');
assert(fs.existsSync(ciPath), 'GitHub Actions CI workflow exists (.github/workflows/ci.yml)');

if (fs.existsSync(ciPath)) {
  const ci = fs.readFileSync(ciPath, 'utf8');
  assert(ci.includes('fast-gates:') && ci.includes('full-verification:'), 'CI defines separate fast and full jobs');
  assert(ci.includes('npm run verify:fast'), 'CI runs verify:fast gate');
  assert(ci.includes('npm run verify:full'), 'CI runs verify:full gate');
  assert(ci.includes('npm run audit:deps'), 'CI runs dependency security audit');
  assert(ci.includes('actions/upload-artifact'), 'CI uploads retained test reports');
  assert(ci.includes('retention-days: 14'), 'CI specifies 14-day test report retention');
  assert(ci.includes('contents: read'), 'CI specifies least-privilege permissions');
  assert(!ci.includes('continue-on-error: true'), 'CI does not allow silent failure bypass via continue-on-error');
}

// 2. Verify PR/Issue Templates & CODEOWNERS
const governanceFiles = [
  '.github/pull_request_template.md',
  '.github/ISSUE_TEMPLATE/bug_report.md',
  '.github/ISSUE_TEMPLATE/feature_request.md',
  '.github/CODEOWNERS',
  'config/ci/quality-gate-policy.md'
];
governanceFiles.forEach((rel) => {
  assert(fs.existsSync(path.join(repoRoot, rel)), `Governance file exists: ${rel}`);
});

// 3. Verify package.json fast/full/migration/audit scripts
const pkg = JSON.parse(fs.readFileSync(path.join(repoRoot, 'package.json'), 'utf8'));
['verify:fast', 'verify:full', 'migrations:check', 'audit:deps', 'policy:check'].forEach((s) => {
  assert(Boolean(pkg.scripts && pkg.scripts[s]), `package.json defines CI script: ${s}`);
});

// 4. Verify baseline passes static policy & migration checks
const baselinePolicy = verifyPolicy(repoRoot);
assert(baselinePolicy.passed, 'Clean repository passes static policy check', baselinePolicy.violations.join('; '));

const baselineMigrations = checkMigrations(repoRoot);
assert(baselineMigrations.passed, 'Clean repository passes migration integrity check', baselineMigrations.violations.join('; '));

// 5. Prove an intentional failing check blocks the gate (Exit criterion of Phase 04)
const tmpFailDir = fs.mkdtempSync(path.join(os.tmpdir(), 'phase4-neg-'));
try {
  fs.mkdirSync(path.join(tmpFailDir, 'database', 'migrations'), { recursive: true });
  fs.writeFileSync(path.join(tmpFailDir, 'bad.ts'), 'const bad: string = "fail";\n');
  fs.writeFileSync(path.join(tmpFailDir, 'database', 'migrations', '0005_bad.sql'), 'CREATE TABLE t (x FLOAT);\n');

  const negPolicy = verifyPolicy(tmpFailDir);
  assert(negPolicy.passed === false, 'Intentional TypeScript violation is caught and blocked by verifyPolicy');

  const negMigration = checkMigrations(tmpFailDir);
  assert(negMigration.passed === false, 'Intentional migration sequence gap is caught and blocked by checkMigrations');
} finally {
  fs.rmSync(tmpFailDir, { recursive: true, force: true });
}

console.log('\n====================================================');
console.log(`TOTAL CHECKS: ${totalTests} | PASSED: ${passedTests} | FAILED: ${failedTests}`);
console.log('====================================================');

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log('\n PHASE 04 CI & QUALITY GATES VERIFICATION PASSED!\n');
  process.exit(0);
}
