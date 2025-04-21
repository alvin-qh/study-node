import {
  Worker,
  isMainThread,
  parentPort,
} from 'node:worker_threads';
import { fileURLToPath } from 'node:url';

/**
 * 工作线程函数
 *
 * 该函数接收从主线程发送的消息, 处理后再次返回给主线程
 *
 * @returns {Promise<void>} 异步对象
 */
async function receiverWorker() {
  // 返回异步对象
  return new Promise((resolve) => {
    // 接收主线程发送的消息
    parentPort.on('message', (payload) => {
      if (payload.message === 'data') {
        // 接收到主线程发送的数据, 处理后发回给主线程
        parentPort.postMessage({ message: 'data', data: `${payload.data} from work thread` });
      }
      if (payload.message === 'done') {
        // 接收到主线程发送的完毕消息, 结束当前线程
        parentPort.close();
        resolve();
      }
    });

    // 向主线程发送当前线程就绪消息
    parentPort.postMessage({ message: 'ready' });
  });
}

// 判断当前脚本是否在辅助线程内执行
// `isMainThread` 表示当前 `js` 文件是否运行在主线程或工作线程
if (!isMainThread) {
  // 执行线程函数
  await receiverWorker();
}

/**
 * 启动接收线程
 *
 * @returns {Promise<Worker>} 返回异步对象
 */
async function startReceiverWorker() {
  const __filename = fileURLToPath(import.meta.url);

  // 返回异步对象
  return new Promise((resolve, reject) => {
    // 启动线程
    // 通过 `Worker` 类型可以将一个 `.js` 文件放入一个工作线程中执行
    const worker = new Worker(__filename);

    // 获取工作线程发送到主线程的消息, 仅获取第一个工作线程发送的消息
    worker.once('message', (payload) => {
      // 获取线程就绪消息, 返回 `Worker` 对象
      if (payload.message === 'ready') {
        resolve(worker);
      }
      else {
        reject(new Error('work thread not ready'));
      }
    });

    // 工作线程异常, 返回错误
    worker.once('error', reject);

    // 工作线程异常退出, 返回错误
    worker.once('exit', (code) => {
      if (code !== 0) {
        reject(new Error(`Worker stopped with exit code ${code}`));
      }
    });
  });
}

/**
 * 启动线程, 执行线程函数
 *
 * @param {Array<string>} data 要发送的数据, 该数据从主线程发送
 * @returns {Promise<Array<string>>} 返回异步对象
 */
export async function execute(data) {
  // 启动工作线程
  const worker = await startReceiverWorker();

  // 返回异步对象
  return new Promise((resolve, reject) => {
    const result = [];

    // 监听工作线程发送的消息
    worker.on('message', (payload) => {
      if (payload.message === 'data') {
        // 处理工作线程发送的数据消息
        result.push(`received '${payload.data}'`);
      }
    });

    // 监听工作线程发送的错误消息
    worker.on('error', reject);

    // 监听工作线程退出消息
    worker.on('exit', (code) => {
      if (code === 0) {
        resolve(result);
      }
      else {
        reject(new Error(`Worker stopped with exit code ${code}`));
      }
    });

    // 逐条向工作线程发送数据消息
    for (const item of data) {
      worker.postMessage({ message: 'data', data: item });
    }
    // 向工作线程发送数据发送完毕消息
    worker.postMessage({ message: 'done' });
  });
}
