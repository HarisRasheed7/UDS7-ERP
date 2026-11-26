'use strict';

const { spawnSync } = require('child_process');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..', '..');
const isWindows = process.platform === 'win32';

function runNpm(args) {
  return isWindows
    ? spawnSync('cmd.exe', ['/d', '/s', '/c', 'npm.cmd', ...args], {
        cwd: repoRoot,
        stdio: 'inherit'
      })
    : spawnSync('npm', args, {
        cwd: repoRoot,
        stdio: 'inherit'
      });
}

const fastGates = [
  {
    label: 'Static Policy Check (JS-only, No-Tailwind, Boundaries, Secrets)',
    args: ['run', 'policy:check']
  },
  { label: 'Migration Integrity Check', args: ['run', 'migrations:check'] },
  { label: 'ESLint Quality Check', args: ['run', 'lint'] },
  { label: 'Prettier Formatting Check', args: ['run', 'format:check'] },
  { label: 'Fast Unit Tests (tests/unit)', args: ['exec', '--', 'vitest', 'run', 'tests/unit'] }
];

for (const gate of fastGates) {
  console.log(`\n=== [FAST GATE] ${gate.label} ===`);
  const result = runNpm(gate.args);
  if (result.status !== 0) {
    console.error(`\n[BLOCKED] Fast CI gate failed at: ${gate.label}`);
    process.exit(result.status || 1);
  }
}

console.log('\n[PASS] All fast feedback CI gates passed!');
