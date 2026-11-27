'use strict';

const path = require('path');
const dotenv = require('dotenv');
const { parseServerEnv } = require('@platform/shared');
const { createDbPool, closeDbPool } = require('../../server/src/database/pool');
const { migrateUp, migrateDownLast, getMigrationStatus } = require('../../database/migrator');

async function runCli() {
  dotenv.config({ path: path.resolve(__dirname, '..', '..', '.env'), quiet: true });

  const command = process.argv[2] || 'up';
  const useTestDb = process.argv.includes('--test');
  const envOverrides = useTestDb ? { ...process.env, NODE_ENV: 'test' } : process.env;
  const config = parseServerEnv(envOverrides);

  const pool = createDbPool(config);
  try {
    if (command === 'up') {
      const result = await migrateUp(pool);
      console.log('[PASS] Migrations up complete:', result);
    } else if (command === 'down') {
      const result = await migrateDownLast(pool);
      console.log('[PASS] Migration rollback complete:', result);
    } else if (command === 'status') {
      const rows = await getMigrationStatus(pool);
      console.table(rows);
    } else {
      console.error(`Unknown migration command "${command}". Use: up | down | status`);
      process.exitCode = 1;
    }
  } finally {
    await closeDbPool(pool);
  }
}

runCli().catch((err) => {
  console.error('[FAIL] Migration CLI error:', err.message);
  process.exit(1);
});
