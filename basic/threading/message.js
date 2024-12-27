import {
  Worker,
  isMainThread,
  parentPort,
  postMessageToThread,
  workerData,
} from 'node:worker_threads';
import { fileURLToPath } from 'node:url';

/**
 * 发送线程函数
 *
 * @param {number} target 消息发送目标, 为另一个线程的 `threadId` 值
 * @param {Array<string>} data 要发送的信息内容
 */
async function doSend(target, data) {
  return new Promise(resolve => {
    let index = 0;

    // 定时发送消息
    const timerId = setInterval(() => {
      // 判断所有消息是否发送完毕
      if (index >= data.length) {
        // 发送结束消息, 表示所有数据已发送完毕
        clearInterval(timerId);

        // 向以 `target` 表示的线程发送一条消息
        postMessageToThread(target, { done: true, data: undefined });

        resolve();
        // 发送广播消息, 结束当前线程
        // channel.postMessage('done');
      } else {
        // 向以 `target` 表示的线程发送一条消息
        postMessageToThread(target, { done: false, data: data[index] });
        index++;
      }
    }, 50);

    // 向主线程发送已就绪消息
    parentPort.postMessage({ message: 'ready' });
  });
}

/**
 * 接收线程函数
 */
async function doReceive() {
  return new Promise(resolve => {
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
        // channel.postMessage('done');
        resolve();
      } else {
        // 接收发送线程通过 `postMessageToThread` 函数发送的消息
        data.push(`message coming: from ${source}, data: ${payload.data}`);
      }
    });

    // 向主线程发送已就绪消息
    parentPort.postMessage({ message: 'ready' });
  });
}

// 判断当前脚本如果是通过工作线程执行, 则执行工作线程代码
if (!isMainThread) {
  const channel = new BroadcastChannel('broadcast-channel');

  if (workerData?.type === 'sender') {
    doSend(workerData.target, workerData.data).then(() => channel.close());
  } else if (workerData?.type === 'receiver') {
    doReceive().then(() => channel.close());
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
  // 返回异步对象, 包含线程对象
  return new Promise((resolve, reject) => {
    // 启动线程
    const sendWorker = new Worker(__filename, {
      workerData: {
        type: 'sender',
        target,
        data,
      },
    });

    // 监听线程消息
    sendWorker.once('message', payload => {
      // 是否接收到线程启动成功消息
      if (payload.message === 'ready') {
        resolve(sendWorker);
      } else {
        reject(new Error('worker not ready'));
      }
    });

    // 监听线程错误消息
    sendWorker.once('error', reject);
  });
}

/**
 * 启动接收线程
 *
 * @returns {Promise<Worker>} 返回启动的线程对象
 */
function startReceiverWorker() {
  // 返回异步对象, 包含线程对象
  return new Promise((resolve, reject) => {
    // 启动线程
    const recvWorker = new Worker(__filename, { workerData: { type: 'receiver' } });

    // 监听线程消息
    recvWorker.once('message', payload => {
      // 是否接收到线程启动成功消息
      if (payload.message === 'ready') {
        resolve(recvWorker);
      } else {
        reject(new Error('worker not ready'));
      }
    });

    // 监听线程错误消息
    recvWorker.once('error', reject);
  });
}

/**
 * 执行操作, 启动线程执行, 并返回线程执行的异步对象
 *
 * @param {Array<string>} data 要发送的数据集合
 * @returns {Promise<Array<string>>} 返回接收到的数据集合
 */
export async function execute(data) {
  // 创建接收线程
  const receiver = await startReceiverWorker();

  // 创建发送线程
  const sender = await startSenderWorker(receiver.threadId, data);

  // 返回异步对象, 当接收线程完成接收后, 返回接收到的数据内容
  return new Promise((resolve, reject) => {
    // 在接收线程上监听消息
    receiver.on('message', payload => {
      if (payload.message === 'data') {
        resolve({
          source: sender.threadId,
          data: payload.data,
        });
      }
    });

    // 在接收线程上监听错误
    receiver.on('error', reject);

    // 在发送线程上监听错误
    sender.on('error', reject);

    // 在接收线程上监听退出
    receiver.on('exit', code => {
      if (code !== 0) {
        reject(new Error(`Receive worker stopped with exit code ${code}`));
      }
    });

    // 在发送线程上监听退出
    sender.on('exit', code => {
      if (code !== 0) {
        reject(new Error(`Send worker stopped with exit code ${code}`));
      }
    });
  });
}
