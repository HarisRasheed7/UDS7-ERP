'use strict';

const { spawn } = require('child_process');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..', '..');
const isWindows = process.platform === 'win32';

function launchWorkspace(name, scriptName) {
  const args = [`--workspace=${name}`, 'run', scriptName];
  const child = isWindows
    ? spawn('cmd.exe', ['/d', '/s', '/c', 'npm.cmd', ...args], {
        cwd: repoRoot,
        stdio: 'inherit'
      })
    : spawn('npm', args, {
        cwd: repoRoot,
        stdio: 'inherit'
      });

  child.on('exit', (code) => {
    if (code !== 0 && code !== null) {
      console.error(`[${name}] exited with code ${code}`);
    }
  });

  return child;
}

const serverProc = launchWorkspace('server', 'dev');
const clientProc = launchWorkspace('client', 'dev');

function shutdown() {
  serverProc.kill('SIGINT');
  clientProc.kill('SIGINT');
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
