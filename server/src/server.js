'use strict';

const { loadServerConfig } = require('./config/environment');
const { createDbPool, checkDatabaseHealth, closeDbPool } = require('./database');
const { createServerApp } = require('./app');

async function startServer() {
  const config = loadServerConfig();

  let dbPool = null;
  if (config.DATABASE_URL && !config.DATABASE_URL.includes('CHANGE_ME')) {
    dbPool = createDbPool(config);
  }

  const app = createServerApp({
    config,
    checkDatabase: dbPool ? () => checkDatabaseHealth(dbPool) : undefined
  });

  app.addHook('onClose', async () => {
    await closeDbPool(dbPool);
  });

  try {
    await app.listen({
      host: config.APP_HOST,
      port: config.APP_PORT
    });
  } catch (error) {
    app.log.error(error, 'Failed to start ERP platform server');
    await closeDbPool(dbPool);
    process.exit(1);
  }
}

if (require.main === module) {
  startServer();
}

module.exports = { startServer };
