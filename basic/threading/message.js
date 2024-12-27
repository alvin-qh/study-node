import {
  Worker,
  isMainThread,
  parentPort,
  postMessageToThread,
  workerData,
} from 'node:worker_threads';
import { fileURLToPath } from 'node:url';

const channel = new BroadcastChannel('test-channel');

/**
 * 发送线程函数
 *
 * @param {number} target 消息发送目标, 为另一个线程的 `threadId` 值
 * @param {Array<string>} data 要发送的信息内容
 */
function doSend(target, data) {
  let index = 0;

  // 定时发送消息
  const timerId = setInterval(() => {
    // 判断所有消息是否发送完毕
    if (index >= data.length) {
      // 发送结束消息, 表示所有数据已发送完毕
      clearInterval(timerId);

      // 向以 `target` 表示的线程发送一条消息
      postMessageToThread(target, { done: true, data: undefined });

      // 发送广播消息, 结束当前线程
      channel.postMessage('done');
    } else {
      // 向以 `target` 表示的线程发送一条消息
      postMessageToThread(target, { done: false, data: data[index] });
      index++;
    }
  }, 50);

  // 向主线程发送已就绪消息
  parentPort.postMessage({ message: 'ready' });
}

/**
 * 接收线程函数
 */
function doReceive() {
  const data = [];

  // 接收发送线程通过 `postMessageToThread` 函数发送的消息
  // `payload` 为接收的消息内容, `source` 为发送消息的线程 `ID`
  process.on('workerMessage', (payload, source) => {
    if (payload.done) {
      // 如果接收到 `done` 消息, 则向主线程发送任务完成消息
      parentPort.postMessage({
        message: 'data',
        data,
      });

      // 发送广播, 结束当前线程
      channel.postMessage('done');
    } else {
      // 接收发送线程通过 `postMessageToThread` 函数发送的消息
      data.push(`message coming: from ${source}, data: ${payload.data}`);
    }
  });

  // 向主线程发送已就绪消息
  parentPort.postMessage({ message: 'ready' });
}

// 判断当前脚本如果是通过工作线程执行, 则执行工作线程代码
if (!isMainThread) {
  if (workerData?.type === 'sender') {
    doSend(workerData.target, workerData.data);
  } else if (workerData?.type === 'receiver') {
    doReceive();
  } else {
    process.exit(1);
  }
}

const __filename = fileURLToPath(import.meta.url);

/**
 * 启动发送线程
 *
 * @param {number} target 消息发送目标线程 `ID`
 * @param {Array<string>} data 待发送消息
 * @returns {Promise<Worker>} 协程对象
 */
function startSenderWorker(target, data) {
  return new Promise((resolve, reject) => {
    const sendWorker = new Worker(__filename, {
      workerData: {
        type: 'sender',
        target,
        data,
      },
    });
    sendWorker.on('message', payload => {
      if (payload.message === 'ready') {
        resolve(sendWorker);
      }
    });
    sendWorker.on('error', reject);
    sendWorker.on('exit', code => {
      if (code !== 0) {
        reject(new Error(`Worker stopped with exit code ${code}`));
      }
    });
  });
}

/**
 *
 * @returns {Promise<Worker>} 返回启动的线程对象
 */
function startReceiverWorker() {
  return new Promise((resolve, reject) => {
    const recvWorker = new Worker(__filename, { workerData: { type: 'receiver' } });
    recvWorker.on('message', payload => {
      if (payload.message === 'ready') {
        resolve(recvWorker);
      }
    });
    recvWorker.on('error', reject);
    recvWorker.on('exit', code => {
      if (code !== 0) {
        reject(new Error(`Worker stopped with exit code ${code}`));
      }
    });
  });
}

/**
 * 
 * @param {Array<string>} data 
 * @returns 
 */
export async function execute(data) {
  const recvWorker = await startReceiverWorker();
  await startSenderWorker(recvWorker.threadId, data);

  return new Promise((resolve, reject) => {
    recvWorker.on('message', payload => {
      switch (payload.message) {
        case 'ready':
          startSenderWorker(recvWorker.threadId, data);
          break;
        case 'data':
          resolve(payload.data);
          break;
      }
    });
    recvWorker.on('error', reject);
    recvWorker.on('exit', code => {
      if (code !== 0) {
        reject(new Error(`Worker stopped with exit code ${code}`));
      }
    });
  });
}

channel.onmessage = channel.close;
