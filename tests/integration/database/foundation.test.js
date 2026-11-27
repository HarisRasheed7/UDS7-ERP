'use strict';

const crypto = require('crypto');
const path = require('path');
const { loadServerConfig } = require('../../../server/src/config/environment');
const { createServerApp } = require('../../../server/src/app');
const {
  createDbPool,
  checkDatabaseHealth,
  closeDbPool,
  withTransaction,
  withTenantTransaction,
  executeWithDeadlockRetry
} = require('../../../server/src/database');
const { migrateUp, migrateDownLast, getMigrationStatus } = require('../../../database/migrator');
const { addMoney } = require('../../../shared');

describe('Phase 05 Live PostgreSQL Foundation, RLS (SPIKE-01) & Integrity (SPIKE-02)', () => {
  let pool;
  let tenantAId;
  let tenantBId;

  beforeAll(async () => {
    const config = loadServerConfig();
    const testConfig = loadServerConfig({
      ...process.env,
      NODE_ENV: 'test',
      DB_POOL_MAX: '5',
      TEST_DATABASE_URL: config.TEST_DATABASE_URL || process.env.TEST_DATABASE_URL
    });

    pool = createDbPool(testConfig);
    await migrateUp(pool);

    // Seed two distinct isolated test organizations for SPIKE-01 & SPIKE-02
    const suffix = crypto.randomUUID().slice(0, 8);
    await withTransaction(pool, async (client) => {
      const resA = await client.query(
        `INSERT INTO organizations (code, name, default_currency, timezone)
         VALUES ($1, $2, 'USD', 'UTC') RETURNING id`,
        [`org_a_${suffix}`, `Tenant Alpha ${suffix}`]
      );
      const resB = await client.query(
        `INSERT INTO organizations (code, name, default_currency, timezone)
         VALUES ($1, $2, 'EUR', 'Europe/Berlin') RETURNING id`,
        [`org_b_${suffix}`, `Tenant Beta ${suffix}`]
      );
      tenantAId = resA.rows[0].id;
      tenantBId = resB.rows[0].id;
    });
  });

  afterAll(async () => {
    if (pool && tenantAId && tenantBId) {
      await withTransaction(pool, async (client) => {
        await client.query('DELETE FROM document_sequences WHERE organization_id IN ($1, $2)', [
          tenantAId,
          tenantBId
        ]);
        await client.query('DELETE FROM domain_outbox_events WHERE organization_id IN ($1, $2)', [
          tenantAId,
          tenantBId
        ]);
        await client.query('DELETE FROM idempotency_keys WHERE organization_id IN ($1, $2)', [
          tenantAId,
          tenantBId
        ]);
        // audit_logs are protected by immutability trigger even for superusers; verify cleanup of orgs only if no audit rows
      }).catch(() => {});
    }
    await closeDbPool(pool);
  });

  it('verifies idempotent migrations and live health readiness endpoints', async () => {
    const secondRun = await migrateUp(pool);
    expect(secondRun.applied).toEqual([]);
    expect(secondRun.alreadyApplied).toContain('0001_init_extensions_and_functions');
    expect(secondRun.alreadyApplied).toContain('0002_init_foundation_core');

    const statusRows = await getMigrationStatus(pool);
    expect(statusRows.every((r) => r.status === 'APPLIED' && r.hasDownScript)).toBe(true);

    const config = loadServerConfig({ ...process.env, NODE_ENV: 'test' });
    const app = createServerApp({
      config,
      logger: false,
      checkDatabase: () => checkDatabaseHealth(pool)
    });

    const readyRes = await app.inject({ method: 'GET', url: '/api/v1/health/ready' });
    expect(readyRes.statusCode).toBe(200);
    expect(readyRes.json().data.database.connected).toBe(true);
    expect(readyRes.json().data.database.status).toBe('connected');
    await app.close();

    const failingApp = createServerApp({
      config,
      logger: false,
      checkDatabase: async () => ({ connected: false, status: 'unavailable:ECONNREFUSED' })
    });
    const downRes = await failingApp.inject({ method: 'GET', url: '/api/v1/health/ready' });
    expect(downRes.statusCode).toBe(503);
    expect(downRes.json().success).toBe(false);
    await failingApp.close();
  });

  it('SPIKE-01: enforces strict PostgreSQL RLS across 50 concurrent mixed-tenant pooled queries', async () => {
    // Fail-closed validation when tenantContext is missing or malformed
    await expect(withTenantTransaction(pool, {}, async () => {})).rejects.toThrow(/organizationId/);
    await expect(
      withTenantTransaction(pool, { organizationId: 'not-a-uuid' }, async () => {})
    ).rejects.toThrow(/organizationId/);

    // Insert distinct outbox events under each tenant context
    const eventAId = crypto.randomUUID();
    const eventBId = crypto.randomUUID();

    await withTenantTransaction(pool, { organizationId: tenantAId }, async (client) => {
      await client.query(
        `INSERT INTO domain_outbox_events (id, organization_id, event_type, aggregate_type, aggregate_id, payload)
         VALUES ($1, $2, 'TenantTestA', 'organization', $2, '{"tenant":"A"}'::jsonb)`,
        [eventAId, tenantAId]
      );
    });

    await withTenantTransaction(pool, { organizationId: tenantBId }, async (client) => {
      await client.query(
        `INSERT INTO domain_outbox_events (id, organization_id, event_type, aggregate_type, aggregate_id, payload)
         VALUES ($1, $2, 'TenantTestB', 'organization', $2, '{"tenant":"B"}'::jsonb)`,
        [eventBId, tenantBId]
      );
    });

    // Cross-tenant INSERT must be rejected by PostgreSQL RLS WITH CHECK policy
    await expect(
      withTenantTransaction(pool, { organizationId: tenantAId }, async (client) => {
        await client.query(
          `INSERT INTO domain_outbox_events (organization_id, event_type, aggregate_type, aggregate_id, payload)
           VALUES ($1, 'IllegalCrossTenant', 'organization', $1, '{}'::jsonb)`,
          [tenantBId]
        );
      })
    ).rejects.toThrow(/row-level security policy/);

    // Fire 50 concurrent interleaved queries sharing pool max=5 connections to prove zero SET LOCAL bleed
    const tasks = Array.from({ length: 50 }, (_, idx) => {
      const isA = idx % 2 === 0;
      const expectedOrgId = isA ? tenantAId : tenantBId;
      const forbiddenOrgId = isA ? tenantBId : tenantAId;

      return withTenantTransaction(pool, { organizationId: expectedOrgId }, async (client) => {
        const res = await client.query('SELECT id, organization_id FROM domain_outbox_events');
        expect(res.rows.length).toBeGreaterThanOrEqual(1);
        expect(res.rows.every((r) => r.organization_id === expectedOrgId)).toBe(true);
        expect(res.rows.some((r) => r.organization_id === forbiddenOrgId)).toBe(false);
        return true;
      });
    });

    const results = await Promise.all(tasks);
    expect(results).toHaveLength(50);

    // Direct runtime role query without app.current_organization_id must return zero rows
    await withTransaction(pool, async (client) => {
      await client.query('SET LOCAL ROLE erp_app_runtime');
      const leaked = await client.query('SELECT id FROM domain_outbox_events');
      expect(leaked.rows).toHaveLength(0);
    });
  });

  it('SPIKE-02: enforces immutable audit_logs triggers, NUMERIC(20,4) precision, and atomic rollback', async () => {
    const auditId = crypto.randomUUID();
    await withTenantTransaction(pool, { organizationId: tenantAId }, async (client) => {
      await client.query(
        `INSERT INTO audit_logs (id, organization_id, actor_type, action, entity_type, entity_id, new_state)
         VALUES ($1, $2, 'SYSTEM_JOB', 'ORG_CREATED', 'organization', $2, '{"status":"ACTIVE"}'::jsonb)`,
        [auditId, tenantAId]
      );
    });

    // Neither runtime role nor table owner can UPDATE or DELETE audit_logs
    await expect(
      withTransaction(pool, async (client) => {
        await client.query('UPDATE audit_logs SET action = $1 WHERE id = $2', [
          'TAMPERED',
          auditId
        ]);
      })
    ).rejects.toThrow(/IMMUTABLE_RECORD/);

    await expect(
      withTransaction(pool, async (client) => {
        await client.query('DELETE FROM audit_logs WHERE id = $1', [auditId]);
      })
    ).rejects.toThrow(/IMMUTABLE_RECORD/);

    // NUMERIC(20, 4) exact round-trip precision in PostgreSQL + decimal.js
    const precisionRes = await withTransaction(pool, async (client) => {
      await client.query(
        'CREATE TEMP TABLE tmp_money_check (amount NUMERIC(20, 4) NOT NULL) ON COMMIT DROP'
      );
      await client.query(
        "INSERT INTO tmp_money_check (amount) VALUES ('0.1000'), ('0.2000'), ('999999999999999.1234')"
      );
      return client.query('SELECT amount FROM tmp_money_check ORDER BY amount ASC');
    });

    const dbVals = precisionRes.rows.map((r) => r.amount);
    expect(dbVals).toEqual(['0.1000', '0.2000', '999999999999999.1234']);
    expect(addMoney(dbVals[0], dbVals[1])).toBe('0.3000');

    // Atomic rollback verification: failing transaction leaves zero partial records
    const rollbackEventId = crypto.randomUUID();
    await expect(
      withTenantTransaction(pool, { organizationId: tenantAId }, async (client) => {
        await client.query(
          `INSERT INTO domain_outbox_events (id, organization_id, event_type, aggregate_type, aggregate_id, payload)
           VALUES ($1, $2, 'ShouldRollback', 'organization', $2, '{}'::jsonb)`,
          [rollbackEventId, tenantAId]
        );
        throw new Error('Simulated domain failure triggering rollback');
      })
    ).rejects.toThrow(/Simulated domain failure/);

    const checkRollback = await withTenantTransaction(
      pool,
      { organizationId: tenantAId },
      async (client) => {
        return client.query('SELECT id FROM domain_outbox_events WHERE id = $1', [rollbackEventId]);
      }
    );
    expect(checkRollback.rows).toHaveLength(0);
  });

  it('SPIKE-02: allocates 20 concurrent document numbers safely without duplicates using SELECT FOR UPDATE', async () => {
    await withTenantTransaction(pool, { organizationId: tenantAId }, async (client) => {
      await client.query(
        `INSERT INTO document_sequences (organization_id, document_type, prefix, current_value, padding)
         VALUES ($1, 'INVOICE', 'INV-', 0, 6)
         ON CONFLICT (organization_id, document_type) DO NOTHING`,
        [tenantAId]
      );
    });

    const allocateNext = () =>
      executeWithDeadlockRetry(() =>
        withTenantTransaction(pool, { organizationId: tenantAId }, async (client) => {
          const lockRes = await client.query(
            `SELECT id, prefix, current_value, padding
             FROM document_sequences
             WHERE organization_id = $1 AND document_type = 'INVOICE'
             FOR UPDATE`,
            [tenantAId]
          );
          const row = lockRes.rows[0];
          const nextVal = Number(row.current_value) + 1;
          await client.query('UPDATE document_sequences SET current_value = $1 WHERE id = $2', [
            nextVal,
            row.id
          ]);
          return `${row.prefix}${String(nextVal).padStart(row.padding, '0')}`;
        })
      );

    const allocated = await Promise.all(Array.from({ length: 20 }, () => allocateNext()));
    const unique = new Set(allocated);
    expect(unique.size).toBe(20);
    expect(allocated.slice().sort()).toEqual(
      Array.from({ length: 20 }, (_, i) => `INV-${String(i + 1).padStart(6, '0')}`)
    );
  });

  it('supports reversible down-migration and clean re-application on an isolated database check', async () => {
    // Verify rollback & up cycle cleanly on an isolated temporary schema copy or verify migrator up/down methods exist
    // Note: because audit_logs has rows from this run, test down/up on a dedicated scratch schema or verify down script parses & executes cleanly on fresh temp DB
    const config = loadServerConfig({ ...process.env, NODE_ENV: 'test' });
    const parsed = new URL(config.TEST_DATABASE_URL);
    const scratchDb = `erp_mig_test_${crypto.randomUUID().slice(0, 8)}`;
    parsed.pathname = '/postgres';

    const { Client } = require('pg');
    const adminClient = new Client({ connectionString: parsed.toString() });
    await adminClient.connect();
    await adminClient.query(`CREATE DATABASE "${scratchDb}"`);
    await adminClient.end();

    parsed.pathname = `/${scratchDb}`;
    const scratchPool = createDbPool(config, { connectionString: parsed.toString() });
    try {
      const up1 = await migrateUp(
        scratchPool,
        path.resolve(__dirname, '../../../database/migrations')
      );
      expect(up1.applied).toEqual([
        '0001_init_extensions_and_functions',
        '0002_init_foundation_core'
      ]);

      const down1 = await migrateDownLast(
        scratchPool,
        path.resolve(__dirname, '../../../database/migrations')
      );
      expect(down1.rolledBack).toBe('0002_init_foundation_core');

      const down2 = await migrateDownLast(
        scratchPool,
        path.resolve(__dirname, '../../../database/migrations')
      );
      expect(down2.rolledBack).toBe('0001_init_extensions_and_functions');

      const up2 = await migrateUp(
        scratchPool,
        path.resolve(__dirname, '../../../database/migrations')
      );
      expect(up2.applied).toEqual([
        '0001_init_extensions_and_functions',
        '0002_init_foundation_core'
      ]);
    } finally {
      await closeDbPool(scratchPool);
      parsed.pathname = '/postgres';
      const cleanupClient = new Client({ connectionString: parsed.toString() });
      await cleanupClient.connect();
      await cleanupClient.query(`DROP DATABASE IF EXISTS "${scratchDb}" WITH (FORCE)`);
      await cleanupClient.end();
    }
  });
});
