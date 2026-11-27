'use strict';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const TRANSIENT_PG_CODES = new Set(['40P01', '40001']);

/**
 * Executes a callback inside an atomic PostgreSQL transaction.
 * Automatically commits on success and rolls back on any error.
 * @param {import('pg').Pool} pool
 * @param {(client: import('pg').PoolClient) => Promise<any>} fn
 * @returns {Promise<any>}
 */
async function withTransaction(pool, fn) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await fn(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    try {
      await client.query('ROLLBACK');
    } catch {
      // Preserve original error if ROLLBACK fails due to dropped connection
    }
    throw err;
  } finally {
    client.release();
  }
}

/**
 * Executes a callback inside an isolated tenant-scoped PostgreSQL transaction.
 * Sets transaction-local RLS context (`SET LOCAL app.current_organization_id`) and
 * drops privileges to non-superuser `erp_app_runtime` role so PostgreSQL RLS
 * is strictly enforced even on pooled connections.
 *
 * Fails closed immediately if tenantContext.organizationId is missing or invalid.
 *
 * @param {import('pg').Pool} pool
 * @param {{ organizationId: string }} tenantContext
 * @param {(client: import('pg').PoolClient) => Promise<any>} fn
 * @returns {Promise<any>}
 */
async function withTenantTransaction(pool, tenantContext, fn) {
  const organizationId = tenantContext && tenantContext.organizationId;
  if (typeof organizationId !== 'string' || !UUID_RE.test(organizationId)) {
    const err = new Error('Valid organizationId UUID is required in tenantContext.');
    err.statusCode = 403;
    err.code = 'FORBIDDEN';
    throw err;
  }

  return withTransaction(pool, async (client) => {
    // Drop superuser/BYPASSRLS for this transaction so PostgreSQL RLS is enforced
    await client.query('SET LOCAL ROLE erp_app_runtime');
    // Transaction-local setting automatically clears on COMMIT/ROLLBACK (pool-safe)
    await client.query("SELECT set_config('app.current_organization_id', $1, true)", [
      organizationId
    ]);
    return fn(client);
  });
}

/**
 * Retries transient PostgreSQL deadlock (40P01) or serialization (40001) errors
 * safely with bounded exponential backoff.
 * @param {() => Promise<any>} operation
 * @param {{ maxRetries?: number, baseDelayMs?: number }} [options]
 * @returns {Promise<any>}
 */
async function executeWithDeadlockRetry(operation, options = {}) {
  const maxRetries = options.maxRetries ?? 3;
  const baseDelayMs = options.baseDelayMs ?? 15;

  let attempt = 0;
  while (true) {
    try {
      return await operation();
    } catch (err) {
      attempt++;
      if (!TRANSIENT_PG_CODES.has(err && err.code) || attempt > maxRetries) {
        throw err;
      }
      await new Promise((resolve) => setTimeout(resolve, baseDelayMs * attempt));
    }
  }
}

module.exports = {
  withTransaction,
  withTenantTransaction,
  executeWithDeadlockRetry,
  UUID_RE
};
