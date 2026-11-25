'use strict';

const { spawnSync } = require('child_process');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..', '..');
const isWindows = process.platform === 'win32';

const steps = [
  { label: 'Policy Check', args: ['run', 'policy:check'] },
  { label: 'ESLint Check', args: ['run', 'lint'] },
  { label: 'Prettier Check', args: ['run', 'format:check'] },
  { label: 'Vitest Suite', args: ['run', 'test'] },
  { label: 'Phase Verification Suites', args: ['run', 'test:phases'] }
];

for (const step of steps) {
  console.log(`\n=== Running ${step.label} ===`);
  const result = isWindows
    ? spawnSync('cmd.exe', ['/d', '/s', '/c', 'npm.cmd', ...step.args], {
        cwd: repoRoot,
        stdio: 'inherit'
      })
    : spawnSync('npm', step.args, {
        cwd: repoRoot,
        stdio: 'inherit'
      });

  if (result.status !== 0) {
    console.error(`\n[FAIL] Validation aborted at: ${step.label}`);
    process.exit(result.status || 1);
  }
}

console.log('\n[PASS] All repository validation gates succeeded!');
