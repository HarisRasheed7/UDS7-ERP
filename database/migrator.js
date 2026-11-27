'use strict';

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const UP_FILE_RE = /^(\d{4}_[a-z0-9_]+)\.sql$/;

/**
 * Computes deterministic SHA-256 checksum of normalized SQL migration content.
 * @param {string} sql
 * @returns {string}
 */
function computeChecksum(sql) {
  return crypto.createHash('sha256').update(sql.replace(/\r\n/g, '\n')).digest('hex');
}

/**
 * Ensures migration history tracking table exists in PostgreSQL.
 * @param {import('pg').Pool | import('pg').PoolClient} db
 */
async function ensureMigrationsTable(db) {
  await db.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version VARCHAR(255) PRIMARY KEY,
      filename VARCHAR(255) NOT NULL,
      checksum VARCHAR(64) NOT NULL,
      executed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
}

/**
 * Lists ordered forward SQL migration files in migrationsDir.
 * @param {string} migrationsDir
 * @returns {Array<{ version: string, filename: string, fullPath: string, downPath: string | null }>}
 */
function discoverMigrations(migrationsDir) {
  if (!fs.existsSync(migrationsDir)) {
    throw new Error(`Migrations directory not found: ${migrationsDir}`);
  }

  return fs
    .readdirSync(migrationsDir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && UP_FILE_RE.test(entry.name))
    .map((entry) => {
      const version = entry.name.replace(/\.sql$/, '');
      const downFilename = `${version}.down.sql`;
      const downPath = path.join(migrationsDir, downFilename);
      return {
        version,
        filename: entry.name,
        fullPath: path.join(migrationsDir, entry.name),
        downPath: fs.existsSync(downPath) ? downPath : null
      };
    })
    .sort((a, b) => a.version.localeCompare(b.version));
}

/**
 * Runs all pending forward SQL migrations atomically and validates checksums
 * of previously applied migrations to enforce migration immutability.
 * @param {import('pg').Pool} pool
 * @param {string} [migrationsDir]
 * @returns {Promise<{ applied: string[], alreadyApplied: string[] }>}
 */
async function migrateUp(pool, migrationsDir = path.join(__dirname, 'migrations')) {
  await ensureMigrationsTable(pool);

  const migrations = discoverMigrations(migrationsDir);
  const existingRes = await pool.query(
    'SELECT version, checksum FROM schema_migrations ORDER BY version ASC'
  );
  const appliedMap = new Map(existingRes.rows.map((r) => [r.version, r.checksum]));

  const applied = [];
  const alreadyApplied = [];

  for (const mig of migrations) {
    const sql = fs.readFileSync(mig.fullPath, 'utf8');
    const checksum = computeChecksum(sql);

    if (appliedMap.has(mig.version)) {
      if (appliedMap.get(mig.version) !== checksum) {
        throw new Error(
          `Migration checksum mismatch for already-applied version "${mig.version}". Applied migrations must never be silently edited.`
        );
      }
      alreadyApplied.push(mig.version);
      continue;
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query(sql);
      await client.query(
        'INSERT INTO schema_migrations (version, filename, checksum) VALUES ($1, $2, $3)',
        [mig.version, mig.filename, checksum]
      );
      await client.query('COMMIT');
      applied.push(mig.version);
    } catch (err) {
      try {
        await client.query('ROLLBACK');
      } catch {
        // Ignore rollback failure on dead socket
      }
      throw new Error(`Migration failed at ${mig.filename}: ${err.message}`, { cause: err });
    } finally {
      client.release();
    }
  }

  return { applied, alreadyApplied };
}

/**
 * Rolls back the most recently applied migration using its paired .down.sql file.
 * @param {import('pg').Pool} pool
 * @param {string} [migrationsDir]
 * @returns {Promise<{ rolledBack: string | null }>}
 */
async function migrateDownLast(pool, migrationsDir = path.join(__dirname, 'migrations')) {
  await ensureMigrationsTable(pool);

  const lastRes = await pool.query(
    'SELECT version FROM schema_migrations ORDER BY version DESC LIMIT 1'
  );
  if (lastRes.rows.length === 0) {
    return { rolledBack: null };
  }

  const version = lastRes.rows[0].version;
  const downPath = path.join(migrationsDir, `${version}.down.sql`);
  if (!fs.existsSync(downPath)) {
    throw new Error(`Rollback script missing for migration "${version}": ${downPath}`);
  }

  const downSql = fs.readFileSync(downPath, 'utf8');
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(downSql);
    await client.query('DELETE FROM schema_migrations WHERE version = $1', [version]);
    await client.query('COMMIT');
    return { rolledBack: version };
  } catch (err) {
    try {
      await client.query('ROLLBACK');
    } catch {
      // Ignore rollback failure on dead socket
    }
    throw new Error(`Rollback failed for ${version}: ${err.message}`, { cause: err });
  } finally {
    client.release();
  }
}

/**
 * Returns current migration status comparing filesystem migrations vs schema_migrations table.
 * @param {import('pg').Pool} pool
 * @param {string} [migrationsDir]
 */
async function getMigrationStatus(pool, migrationsDir = path.join(__dirname, 'migrations')) {
  await ensureMigrationsTable(pool);
  const discovered = discoverMigrations(migrationsDir);
  const res = await pool.query(
    'SELECT version, checksum, executed_at FROM schema_migrations ORDER BY version ASC'
  );
  const applied = new Map(res.rows.map((r) => [r.version, r]));

  return discovered.map((m) => ({
    version: m.version,
    filename: m.filename,
    hasDownScript: Boolean(m.downPath),
    status: applied.has(m.version) ? 'APPLIED' : 'PENDING',
    executedAt: applied.has(m.version) ? applied.get(m.version).executed_at : null
  }));
}

module.exports = {
  computeChecksum,
  ensureMigrationsTable,
  discoverMigrations,
  migrateUp,
  migrateDownLast,
  getMigrationStatus
};
