import {
  MessageChannel,
  Worker,
  isMainThread,
  parentPort,
  workerData,
} from 'node:worker_threads';
import { fileURLToPath } from 'node:url';

/**
 * 执行发送操作
 *
 * 该函数在发送工作线程中执行
 *
 * @param {MessagePort} port 消息发送端口
 * @param {Array<string>} data 待发送的数据集合
 * @returns {Promise<void>} 返回异步对象
 */
async function sender(port, data) {
  // 返回异步对象
  return new Promise(resolve => {
    let index = 0;

    // 启动定时器, 异步执行操作
    const timer = setInterval(() => {
      if (index >= data.length) {
        // 数据发送完毕, 关闭定时器
        clearInterval(timer);

        // 通过 `MessagePort` 对象向接收线程发送消息
        port.postMessage({ message: 'done' });
        // 关闭 `MessagePort` 对象, 会发送 `close` 消息
        port.close();
      } else {
        // 数据未发送完毕, 继续发送
        // 通过 `MessagePort` 对象向接收线程发送消息
        port.postMessage({ message: 'data', data: data[index] });
        index++;
      }
    }, 50);

    // 接收 `MessagePort` 关闭消息, 结束当前函数执行
    port.on('close', resolve);

    // 向主线程发送当前线程就绪消息
    parentPort.postMessage({ message: 'ready' });
  });
}

/**
 * 执行接收操作
 *
 * 该函数在接收线程中执行
 *
 * @param {MessagePort} port 消息接收端口
 * @returns {Promise<void>} 返回异步对象
 */
async function receiver(port) {
  return new Promise((resolve, reject) => {
    const data = [];

    // 通过 `MessagePort` 接收发送线程发送的消息
    port.on('message', payload => {
      if (payload.message === 'data') {
        // 接收到数据发送消息
        // 将接收到的数据进行缓存
        data.push(`received message data ${payload.data}`);
      } else if (payload.message === 'done') {
        // 接收到数据发送完毕消息
        // 向主线程发送全部接收到的数据
        parentPort.postMessage({ message: 'data', data });

        // 关闭 `MessagePort` 对象
        port.close();
      }
    });

    // 接收 `MessagePort` 关闭消息, 结束当前函数执行
    port.on('close', resolve);

    // 接收 `MessagePort` 错误消息, 返回执行错误对象
    port.on('messageerror', reject);

    // 向主线程发送当前线程就绪消息
    parentPort.postMessage({ message: 'ready' });
  });
}

// 如果当前文件由工作线程加载, 则执行线程函数
if (!isMainThread) {
  if (workerData?.type === 'sender') {
    // 若线程类型为发送线程, 则执行发送函数, 将 `MessagePort` 和待发送的数据作为参数传递
    await sender(workerData.port, workerData.data);
  } else if (workerData?.type === 'receiver') {
    // 若线程类型为接收线程, 则执行接收函数, 将 `MessagePort` 作为参数
    await receiver(workerData.port);
  } else {
    process.exit(1);
  }
}

const __filename = fileURLToPath(import.meta.url);

/**
 * 启动发送线程
 *
 * @param {MessagePort} messagePort 消息端口
 * @returns {Promise<Worker>} 返回异步对象
 */
async function startReceiverWorker(messagePort) {
  return new Promise((resolve, reject) => {
    // 创建线程对象
    const recvWorker = new Worker(__filename, {
      // 指定线程名称
      name: 'Receiver',
      workerData: {
        // 要启动线程的类型, 表示为 "接收线程"
        type: 'receiver',
        // 接收消息用的 `MessagePort` 类型对象, 注意, 该对象必须通过 `transferList` 属性进行序列化操作
        port: messagePort,
      },
      // 指定 `workerData` 属性中, 需要进行序列化的对象引用
      transferList: [messagePort],
    });

    // 监听工作线程发往主线程的消息
    recvWorker.once('message', payload => {
      if (payload.message === 'ready') {
        // 线程就绪消息, 返回当前线程的 `Worker` 对象
        resolve(recvWorker);
      } else {
        // 非线程就绪消息, 表示线程启动失败
        reject(new Error('worker not ready'));
      }
    });

    // 线程启动错误, 返回线程失败消息
    recvWorker.once('error', reject);
  });
}

/**
 * 启动接收线程
 *
 * @param {MessagePort} messagePort 消息端口
 * @param {Array<string>} data 要发送的数据集合
 * @returns {Promise<Worker>} 返回异步对象
 */
async function startSenderWorker(messagePort, data) {
  return new Promise((resolve, reject) => {
    // 启动发送线程
    const sendWorker = new Worker(__filename, {
      // 指定线程名称
      name: 'Sender',
      workerData: {
        // 要启动线程的类型, 表示为 "接收线程"
        type: 'sender',
        // 接收消息用的 `MessagePort` 类型对象, 注意, 该对象必须通过 `transferList` 属性进行序列化操作
        port: messagePort,
        // 传送给线程的参数
        data,
      },
      // 指定 `workerData` 属性中, 需要进行序列化的对象引用
      transferList: [messagePort],
    });

    // 监听工作线程发往主线程的消息
    sendWorker.once('message', payload => {
      if (payload.message === 'ready') {
        // 线程就绪消息, 返回当前线程的 `Worker` 对象
        resolve(sendWorker);
      } else {
        // 非线程就绪消息, 表示线程启动失败
        reject(new Error('worker not ready'));
      }
    });

    // 线程启动错误, 返回线程失败消息
    sendWorker.once('error', reject);
  });
}

/**
 *
 * @param {Array<string>} data 要发送的数据集合
 */
export async function execute(data) {
  // 创建两个消息端口, 一个用于发送, 另一个用于接收
  const { port1, port2 } = new MessageChannel();

  // 启动接收线程, 将 `port2` 端口对象绑定到该线程
  const receiver = await startReceiverWorker(port2);

  // 启动发送线程, 将 `port1` 端口对象绑定到该线程
  const sender = await startSenderWorker(port1, data);

  // 返回异步对象
  return new Promise((resolve, reject) => {
    const result = {data: null};

    // 处理接收线程发送的消息
    receiver.on('message', payload => {
      if (payload.message === 'data') {
        // 将接收线程发送消息的内容作为当前函数返回值
        result.data = payload.data;
      }
    });

    // 处理接收线程发生错误的情况
    receiver.on('error', reject);

    // 处理接收线程关闭的情况
    receiver.on('exit', code => {
      if (code === 0) {
        resolve(result);
      } else {
        reject(new Error(`Receive worker stopped with exit code ${code}`));
      }
    });

    // 处理发送线程发生错误的情况
    sender.on('error', reject);

    // 处理发送线程发生错误的情况
    sender.on('exit', code => {
      if (code !== 0) {
        reject(new Error(`Send worker stopped with exit code ${code}`));
      }
    });
  });
}
