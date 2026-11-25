'use strict';

const crypto = require('crypto');
const Fastify = require('fastify');
const cors = require('@fastify/cors');
const helmet = require('@fastify/helmet');
const { HTTP_STATUS, ERROR_CODES } = require('@platform/shared');
const { loadServerConfig } = require('./config/environment');
const { registerHealthRoutes } = require('./api/routes/health.routes');

/**
 * Creates and configures the Fastify modular monolith HTTP server instance
 * without binding a listening port (enabling deterministic API integration tests).
 * @param {{ config?: object, logger?: boolean | object, checkDatabase?: Function }} [options]
 * @returns {import('fastify').FastifyInstance}
 */
function createServerApp(options = {}) {
  const config = options.config || loadServerConfig();

  const loggerOption =
    options.logger !== undefined
      ? options.logger
      : {
          level: config.NODE_ENV === 'test' ? 'silent' : config.LOG_LEVEL,
          redact: {
            paths: [
              'req.headers.authorization',
              'req.headers.cookie',
              '*.password',
              '*.passwordHash',
              '*.token',
              '*.secret'
            ],
            censor: '[REDACTED]'
          }
        };

  const app = Fastify({
    logger: loggerOption,
    genReqId(req) {
      const incoming = req.headers['x-request-id'];
      if (typeof incoming === 'string' && incoming.trim().length > 0 && incoming.length <= 128) {
        return incoming.trim();
      }
      return `req_${crypto.randomUUID()}`;
    }
  });

  app.register(helmet, { contentSecurityPolicy: false });
  app.register(cors, {
    origin: config.corsOriginsList,
    credentials: true
  });

  app.addHook('onRequest', async (request, reply) => {
    const incomingCorrelation = request.headers['x-correlation-id'];
    const correlationId =
      typeof incomingCorrelation === 'string' && incomingCorrelation.trim().length > 0
        ? incomingCorrelation.trim()
        : `corr_${crypto.randomUUID()}`;

    request.correlationId = correlationId;
    reply.header('X-Request-ID', request.id);
    reply.header('X-Correlation-ID', correlationId);
  });

  app.setNotFoundHandler((request, reply) => {
    return reply.code(HTTP_STATUS.NOT_FOUND).send({
      success: false,
      error: {
        code: ERROR_CODES.NOT_FOUND,
        message: 'The requested API resource was not found.',
        details: []
      },
      requestId: request.id
    });
  });

  app.setErrorHandler((error, request, reply) => {
    request.log.error(
      { err: error, correlationId: request.correlationId },
      'Unhandled request error'
    );
    const statusCode =
      typeof error.statusCode === 'number' && error.statusCode >= 400 && error.statusCode < 600
        ? error.statusCode
        : HTTP_STATUS.INTERNAL_SERVER_ERROR;

    const isServerError = statusCode >= 500;
    return reply.code(statusCode).send({
      success: false,
      error: {
        code:
          error.code || (isServerError ? ERROR_CODES.INTERNAL_ERROR : ERROR_CODES.VALIDATION_ERROR),
        message: isServerError ? 'An internal server error occurred.' : error.message,
        details: []
      },
      requestId: request.id
    });
  });

  app.register(
    async (v1) => {
      await registerHealthRoutes(v1, { config, checkDatabase: options.checkDatabase });
    },
    { prefix: '/api/v1' }
  );

  return app;
}

module.exports = { createServerApp };
