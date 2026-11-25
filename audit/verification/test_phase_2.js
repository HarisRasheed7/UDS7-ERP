/**
 * Phase 02 Automated Verification Test
 * Authority: docs/PHASES.md (Phase 02) & docs/03-ARCHITECTURE.md
 *
 * Verifies that all Phase 02 deliverables (Architecture Blueprint, ADRs 001-010,
 * 47-Module Map, Initial API & Data Contracts) exist, satisfy exit criteria,
 * cover tenant propagation, transaction/concurrency/outbox patterns, PoC spikes,
 * and uphold strict JavaScript-only & no-Tailwind constraints.
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
        console.error(`  [FAIL] ${testName}${details ? ': ' + details : ''}`);
    }
}

console.log('====================================================');
console.log('       RUNNING PHASE 02 VERIFICATION TEST SUITE     ');
console.log('====================================================\n');

// 1. Verify Architecture Blueprint
const blueprintPath = path.join(repoRoot, 'audit', 'PHASE-02-ARCHITECTURE-BLUEPRINT.md');
assert(fs.existsSync(blueprintPath), 'Phase 02 Architecture Blueprint exists');

if (fs.existsSync(blueprintPath)) {
    const bp = fs.readFileSync(blueprintPath, 'utf8');
    assert(bp.includes('Logical & Physical System Topology'), 'Blueprint defines system topology');
    assert(bp.includes('Layer Responsibilities & Dependency Direction'), 'Blueprint defines layer responsibilities');
    assert(bp.includes('Module Boundaries & Allowed Cross-Module Communication'), 'Blueprint defines module communication rules');
    assert(bp.includes('Trusted Tenant Context Propagation'), 'Blueprint defines tenant context propagation');

    // Verify all 6 propagation channels
    ['HTTP API Requests', 'Database Queries', 'Background Jobs & Outbox Events', 'File Storage & Downloads', 'Exports & Reports', 'Cache Keys'].forEach(channel => {
        assert(bp.includes(channel), `Tenant propagation covers: ${channel}`);
    });

    // Verify core architectural patterns
    ['Transaction Boundaries', 'Idempotency Pattern', 'Concurrency Control Strategy', 'Transactional Outbox Pattern', 'Error Handling'].forEach(pattern => {
        assert(bp.includes(pattern), `Blueprint defines pattern: ${pattern}`);
    });

    // Verify PoC Spikes
    ['SPIKE-01', 'SPIKE-02', 'SPIKE-03', 'SPIKE-04'].forEach(spike => {
        assert(bp.includes(spike), `Blueprint identifies PoC spike: ${spike}`);
    });
}

// 2. Verify all 10 ADRs exist and have required structure
const expectedAdrs = [
    'ADR-001-governance-and-specs.md',
    'ADR-002-frontend-stack-and-styling.md',
    'ADR-003-backend-modular-monolith.md',
    'ADR-004-postgresql-data-access-and-precision.md',
    'ADR-005-multi-tenancy-isolation.md',
    'ADR-006-auth-sessions-and-authorization.md',
    'ADR-007-transactions-immutability-concurrency-outbox.md',
    'ADR-008-infrastructure-jobs-cache-storage.md',
    'ADR-009-observability-audit-and-errors.md',
    'ADR-010-testing-and-quality-gates.md'
];

expectedAdrs.forEach(adrFile => {
    const p = path.join(repoRoot, 'audit', 'adr', adrFile);
    const exists = fs.existsSync(p);
    assert(exists, `ADR file exists: ${adrFile}`);
    if (exists) {
        const content = fs.readFileSync(p, 'utf8');
        const hasSections =
            content.includes('## Context') &&
            content.includes('## Decision') &&
            content.includes('## Consequences') &&
            content.includes('Status:');
        assert(hasSections, `ADR has required sections (Status, Context, Decision, Consequences): ${adrFile}`);
    }
});

// 3. Verify Complete 47-Module Map
const moduleMapPath = path.join(repoRoot, 'audit', 'PHASE-02-MODULE-MAP.md');
assert(fs.existsSync(moduleMapPath), 'Phase 02 Module Map exists');

if (fs.existsSync(moduleMapPath)) {
    const mm = fs.readFileSync(moduleMapPath, 'utf8');
    let missingModules = [];
    for (let i = 1; i <= 47; i++) {
        const num = String(i).padStart(2, '0');
        const regex = new RegExp(`^\\|\\s*${num}\\s*\\|`, 'm');
        if (!regex.test(mm)) {
            missingModules.push(num);
        }
    }
    assert(missingModules.length === 0, 'Module Map accounts for all 47 modules (01-47)', missingModules.join(', '));
    assert(mm.includes('Downward Dependency Only'), 'Module Map defines dependency direction rules');
}

// 4. Verify Initial API & Data Contracts
const contractsPath = path.join(repoRoot, 'audit', 'PHASE-02-API-DATA-CONTRACTS.md');
assert(fs.existsSync(contractsPath), 'Phase 02 Initial API & Data Contracts exists');

if (fs.existsSync(contractsPath)) {
    const c = fs.readFileSync(contractsPath, 'utf8');
    assert(c.includes('/api/v1'), 'Contracts define versioned /api/v1 base path');
    assert(c.includes('Idempotency-Key') && c.includes('X-Correlation-ID'), 'Contracts define Idempotency and Correlation headers');
    assert(c.includes('NUMERIC(20, 4)'), 'Contracts enforce NUMERIC(20, 4) precision (no floats)');
    assert(c.includes('ENABLE ROW LEVEL SECURITY'), 'Contracts define PostgreSQL RLS isolation policy');
    assert(c.includes('organization_id'), 'Contracts enforce canonical organization_id column');
    assert(c.includes('module.resource.action'), 'Contracts standardize dot-notation permissions');
    assert(c.includes('trg_audit_logs_immutable'), 'Contracts define immutable audit_logs trigger');
}

// 5. Verify Technology Prohibitions (No TypeScript, No Tailwind CSS)
function scanForForbidden(dir) {
    let forbidden = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        if (['.git', 'node_modules', '.next', 'dist', 'build', '.gemini'].includes(entry.name)) continue;
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            forbidden = forbidden.concat(scanForForbidden(full));
        } else {
            if (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx') || entry.name.includes('tsconfig')) {
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
assert(forbiddenItems.length === 0, 'Codebase maintains zero TypeScript and zero Tailwind CSS', forbiddenItems.join(', '));

console.log('\n====================================================');
console.log(`TOTAL CHECKS: ${totalTests} | PASSED: ${passedTests} | FAILED: ${failedTests}`);
console.log('====================================================');

if (failedTests > 0) {
    process.exit(1);
} else {
    console.log('\n PHASE 02 ARCHITECTURE & ADR VERIFICATION PASSED!\n');
    process.exit(0);
}
