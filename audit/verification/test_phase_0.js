/**
 * Phase 00 Automated Verification Test
 * Authority: docs/DOCUMENTATION-AUDIT.md & docs/PHASES.md
 * 
 * Verifies that all Phase 0 audit deliverables exist, repository constraints
 * (JavaScript only, no TypeScript, no Tailwind CSS) are upheld, and
 * security exclusions are active.
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
console.log('       RUNNING PHASE 00 AUDIT VERIFICATION TEST     ');
console.log('====================================================\n');

// 1. Verify Audit Deliverable Report
const auditReportPath = path.join(repoRoot, 'audit', 'PHASE-0-AUDIT-REPORT.md');
assert(fs.existsSync(auditReportPath), 'Phase 0 Audit Report exists');

if (fs.existsSync(auditReportPath)) {
    const reportText = fs.readFileSync(auditReportPath, 'utf8');
    assert(reportText.includes('Deliverable 1: Complete Repository Inventory'), 'Report contains Deliverable 1 (Repository Inventory)');
    assert(reportText.includes('Deliverable 2: Canonical-Document Recommendation'), 'Report contains Deliverable 2 (Canonical-Document Recommendation)');
    assert(reportText.includes('Deliverable 3: PRD Representation Comparison'), 'Report contains Deliverable 3 (PRD Comparison)');
    assert(reportText.includes('Deliverable 4: Documentation Health'), 'Report contains Deliverable 4 (Doc Health & Gaps)');
    assert(reportText.includes('Deliverable 5: Requirements Traceability Matrix'), 'Report contains Deliverable 5 (Traceability Matrix)');
    assert(reportText.includes('Deliverable 6: Conflict & Open-Decision Register'), 'Report contains Deliverable 6 (Open-Decision Register)');
    assert(reportText.includes('Deliverable 7: System-Wide Module Dependency Graph'), 'Report contains Deliverable 7 (Module Dependency Graph)');
    assert(reportText.includes('Deliverable 8: Technical Risk Register'), 'Report contains Deliverable 8 (Risk Register)');
    assert(reportText.includes('Deliverable 9: Proposed First Vertical Slice'), 'Report contains Deliverable 9 (First Vertical Slice)');
    assert(reportText.includes('Deliverable 10: Phase 1 Readiness Recommendation'), 'Report contains Deliverable 10 (Phase 1 Readiness)');
}

// 2. Verify Security Exclusions (.gitignore)
const gitignorePath = path.join(repoRoot, '.gitignore');
assert(fs.existsSync(gitignorePath), '.gitignore file exists at repository root');
if (fs.existsSync(gitignorePath)) {
    const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
    assert(gitignoreContent.includes('.env'), '.gitignore excludes .env files');
    assert(gitignoreContent.includes('node_modules'), '.gitignore excludes node_modules');
    assert(gitignoreContent.includes('secrets/'), '.gitignore excludes secrets/');
}

// 3. Verify Technology Prohibitions (No TypeScript, No Tailwind CSS)
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
assert(forbiddenItems.length === 0, 'No TypeScript or Tailwind CSS files exist in codebase', forbiddenItems.join(', '));

// 4. Verify Phase Tracker Exists
const trackerPath = path.join(repoRoot, 'audit', 'verification', 'PHASE-TRACKER.md');
assert(fs.existsSync(trackerPath), 'Phase Implementation Tracker exists in audit/verification/');

// 5. Verify Core Documentation Integrity
const requiredDocs = [
    'docs/00-MASTER-INSTRUCTIONS.md',
    'docs/01-PROJECT-VISION.md',
    'docs/02-PRODUCT-REQUIREMENTS.md',
    'docs/03-ARCHITECTURE.md',
    'docs/04-TECH-STACK.md',
    'docs/05-DESIGN-SYSTEM.md',
    'docs/10-MULTI-TENANCY.md',
    'docs/13-DATA-MODEL.md',
    'docs/PHASES.md',
    'docs/PRD/Master_ERP_Web_Platform_PRD_100plus_pages.md'
];

requiredDocs.forEach(docRel => {
    const p = path.join(repoRoot, docRel);
    assert(fs.existsSync(p) && fs.statSync(p).size > 1000, `Canonical doc exists and is non-empty: ${docRel}`);
});

console.log('\n====================================================');
console.log(`TOTAL CHECKS: ${totalTests} | PASSED: ${passedTests} | FAILED: ${failedTests}`);
console.log('====================================================');

if (failedTests > 0) {
    process.exit(1);
} else {
    console.log('\n PHASE 00 AUDIT VERIFICATION PASSED SUCCESSFULLY!\n');
    process.exit(0);
}
