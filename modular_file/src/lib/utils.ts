import path from 'path';
import { Worker } from 'worker_threads';
import { execute } from './worker';

export function executeAsync<R>(name: string, args: object): Promise<R> {
  if (!isLargeData(args as _DataType)) {
    return new Promise<R>((resolve, reject) => {
      try {
        resolve(execute({ name: name, args: args }));
      } catch (e) {
        reject(e);
      }
    });
  }
  const worker = new Worker(path.resolve(__dirname, './worker.js'), {
    workerData: {
      name: name,
      args: args,
    }
  });
  return new Promise<R>((resolve, reject) => {
    worker
      .once('message', result => {
        resolve(result);
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

export function varValid<T>(x?: T): x is NonNullable<T> {
  return x !== undefined && x !== null;
}

export function computeIfNotExist<K, V>(map: Map<K, V>, key: K, fn: (key: K) => V): V {
  if (map.has(key)) {
    return map.get(key)!;
  }
  const val = fn(key);
  map.set(key, val);
  return val;
}

type _ArrayItemType = number | string | bigint;
type _JSONType = Record<string, unknown>;
type _DataType = Buffer | _JSONType | Array<_ArrayItemType | _JSONType | Buffer> | _ArrayItemType;

const MAX_LENGTH = 65536;

export function isLargeData(data: _DataType): boolean {
  function count(obj: _DataType): number {
    let n: number = 0;
    switch (typeof obj) {
    case 'string':
      n = Math.ceil(obj.length / 8);
      break;
    case 'object':
      if (obj instanceof Buffer) {
        n += Math.ceil(obj.length / 8);
      } else if (Array.isArray(obj)) {
        n += count(obj[0]) * obj.length;
      } else {
        for (const k in obj) {
          if (n <= MAX_LENGTH) {
            n += count(obj[k] as _DataType);
          }
        }
      }
      break;
    default:
      n = 1;
    }
    return n;
  }
  return count(data) > MAX_LENGTH;
}
