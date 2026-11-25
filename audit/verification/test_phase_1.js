/**
 * Phase 01 Automated Verification Test
 * Authority: docs/PHASES.md (Phase 01) & docs/IMPLEMENTATION-MASTER-INSTRUCTIONS.md
 *
 * Verifies that all Phase 01 deliverables (requirements catalogue, stable IDs,
 * tier classifications, cross-module data ownership contracts, and negative
 * security test specifications) are present and verified.
 */

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
    console.error(`  [FAIL] ${testName}: ${details}`);
  }
}

console.log('====================================================');
console.log('       RUNNING PHASE 01 VERIFICATION TEST SUITE     ');
console.log('====================================================\n');

// 1. Verify Phase 01 Requirements Catalogue Exists
const cataloguePath = path.join(repoRoot, 'audit', 'PHASE-01-REQUIREMENTS-CATALOGUE.md');
assert(fs.existsSync(cataloguePath), 'Phase 01 Requirements Catalogue exists');

if (fs.existsSync(cataloguePath)) {
  const text = fs.readFileSync(cataloguePath, 'utf8');

  // 2. Check Stable Requirement Identifiers across core domains
  const requiredIdentifiers = [
    'REQ-ORG-001',
    'REQ-ORG-002',
    'REQ-AUTH-001',
    'REQ-RBAC-001',
    'REQ-RBAC-002',
    'REQ-GL-001',
    'REQ-GL-002',
    'REQ-GL-003',
    'REQ-INV-001',
    'REQ-INV-002',
    'REQ-SALE-001',
    'REQ-POS-001',
    'REQ-PUR-001',
    'REQ-CUST-001',
    'REQ-WF-001',
    'REQ-SYNC-001',
    'REQ-AI-001'
  ];

  requiredIdentifiers.forEach((id) => {
    assert(text.includes(id), `Catalogue contains stable identifier: ${id}`);
  });

  // 3. Check Classification Taxonomy
  assert(text.includes('Core Foundation'), 'Taxonomy includes Core Foundation');
  assert(text.includes('Standard Operational'), 'Taxonomy includes Standard Operational');
  assert(text.includes('Advanced Enterprise'), 'Taxonomy includes Advanced Enterprise');
  assert(text.includes('Configurable'), 'Taxonomy includes Configurable tier');
  assert(text.includes('Industry-Specific'), 'Taxonomy includes Industry-Specific tier');

  // 4. Check Cross-Module Data Ownership Matrix
  assert(
    text.includes('Cross-Module Data Ownership & Contract Matrix'),
    'Catalogue defines Data Ownership Matrix'
  );
  assert(text.includes('Stock Ledger Line'), 'Matrix specifies Stock Ledger Line ownership');
  assert(
    text.includes('General Ledger Journal'),
    'Matrix specifies General Ledger Journal ownership'
  );

  // 5. Check High-Risk Negative Security Test Specifications
  assert(
    text.includes('[TEST-SEC-01] Cross-Tenant Isolation Breach Test'),
    'Negative Test: Cross-Tenant Isolation defined'
  );
  assert(
    text.includes('[TEST-SEC-02] Financial Ledger Tampering Test'),
    'Negative Test: Financial Ledger Tampering defined'
  );
  assert(
    text.includes('[TEST-SEC-03] Inventory Overselling Concurrency Test'),
    'Negative Test: Inventory Overselling Concurrency defined'
  );
  assert(
    text.includes('[TEST-SEC-04] Segregation of Duties Bypass Test'),
    'Negative Test: Segregation of Duties Bypass defined'
  );
  assert(
    text.includes('[TEST-SEC-05] Frontend Authorization Bypass Test'),
    'Negative Test: Frontend Authorization Bypass defined'
  );

  // 6. Check Open Decisions for Phase 01
  assert(text.includes('DEC-P1-01'), 'Phase 1 Open Decision DEC-P1-01 recorded');
  assert(text.includes('DEC-P1-02'), 'Phase 1 Open Decision DEC-P1-02 recorded');
  assert(text.includes('DEC-P1-03'), 'Phase 1 Open Decision DEC-P1-03 recorded');
}

// 7. Verify Technology Prohibitions (No TypeScript, No Tailwind CSS)
function scanForForbidden(dir) {
  let forbidden = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (['.git', 'node_modules', '.next', 'dist', 'build', '.gemini'].includes(entry.name))
      continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      forbidden = forbidden.concat(scanForForbidden(full));
    } else {
      if (
        entry.name.endsWith('.ts') ||
        entry.name.endsWith('.tsx') ||
        entry.name.includes('tsconfig')
      ) {
        forbidden.push(`TypeScript file: ${full}`);
      }
      if (entry.name.includes('tailwind.config')) {
        forbidden.push(`Tailwind file: ${full}`);
      }
    }
  }
  return forbidden;
}

const forbiddenItems = scanForForbidden(repoRoot);
assert(forbiddenItems.length === 0, 'Codebase maintains zero TypeScript and zero Tailwind CSS');

console.log('\n====================================================');
console.log(`TOTAL CHECKS: ${totalTests} | PASSED: ${passedTests} | FAILED: ${failedTests}`);
console.log('====================================================');

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log('\n PHASE 01 REQUIREMENTS & ACCEPTANCE MAPPING PASSED!\n');
  process.exit(0);
}
