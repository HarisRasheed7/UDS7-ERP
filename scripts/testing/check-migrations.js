'use strict';

const fs = require('fs');
const path = require('path');

const MIGRATION_FILE_RE = /^(\d{4})_[a-z0-9_]+\.sql$/;
const FLOAT_MONEY_RE =
  /\b(amount|price|cost|total|balance|debit|credit|tax|discount|salary|rate|quantity)\b[^\n;]*\b(REAL|FLOAT|DOUBLE PRECISION)\b/i;

/**
 * Validates database/migrations directory structure, sequential numbering,
 * and rejects floating-point SQL types on monetary/quantity columns.
 * @param {string} [targetRoot]
 * @returns {{ passed: boolean, violations: string[], migrationCount: number }}
 */
function checkMigrations(targetRoot) {
  const repoRoot = path.resolve(targetRoot || path.join(__dirname, '..', '..'));
  const migrationsDir = path.join(repoRoot, 'database', 'migrations');
  const violations = [];

  if (!fs.existsSync(migrationsDir)) {
    violations.push('Missing authoritative database/migrations directory.');
    return { passed: false, violations, migrationCount: 0 };
  }

  const entries = fs
    .readdirSync(migrationsDir, { withFileTypes: true })
    .filter((e) => e.isFile() && e.name !== '.gitkeep')
    .map((e) => e.name)
    .sort();

  let expectedSeq = 1;
  for (const fileName of entries) {
    // Allow optional paired rollback scripts like 0001_init.down.sql
    if (fileName.endsWith('.down.sql')) {
      const baseUp = fileName.replace(/\.down\.sql$/, '.sql');
      if (!entries.includes(baseUp)) {
        violations.push(
          `[MIGRATION VIOLATION] Orphan rollback script without up migration: ${fileName}`
        );
      }
      continue;
    }

    const match = fileName.match(MIGRATION_FILE_RE);
    if (!match) {
      violations.push(
        `[MIGRATION VIOLATION] Invalid migration filename "${fileName}". Expected NNNN_snake_case.sql`
      );
      continue;
    }

    const seqNum = parseInt(match[1], 10);
    if (seqNum !== expectedSeq) {
      violations.push(
        `[MIGRATION VIOLATION] Non-sequential migration number in "${fileName}". Expected ${String(expectedSeq).padStart(4, '0')}.`
      );
    }
    expectedSeq = seqNum + 1;

    const sql = fs.readFileSync(path.join(migrationsDir, fileName), 'utf8');
    if (sql.trim().length === 0) {
      violations.push(`[MIGRATION VIOLATION] Empty SQL migration file: ${fileName}`);
    }
    if (FLOAT_MONEY_RE.test(sql)) {
      violations.push(
        `[PRECISION VIOLATION] Floating-point type (REAL/FLOAT/DOUBLE) forbidden on money/quantity column in ${fileName}; use NUMERIC(20, 4).`
      );
    }
  }

  return {
    passed: violations.length === 0,
    violations,
    migrationCount: entries.filter((f) => !f.endsWith('.down.sql')).length
  };
}

if (require.main === module) {
  const idx = process.argv.indexOf('--target');
  const customTarget = idx !== -1 ? process.argv[idx + 1] : undefined;
  const result = checkMigrations(customTarget);

  if (!result.passed) {
    console.error(
      'Migration check FAILED:\n' + result.violations.map((v) => `  - ${v}`).join('\n')
    );
    process.exit(1);
  }

  console.log(
    `[PASS] Migration Integrity Check passed (${result.migrationCount} SQL migration(s) verified).`
  );
}

module.exports = { checkMigrations };
