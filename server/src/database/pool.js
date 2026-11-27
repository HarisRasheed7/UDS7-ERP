'use strict';

const { Pool } = require('pg');
const { resolveDatabaseUrl } = require('@platform/shared');

/**
 * Creates a bounded node-postgres connection pool with statement timeout protection.
 * Never logs raw connection strings or credentials.
 * @param {object} config
 * @param {{ connectionString?: string, logger?: object, preferAppRole?: boolean }} [options]
 * @returns {import('pg').Pool}
 */
function createDbPool(config, options = {}) {
  const connectionString =
    options.connectionString ||
    resolveDatabaseUrl(config, { preferAppRole: Boolean(options.preferAppRole) });

  if (!connectionString || connectionString.includes('CHANGE_ME')) {
    throw new Error(
      `Database connection string is missing or uses a placeholder for NODE_ENV=${config.NODE_ENV}.`
    );
  }

  const statementTimeoutMs = config.DB_STATEMENT_TIMEOUT_MS || 15000;
  const pool = new Pool({
    connectionString,
    max: config.DB_POOL_MAX || 20,
    idleTimeoutMillis: config.DB_IDLE_TIMEOUT_MS || 30000,
    connectionTimeoutMillis: config.DB_CONNECTION_TIMEOUT_MS || 5000,
    options: `-c statement_timeout=${statementTimeoutMs}`
  });

  pool.on('error', (err) => {
    if (options.logger && typeof options.logger.error === 'function') {
      options.logger.error(
        { code: err.code, message: err.message },
        'PostgreSQL pool idle client error'
      );
    }
  });

  return pool;
}

/**
 * Verifies PostgreSQL pool connectivity without exposing sensitive details.
 * @param {import('pg').Pool} pool
 * @returns {Promise<{ connected: boolean, status: string, latencyMs?: number }>}
 */
async function checkDatabaseHealth(pool) {
  const startedAt = Date.now();
  try {
    await pool.query('SELECT 1 AS ok');
    return {
      connected: true,
      status: 'connected',
      latencyMs: Date.now() - startedAt
    };
  } catch (err) {
    return {
      connected: false,
      status: err.code ? `unavailable:${err.code}` : 'unavailable'
    };
  }
}

/**
 * Gracefully drains and closes a pool.
 * @param {import('pg').Pool | null | undefined} pool
 */
async function closeDbPool(pool) {
  if (pool && typeof pool.end === 'function') {
    await pool.end();
  }
}

module.exports = {
  createDbPool,
  checkDatabaseHealth,
  closeDbPool
};
