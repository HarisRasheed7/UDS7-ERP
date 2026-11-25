'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const verificationDir = path.resolve(__dirname, '..', '..', 'audit', 'verification');
const testFiles = fs
  .readdirSync(verificationDir)
  .filter((name) => /^test_phase_\d+\.js$/.test(name))
  .sort((a, b) => {
    const numA = parseInt(a.match(/\d+/)[0], 10);
    const numB = parseInt(b.match(/\d+/)[0], 10);
    return numA - numB;
  });

for (const file of testFiles) {
  const fullPath = path.join(verificationDir, file);
  console.log(`\n>>> Executing ${file}...`);
  execFileSync(process.execPath, [fullPath], { stdio: 'inherit' });
}

console.log(`\n[PASS] Executed ${testFiles.length} phase verification suite(s) successfully.`);
