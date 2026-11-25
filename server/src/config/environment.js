'use strict';

const path = require('path');
const dotenv = require('dotenv');
const { parseServerEnv } = require('@platform/shared');

/**
 * Loads root .env (if present, never required when env vars are injected externally)
 * and returns a validated immutable server configuration object.
 * @param {Record<string, string | undefined>} [overrideEnv]
 * @returns {object}
 */
function loadServerConfig(overrideEnv) {
  if (!overrideEnv) {
    dotenv.config({ path: path.resolve(__dirname, '..', '..', '..', '.env'), quiet: true });
  }
  return parseServerEnv(overrideEnv || process.env);
}

module.exports = { loadServerConfig };
