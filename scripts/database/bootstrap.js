'use strict';

const path = require('path');
const dotenv = require('dotenv');
const { Client } = require('pg');

const VALID_DB_NAME_RE = /^[a-z][a-z0-9_]{1,62}$/;

/**
 * Extracts target database name and admin connection URL pointing to maintenance 'postgres' DB.
 * Never logs credentials.
 * @param {string} targetUrl
 */
function parseTargetUrl(targetUrl) {
  const parsed = new URL(targetUrl);
  const dbName = parsed.pathname.replace(/^\//, '');
  if (!VALID_DB_NAME_RE.test(dbName)) {
    throw new Error(`Invalid PostgreSQL database identifier "${dbName}".`);
  }
  parsed.pathname = '/postgres';
  return { dbName, adminConnectionString: parsed.toString() };
}

/**
 * Ensures target PostgreSQL databases exist on the local/configured server.
 * @param {string[]} urls
 * @returns {Promise<{ created: string[], existing: string[] }>}
 */
async function ensureDatabasesExist(urls) {
  const validUrls = urls.filter(
    (u) => typeof u === 'string' && u.length > 0 && !u.includes('CHANGE_ME')
  );
  if (validUrls.length === 0) {
    throw new Error('No valid DATABASE_URL / TEST_DATABASE_URL configured.');
  }

  const created = [];
  const existing = [];

  for (const rawUrl of validUrls) {
    const { dbName, adminConnectionString } = parseTargetUrl(rawUrl);
    const client = new Client({
      connectionString: adminConnectionString,
      connectionTimeoutMillis: 5000
    });
    await client.connect();
    try {
      const check = await client.query('SELECT 1 FROM pg_database WHERE datname = $1', [dbName]);
      if (check.rows.length > 0) {
        existing.push(dbName);
      } else {
        await client.query(`CREATE DATABASE "${dbName}"`);
        created.push(dbName);
      }
    } finally {
      await client.end();
    }
  }

  return { created, existing };
}

if (require.main === module) {
  dotenv.config({ path: path.resolve(__dirname, '..', '..', '.env'), quiet: true });
  const targets = [process.env.DATABASE_URL, process.env.TEST_DATABASE_URL].filter(Boolean);

  ensureDatabasesExist(targets)
    .then((res) => {
      console.log('[PASS] Database bootstrap complete.', res);
      process.exit(0);
    })
    .catch((err) => {
      console.error('[FAIL] Database bootstrap error:', err.code || err.message);
      process.exit(1);
    });
}

module.exports = { ensureDatabasesExist, parseTargetUrl };
