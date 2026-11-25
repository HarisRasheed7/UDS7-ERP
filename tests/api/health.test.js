'use strict';

const { createServerApp } = require('../../server/src/app');
const { loadServerConfig } = require('../../server/src/config/environment');

describe('GET /api/v1/health/*', () => {
  const config = loadServerConfig({ NODE_ENV: 'test', APP_PORT: '4000' });
  const app = createServerApp({ config, logger: false });

  afterAll(async () => {
    await app.close();
  });

  it('returns 200 alive envelope with X-Request-ID and X-Correlation-ID on /health/live', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/v1/health/live'
    });

    expect(res.statusCode).toBe(200);
    expect(res.headers['x-request-id']).toMatch(/^req_/);
    expect(res.headers['x-correlation-id']).toMatch(/^corr_/);

    const body = res.json();
    expect(body.success).toBe(true);
    expect(body.data.status).toBe('alive');
    expect(body.data.environment).toBe('test');
  });

  it('returns explicit pending database status on /health/ready before Phase 05', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/v1/health/ready'
    });

    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body.success).toBe(true);
    expect(body.data.database.status).toBe('pending_phase_05_db_foundation');
  });

  it('returns standardized 404 error envelope for unknown routes', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/v1/nonexistent-endpoint'
    });

    expect(res.statusCode).toBe(404);
    const body = res.json();
    expect(body.success).toBe(false);
    expect(body.error.code).toBe('NOT_FOUND');
    expect(body.requestId).toBeTruthy();
  });
});
