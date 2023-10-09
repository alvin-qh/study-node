import path from 'path';
import { Worker } from 'worker_threads';

type Callback<T, R> = (args: T) => R;

export function executeAsync<T, R>(name: string, args: object, cb: Callback<T, R>) {
  const worker = new Worker(path.resolve(__dirname, './worker.js'), {
    workerData: {
      name: name,
      args: args,
    }
  });
  return new Promise<R>((resolve, reject) => {
    worker
      .once('message', result => {
        resolve(cb(result));
      })
      .once('error', err => {
        reject(err);
      })
      .on('exit', code => {
        if (code !== 0) {
          reject(new Error(`worker stopped with exit code ${code}`));
        }
      });
  });
}
