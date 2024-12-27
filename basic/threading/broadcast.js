import {
  BroadcastChannel,
  Worker,
  isMainThread,
  parentPort,
  workerData,
} from 'node:worker_threads';
import { fileURLToPath } from 'node:url';

const channel = new BroadcastChannel('broadcast-channel');

async function doBroadcast(index) {
  return new Promise(resolve => {
    channel.onmessage = event => {
      if (event.data === 'start') {
        parentPort.postMessage({
          message: 'done',
          data: `worker ${index} done`,
        });

        channel.postMessage('done');
        resolve();
      }
    };

    parentPort.postMessage({ message: 'ready' });
  });
}

if (!isMainThread) {
  doBroadcast(workerData.index).then(() => channel.close());
}

export async function execute(workerCount) {
  const __filename = fileURLToPath(import.meta.url);

  return new Promise((resolve, reject) => {
    const results = [];
    let readyCount = 0;

    for (let i = 0; i < workerCount; i++) {
      const worker = new Worker(__filename, { workerData: { index: i + 1 } });

      worker.on('message', payload => {
        if (payload.message === 'ready') {
          readyCount++;
          if (readyCount === workerCount) {
            channel.postMessage('start');
          }
        }
        if (payload.message === 'done') {
          results.push(payload.data);

          if (results.length === workerCount) {
            resolve(results);
            channel.close();
          }
        }
      });

      worker.on('error', reject);
      worker.on('exit', code => {
        if (code !== 0) {
          reject(new Error(`Worker stopped with exit code ${code}`));
        }
      });
    }
  });
}
