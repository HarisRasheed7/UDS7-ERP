'use strict';

const { loadServerConfig } = require('./config/environment');
const { createServerApp } = require('./app');

async function startServer() {
  const config = loadServerConfig();
  const app = createServerApp({ config });

  try {
    await app.listen({
      host: config.APP_HOST,
      port: config.APP_PORT
    });
  } catch (error) {
    app.log.error(error, 'Failed to start ERP platform server');
    process.exit(1);
  }
}

if (require.main === module) {
  startServer();
}

module.exports = { startServer };
