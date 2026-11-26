'use strict';

const fs = require('fs');
const { spawnSync } = require('child_process');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..', '..');
const reportsDir = path.join(repoRoot, 'reports');
const isWindows = process.platform === 'win32';

fs.mkdirSync(reportsDir, { recursive: true });

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

const fullGates = [
  { label: 'Fast Feedback Gates', args: ['run', 'verify:fast'] },
  {
    label: 'Full Vitest Suite (with retained JSON report)',
    args: [
      'exec',
      '--',
      'vitest',
      'run',
      '--reporter=default',
      '--reporter=json',
      '--outputFile=reports/vitest-report.json'
    ]
  },
  { label: 'Phase Verification Suites', args: ['run', 'test:phases'] },
  { label: 'Production Client Build (Next.js)', args: ['run', 'build'] }
];

const summary = {
  executedAt: new Date().toISOString(),
  gates: [],
  passed: true
};

for (const gate of fullGates) {
  console.log(`\n=== [FULL CI GATE] ${gate.label} ===`);
  const start = Date.now();
  const result = runNpm(gate.args);
  const durationMs = Date.now() - start;

  summary.gates.push({
    label: gate.label,
    passed: result.status === 0,
    durationMs
  });

  if (result.status !== 0) {
    summary.passed = false;
    fs.writeFileSync(path.join(reportsDir, 'ci-summary.json'), JSON.stringify(summary, null, 2));
    console.error(`\n[BLOCKED] Full CI gate failed at: ${gate.label}`);
    process.exit(result.status || 1);
  }
}

fs.writeFileSync(path.join(reportsDir, 'ci-summary.json'), JSON.stringify(summary, null, 2));
console.log(
  '\n[PASS] All full verification CI gates passed! Report retained in reports/ci-summary.json'
);
