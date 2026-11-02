import { spawn } from 'node:child_process';

const apiPort = process.env.API_PORT ?? '3001';
let reuseApi = false;

try {
  const response = await fetch(`http://127.0.0.1:${apiPort}/api/tasks`);
  reuseApi = response.ok && Array.isArray(await response.json());
} catch {
  reuseApi = false;
}

const children = [];
if (reuseApi) {
  console.log(`Reusing Employee API at http://127.0.0.1:${apiPort}`);
} else {
  children.push(spawn(process.execPath, ['server/api.mjs'], { stdio: 'inherit' }));
}
children.push(spawn(process.execPath, ['node_modules/@angular/cli/bin/ng.js', 'serve', '--proxy-config', 'proxy.conf.json'], { stdio: 'inherit' }));

let stopping = false;

function stopChildren(signal = 'SIGTERM') {
  if (stopping) return;
  stopping = true;
  for (const child of children) {
    if (!child.killed) child.kill(signal);
  }
}

for (const child of children) {
  child.on('error', (error) => {
    console.error(error);
    stopChildren();
    process.exitCode = 1;
  });
  child.on('close', (code) => {
    if (!stopping) {
      process.exitCode = code ?? 1;
      stopChildren();
    }
  });
}

process.on('SIGINT', () => stopChildren('SIGINT'));
process.on('SIGTERM', () => stopChildren('SIGTERM'));
