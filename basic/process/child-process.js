import { fileURLToPath } from 'node:url';
import { fork } from 'node:child_process';

async function runChildProcess() {
  return new Promise((resolve) => {
    console.log('Hello');
    resolve();
  });
}

console.log(`Process env ${process.env.CHILD}`);

if (process.env.CHILD === 1) {
  await runChildProcess();
}

export async function startChildProcess() {
  const __filename = fileURLToPath(import.meta.url);

  return new Promise((resolve, reject) => {
    const controller = new AbortController();
    const { signal } = controller;

    const childProcess = fork(__filename, {
      env: { CHILD: 1 },
      signal,
      silent: true,
    });

    childProcess.stdout.on('data', data => {
      resolve(data.toString('utf-8'));
    });

    childProcess.on('error', reject);
    childProcess.on('exit', (code, signal) => {
      if (code !== 0) {
        reject(new Error(`process exited by error code ${code}, by signal ${signal}`));
      }
    });
  });
}
