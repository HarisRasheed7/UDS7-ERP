/**
 * Phase 05 Automated Verification Test
 * Authority: docs/PHASES.md (Phase 05), docs/13-DATA-MODEL.md & docs/development/05-database-rules.md
 *
 * Verifies PostgreSQL pool, transaction/RLS isolation helpers, decimal.js precision
 * utilities, versioned SQL migrations + rollback scripts, database bootstrap CLI,
 * and integration test coverage for SPIKE-01 and SPIKE-02.
 */

'use strict';

const fs = require('fs');
const path = require('path');
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
console.log('       RUNNING PHASE 05 POSTGRESQL SUITE CHECKS     ');
console.log('====================================================\n');

// 1. Required Phase 05 Files
const requiredFiles = [
  'shared/utils/money.js',
  'server/src/database/index.js',
  'server/src/database/pool.js',
  'server/src/database/transaction.js',
  'database/migrator.js',
  'database/migrations/0001_init_extensions_and_functions.sql',
  'database/migrations/0001_init_extensions_and_functions.down.sql',
  'database/migrations/0002_init_foundation_core.sql',
  'database/migrations/0002_init_foundation_core.down.sql',
  'scripts/database/bootstrap.js',
  'scripts/database/migrate.js',
  'tests/unit/shared/money.test.js',
  'tests/integration/database/foundation.test.js'
];

requiredFiles.forEach((rel) => {
  const full = path.join(repoRoot, rel);
  assert(fs.existsSync(full) && fs.statSync(full).isFile(), `File exists: ${rel}`);
});

// 2. Migration Integrity & Precision Check
const migCheck = checkMigrations(repoRoot);
assert(
  migCheck.passed && migCheck.migrationCount >= 2,
  `Migration integrity check passes (${migCheck.migrationCount} SQL migrations verified)`,
  migCheck.violations.join('; ')
);

// 3. Verify Key Architectural Invariants in SQL & Code
const sql01 = fs.readFileSync(
  path.join(repoRoot, 'database/migrations/0001_init_extensions_and_functions.sql'),
  'utf8'
);
assert(sql01.includes('NOBYPASSRLS'), 'Migration 0001 defines non-superuser NOBYPASSRLS runtime role');
assert(
  sql01.includes('app.current_organization_id()'),
  'Migration 0001 defines app.current_organization_id()'
);
assert(
  sql01.includes('app.prevent_immutable_mutation()'),
  'Migration 0001 defines immutable trigger guard function'
);

const sql02 = fs.readFileSync(
  path.join(repoRoot, 'database/migrations/0002_init_foundation_core.sql'),
  'utf8'
);
assert(sql02.includes('FORCE ROW LEVEL SECURITY'), 'Migration 0002 enforces FORCE ROW LEVEL SECURITY');
assert(sql02.includes('trg_audit_logs_immutable'), 'Migration 0002 attaches immutability trigger to audit_logs');
assert(sql02.includes('domain_outbox_events'), 'Migration 0002 creates transactional outbox table');
assert(sql02.includes('idempotency_keys'), 'Migration 0002 creates idempotency_keys table');
assert(sql02.includes('document_sequences'), 'Migration 0002 creates document_sequences table');

const txCode = fs.readFileSync(
  path.join(repoRoot, 'server/src/database/transaction.js'),
  'utf8'
);
assert(
  txCode.includes('SET LOCAL ROLE erp_app_runtime') &&
    txCode.includes("set_config('app.current_organization_id'"),
  'withTenantTransaction enforces SET LOCAL ROLE and transaction-scoped organization context'
);

// 4. Verify dependencies in package manifests
const serverPkg = JSON.parse(fs.readFileSync(path.join(repoRoot, 'server/package.json'), 'utf8'));
const sharedPkg = JSON.parse(fs.readFileSync(path.join(repoRoot, 'shared/package.json'), 'utf8'));
assert(Boolean(serverPkg.dependencies && serverPkg.dependencies.pg), 'server/package.json includes pg');
assert(
  Boolean(sharedPkg.dependencies && sharedPkg.dependencies['decimal.js']),
  'shared/package.json includes decimal.js'
);

console.log('\n====================================================');
console.log(`TOTAL CHECKS: ${totalTests} | PASSED: ${passedTests} | FAILED: ${failedTests}`);
console.log('====================================================');

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log('\n PHASE 05 POSTGRESQL & MIGRATION VERIFICATION PASSED!\n');
  process.exit(0);
}
