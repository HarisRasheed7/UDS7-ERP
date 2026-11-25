'use strict';

const { parseServerEnv, parseClientEnv } = require('../../../shared');

describe('shared/schemas/envSchema', () => {
  it('applies safe local defaults in development mode', () => {
    const config = parseServerEnv({ NODE_ENV: 'development' });
    expect(config.NODE_ENV).toBe('development');
    expect(config.APP_PORT).toBe(4000);
    expect(config.STORAGE_PROVIDER).toBe('local');
    expect(config.corsOriginsList).toContain('http://localhost:3000');
  });

  it('rejects default placeholder secrets in production mode', () => {
    expect(() =>
      parseServerEnv({
        NODE_ENV: 'production',
        DATABASE_URL: 'postgresql://postgres:CHANGE_ME_LOCAL_ONLY@127.0.0.1:5432/db',
        SESSION_SECRET: 'dev-only-replace-with-secure-random-32-chars-minimum'
      })
    ).toThrow(/Invalid server environment configuration/);
  });

  it('accepts strong credentials in production mode', () => {
    const config = parseServerEnv({
      NODE_ENV: 'production',
      DATABASE_URL: 'postgresql://erp_user:real_strong_pw@db.internal:5432/erp_prod',
      SESSION_SECRET: 'a_very_strong_random_production_secret_over_32_chars'
    });
    expect(config.NODE_ENV).toBe('production');
    expect(config.STORAGE_PROVIDER).toBe('local');
  });

  it('validates client public env and rejects malformed API URLs', () => {
    expect(() =>
      parseClientEnv({
        NODE_ENV: 'development',
        NEXT_PUBLIC_API_BASE_URL: 'not-a-valid-url'
      })
    ).toThrow(/Invalid client environment configuration/);
  });
});
