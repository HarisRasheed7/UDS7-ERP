'use strict';

const { HTTP_STATUS } = require('@platform/shared');

/**
 * Registers foundational platform health and readiness endpoints under /api/v1.
 * Readiness explicitly reports database status rather than claiming a fake DB connection
 * prior to Phase 05 PostgreSQL wiring.
 * @param {import('fastify').FastifyInstance} fastify
 * @param {{ config: object, checkDatabase?: () => Promise<{ connected: boolean, status: string }> }} options
 */
async function registerHealthRoutes(fastify, options) {
  const { config, checkDatabase } = options;

  fastify.get('/health/live', async (request, reply) => {
    return reply.code(HTTP_STATUS.OK).send({
      success: true,
      data: {
        status: 'alive',
        environment: config.NODE_ENV,
        timestamp: new Date().toISOString()
      },
      requestId: request.id
    });
  });

  fastify.get('/health/ready', async (request, reply) => {
    let databaseState = {
      configured: Boolean(config.DATABASE_URL && !config.DATABASE_URL.includes('CHANGE_ME')),
      status: 'pending_phase_05_db_foundation'
    };

    if (typeof checkDatabase === 'function') {
      const result = await checkDatabase();
      databaseState = {
        configured: true,
        status: result.status,
        connected: result.connected
      };

      if (!result.connected) {
        return reply.code(HTTP_STATUS.SERVICE_UNAVAILABLE).send({
          success: false,
          error: {
            code: 'SERVICE_UNAVAILABLE',
            message: 'Database dependency is not ready.',
            details: [databaseState]
          },
          requestId: request.id
        });
      }
    }

    return reply.code(HTTP_STATUS.OK).send({
      success: true,
      data: {
        status: 'ready',
        environment: config.NODE_ENV,
        database: databaseState,
        timestamp: new Date().toISOString()
      },
      requestId: request.id
    });
  });
}

module.exports = { registerHealthRoutes };
