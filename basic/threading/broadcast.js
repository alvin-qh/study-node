import {
  BroadcastChannel,
  Worker,
  isMainThread,
  parentPort,
  workerData,
} from 'node:worker_threads';
import { fileURLToPath } from 'node:url';

// 实例化广播信道对象, 相同名称的广播信道可以将消息发往所有侦听该信道的线程
const channel = new BroadcastChannel('broadcast-channel');

/**
 * 执行线程代码, 侦听广播信道, 并将收到的内容发送到主线程
 *
 * @param {number} index 线程编号
 * @returns {Promise<void>} 异步对象
 */
async function doBroadcast(index) {
  return new Promise((resolve) => {
    // 对广播信道开启侦听
    channel.onmessage = (event) => {
      // 接收到消息, 并获取消息的 `data` 属性, 为消息携带的数据内容
      if (event.data === 'start') {
        // 向主线程发送消息, 表示当前线程已获取到广播信息并执行完毕
        parentPort.postMessage({
          message: 'data',
          data: `worker ${index} done`,
        });

        channel.close();
        resolve();
      }
    };

    // 向主线程发送工作线程就绪的消息
    parentPort.postMessage({ message: 'ready' });
  });
}

if (!isMainThread) {
  // 若当前文件被工作线程执行, 则执行线程函数, 并在执行完毕后关闭广播信道
  await doBroadcast(workerData.index);
}

/**
 * 启动工作线程, 并等待线程结束, 返回执行结果
 *
 * 该函数共将启动 `workerCount` 个工作线程, 并在所有工作线程启动并就绪后发送广播消息,
 * 随后接收各线程发送的执行结果消息, 合并后返回
 *
 * @param {number} workerCount `Worker` 的数量, 即要启动工作线程的数量
 * @returns {Promise<Array<string>>} 返回线程执行结果
 */
export async function execute(workerCount) {
  const __filename = fileURLToPath(import.meta.url);

  return new Promise((resolve, reject) => {
    const results = [];
    let readyCount = 0;

    for (let i = 0; i < workerCount; i++) {
      // 启动工作线程
      const worker = new Worker(__filename, { workerData: { index: i + 1 } });

      // 监听个工作线程发送的消息
      worker.on('message', (payload) => {
        // 判断是否接收到工作线程就绪消息
        if (payload.message === 'ready') {
          // 若接收到 `workerCount` 个就绪消息, 表示所有工作线程均就绪, 广播一条消息
          if (++readyCount === workerCount) {
            channel.postMessage('start');
          }
        }

        // 判断是否接收到工作线程执行完毕消息
        if (payload.message === 'data') {
          // 将线程返回的结果消息加入集合
          results.push(payload.data);

          // 关闭当前线程通道
          channel.close();
        }
      });

      // 处理工作线程发送的异常消息
      worker.on('error', reject);

      // 处理工作线程发送的退出消息
      worker.on('exit', (code) => {
        if (code === 0) {
          // 判断是否所有结果都已接收, 返回全部接收结果
          if (results.length === workerCount) {
            resolve(results);
          }
        }
        else {
          reject(new Error(`Worker stopped with exit code ${code}`));
        }
      });
    }
  });
}
