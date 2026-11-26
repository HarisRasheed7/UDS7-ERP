'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const { verifyPolicy } = require('../../../scripts/testing/verify-policy');
const { checkMigrations } = require('../../../scripts/testing/check-migrations');

describe('CI quality gates: intentional failure blocking', () => {
  const tempDirs = [];

  function makeTempWorkspace() {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'erp-ci-gate-'));
    tempDirs.push(dir);
    fs.mkdirSync(path.join(dir, 'database', 'migrations'), { recursive: true });
    fs.mkdirSync(path.join(dir, 'client', 'src'), { recursive: true });
    fs.mkdirSync(path.join(dir, 'server', 'src', 'modules', 'sales'), { recursive: true });
    fs.writeFileSync(path.join(dir, '.env.example'), 'NODE_ENV=development\n');
    return dir;
  }

  afterEach(() => {
    while (tempDirs.length > 0) {
      fs.rmSync(tempDirs.pop(), { recursive: true, force: true });
    }
  });

  it('passes cleanly on a compliant JavaScript-only workspace fixture', () => {
    const dir = makeTempWorkspace();
    fs.writeFileSync(
      path.join(dir, 'server', 'src', 'modules', 'sales', 'service.js'),
      'module.exports = {};\n'
    );
    fs.writeFileSync(
      path.join(dir, 'database', 'migrations', '0001_init_core.sql'),
      'CREATE TABLE organizations (id UUID PRIMARY KEY, balance NUMERIC(20, 4) NOT NULL);\n'
    );

    expect(verifyPolicy(dir).passed).toBe(true);
    expect(checkMigrations(dir).passed).toBe(true);
  });

  it('blocks an intentional TypeScript file violation', () => {
    const dir = makeTempWorkspace();
    fs.writeFileSync(
      path.join(dir, 'server', 'src', 'illegal.ts'),
      'export const x: number = 1;\n'
    );

    const result = verifyPolicy(dir);
    expect(result.passed).toBe(false);
    expect(result.violations.some((v) => v.includes('[JS-ONLY VIOLATION]'))).toBe(true);
  });

  it('blocks an intentional Tailwind CSS config or @tailwind directive', () => {
    const dir = makeTempWorkspace();
    fs.writeFileSync(path.join(dir, 'tailwind.config.js'), 'module.exports = {};\n');
    fs.writeFileSync(path.join(dir, 'client', 'src', 'bad.css'), '@tailwind utilities;\n');

    const result = verifyPolicy(dir);
    expect(result.passed).toBe(false);
    expect(result.violations.filter((v) => v.includes('[NO-TAILWIND VIOLATION]')).length).toBe(2);
  });

  it('blocks an intentional cross-module internal repository import while allowing own internals and public index', () => {
    const dir = makeTempWorkspace();
    fs.mkdirSync(path.join(dir, 'server', 'src', 'modules', 'sales', 'application'), {
      recursive: true
    });
    fs.writeFileSync(
      path.join(dir, 'server', 'src', 'modules', 'sales', 'application', 'validService.js'),
      "const domain = require('../domain/order');\nconst inv = require('../../inventory');\nmodule.exports = { domain, inv };\n"
    );
    expect(verifyPolicy(dir).passed).toBe(true);

    fs.writeFileSync(
      path.join(dir, 'server', 'src', 'modules', 'sales', 'application', 'orderService.js'),
      "const repo = require('../../inventory/infrastructure/repositories/stockRepo');\nmodule.exports = repo;\n"
    );

    const result = verifyPolicy(dir);
    expect(result.passed).toBe(false);
    expect(result.violations.some((v) => v.includes('[MODULE-BOUNDARY VIOLATION]'))).toBe(true);
  });

  it('blocks client code attempting to import PostgreSQL or server internals', () => {
    const dir = makeTempWorkspace();
    fs.writeFileSync(
      path.join(dir, 'client', 'src', 'leak.js'),
      "import pg from 'pg';\nexport default pg;\n"
    );

    const result = verifyPolicy(dir);
    expect(result.passed).toBe(false);
    expect(result.violations.some((v) => v.includes('[CLIENT-BOUNDARY VIOLATION]'))).toBe(true);
  });

  it('blocks non-sequential SQL migrations and floating-point money columns', () => {
    const dir = makeTempWorkspace();
    fs.writeFileSync(
      path.join(dir, 'database', 'migrations', '0002_skipped_seq.sql'),
      'CREATE TABLE ledger (id UUID PRIMARY KEY, total DOUBLE PRECISION NOT NULL);\n'
    );

    const result = checkMigrations(dir);
    expect(result.passed).toBe(false);
    expect(result.violations.some((v) => v.includes('Non-sequential migration number'))).toBe(true);
    expect(result.violations.some((v) => v.includes('[PRECISION VIOLATION]'))).toBe(true);
  });
});
