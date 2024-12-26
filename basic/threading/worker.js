import {
  Worker,
  isMainThread,
  parentPort,
  workerData,
} from 'node:worker_threads';
import { fileURLToPath } from 'node:url';

/**
 * 生产者方法, 产生最大值为 `max` 的质数序列
 *
 * @param {number} max 最大质数上限值
 */
function producer(max) {
  // 保存标记的数组, 值为 `true` 的, 表示该数组索引表示的数值不为质数
  const marks = [];
  for (let i = 2; i <= max; i++) {
    if (!marks[i]) {
      for (let j = i * 2; j < max; j += i) {
        // 将符合条件的索引项标记为 "非质数"
        marks[j] = true;
      }
    }
  }

  const result = [];
  for (let i = 2; i < max; i++) {
    if (!marks[i]) {
      // 将表示质数的数组索引记录为结果
      result.push(i);
    }
  }
  return result;
}

// 判断当前脚本是否在辅助线程内执行
// `isMainThread` 表示当前 `js` 文件是否运行在主线程或工作线程
if (!isMainThread) {
  // 从主线程获取线程参数
  const { max } = workerData;

  // 执行线程代码, 并向主线程发送结果
  // `parentPort` 表示向主进程发送消息的接口, `postMessage` 表示向主线程发送信息
  parentPort.postMessage(producer(max));
}

/**
 * 消费者函数
 *
 * 消费者在主线程的某个协程中执行
 *
 * @param {number} max 最大的质数值
 * @returns {Promise<Array<number>>} 质数序列
 */
async function consumer(max) {
  const __filename = fileURLToPath(import.meta.url);

  // 启动线程
  // 通过 `Worker` 类型可以将一个 `.js` 文件放入一个工作线程中执行
  const worker = new Worker(__filename, { workerData: { max } });

  // 返回协程对象
  return new Promise((resolve, reject) => {
    worker.on('message', resolve);
    worker.on('error', reject);
    worker.on('exit', code => {
      if (code !== 0) {
        reject(new Error(`Worker stopped with exit code ${code}`));
      }
    });
  });
}

/**
 * 执行函数
 *
 * @param {number} max 最大质数值
 * @returns {Promise<Array<number>>}
 */
export async function execute(max) {
  return consumer(max);
}
