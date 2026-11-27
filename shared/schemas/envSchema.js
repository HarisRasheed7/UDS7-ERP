'use strict';

const { z } = require('zod');

/**
 * Validated server runtime environment schema.
 * Enforces strict secret requirements outside local development/test.
 */
const serverEnvSchema = z
  .object({
    NODE_ENV: z.enum(['development', 'test', 'staging', 'production']).default('development'),
    APP_HOST: z.string().min(1).default('127.0.0.1'),
    APP_PORT: z.coerce.number().int().min(1).max(65535).default(4000),
    LOG_LEVEL: z
      .enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'])
      .default('info'),
    CORS_ALLOWED_ORIGINS: z.string().default('http://127.0.0.1:3000,http://localhost:3000'),
    DATABASE_URL: z.string().optional(),
    TEST_DATABASE_URL: z.string().optional(),
    DATABASE_APP_URL: z.string().optional(),
    TEST_DATABASE_APP_URL: z.string().optional(),
    DB_POOL_MAX: z.coerce.number().int().min(1).max(200).default(20),
    DB_IDLE_TIMEOUT_MS: z.coerce.number().int().min(1000).max(300000).default(30000),
    DB_CONNECTION_TIMEOUT_MS: z.coerce.number().int().min(500).max(60000).default(5000),
    DB_STATEMENT_TIMEOUT_MS: z.coerce.number().int().min(500).max(120000).default(15000),
    SESSION_SECRET: z
      .string()
      .min(16, 'SESSION_SECRET must be at least 16 characters')
      .default('dev-only-replace-with-secure-random-32-chars-minimum'),
    STORAGE_PROVIDER: z.enum(['local', 's3']).default('local'),
    LOCAL_STORAGE_PATH: z.string().min(1).default('./storage')
  })
  .superRefine((env, ctx) => {
    const isStrictEnv = env.NODE_ENV === 'production' || env.NODE_ENV === 'staging';
    if (isStrictEnv) {
      if (!env.DATABASE_URL || env.DATABASE_URL.includes('CHANGE_ME')) {
        ctx.addIssue({
          code: 'custom',
          path: ['DATABASE_URL'],
          message: 'DATABASE_URL must be configured with real credentials in staging/production.'
        });
      }
      if (env.SESSION_SECRET.includes('dev-only') || env.SESSION_SECRET.length < 32) {
        ctx.addIssue({
          code: 'custom',
          path: ['SESSION_SECRET'],
          message: 'SESSION_SECRET must be >= 32 non-default characters in staging/production.'
        });
      }
    }
  });

/**
 * Validated public client environment schema (no server secrets permitted).
 */
const clientEnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'staging', 'production']).default('development'),
  NEXT_PUBLIC_API_BASE_URL: z.string().url().default('http://127.0.0.1:4000/api/v1')
});

/**
 * Validates server environment variables and throws a clear diagnostic error on failure.
 * @param {Record<string, string | undefined>} rawEnv
 * @returns {object}
 */
function parseServerEnv(rawEnv) {
  const result = serverEnvSchema.safeParse(rawEnv);
  if (!result.success) {
    const formatted = result.error.issues
      .map((issue) => `${issue.path.join('.') || 'env'}: ${issue.message}`)
      .join('; ');
    throw new Error(`Invalid server environment configuration: ${formatted}`);
  }
  return Object.freeze({
    ...result.data,
    corsOriginsList: result.data.CORS_ALLOWED_ORIGINS.split(',')
      .map((origin) => origin.trim())
      .filter(Boolean)
  });
}

/**
 * Validates public client environment variables.
 * @param {Record<string, string | undefined>} rawEnv
 * @returns {object}
 */
function parseClientEnv(rawEnv) {
  const result = clientEnvSchema.safeParse(rawEnv);
  if (!result.success) {
    const formatted = result.error.issues
      .map((issue) => `${issue.path.join('.') || 'env'}: ${issue.message}`)
      .join('; ');
    throw new Error(`Invalid client environment configuration: ${formatted}`);
  }
  return Object.freeze(result.data);
}

/**
 * Selects the appropriate database URL for the active NODE_ENV.
 * @param {object} config
 * @param {{ preferAppRole?: boolean }} [options]
 * @returns {string | undefined}
 */
function resolveDatabaseUrl(config, options = {}) {
  const { preferAppRole = false } = options;
  if (config.NODE_ENV === 'test') {
    if (preferAppRole && config.TEST_DATABASE_APP_URL) {
      return config.TEST_DATABASE_APP_URL;
    }
    return config.TEST_DATABASE_URL;
  }
  if (preferAppRole && config.DATABASE_APP_URL && !config.DATABASE_APP_URL.includes('CHANGE_ME')) {
    return config.DATABASE_APP_URL;
  }
  return config.DATABASE_URL;
}

module.exports = {
  serverEnvSchema,
  clientEnvSchema,
  parseServerEnv,
  parseClientEnv,
  resolveDatabaseUrl
};
