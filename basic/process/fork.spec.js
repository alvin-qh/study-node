import { expect } from 'chai';

import { fileURLToPath } from 'node:url';
import { fork } from 'node:child_process';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

describe("test 'fork' function", () => {
  /**
   * 通过 `fork` 方式启动子进程
   *
   * `fork` 方式相当于在当前 node 进程中分出一个子进程, 子进程和父进程共享内存空间
   *
   * @param {string} name 用户名
   * @param {Array<string>} data 数据集合
   * @returns {Promise<{ stdout: string, code: number, signal: string | null, data: Array<string> }>} 表示进程执行的异步对象
   */
  async function startChildProcess(name, data) {
    // 返回异步对象
    return new Promise((resolve, reject) => {
      // 进程执行结果, 作为异步执行结果返回
      const result = {
        stdout: '',
        code: 0,
        signal: null,
        data: [],
      };

      // 实例化控制器对象, 用于中断进程执行
      const ctrl = new AbortController();
      // 从控制器对象中获取进程信号对象
      const { signal } = ctrl;

      // 启动子进程, 传递进程参数和进程启动选项
      // 进程参数必须是一个 '字符串数组', 数组中的每一项将作为一个进程参数
      const childProcess = fork(path.join(__dirname, './child-process.js'), [name, data.join(',')], {
        // 传递给子进程的环境变量
        env: { CHILD: '1' },
        // 控制台输出流, 如果为 `true`, 则共享父进程的控制台输出流, 如果为 `false`, 则子进程创建自己的控制台输出流
        silent: true,
        // 传递给子进程的信号量对象, 用于中止子进程
        signal,
      });

      // 监听子进程的控制台输出内容
      childProcess.stdout.on('data', data => {
        result.stdout = data.toString();
      });

      // 监听子进程发送到主进程的消息
      childProcess.on('message', payload => {
        if (payload.message === 'data') {
          result.data.push(payload.data);
        } else if (payload.message === 'done') {
          // 如果子进程无法正常结束, 可采用如下方式结束子进程

          // 通过信号量取消进程执行
          // ctrl.abort('exit');

          // 停止
          // childProcess.kill();
        }
      });

      // 监听子进程执行产生的错误
      childProcess.on('error', reject);

      // 监听子进程退出消息
      childProcess.on('exit', (code, signal) => {
        if (code === 0) {
          // 返回子进程执行结果
          resolve({ ...result, code });
        } else {
          // 非正常退出子进程
          if (signal) {
            reject(new Error(`child-process exit caused signal ${signal} and code is ${code}`));
          } else {
            reject(new Error(`child-process exit, code is ${code}`));
          }
        }
      });
    });
  }

  /**
   * 测试启动子进程
   */
  it('should fork child-process from js file', async () => {
    const result = await startChildProcess('Alvin', ['A', 'B', 'C', 'D']);

    expect(result.stdout).to.equal("child-process was started, 'Hello Alvin'\n");
    expect(result.code).to.equal(0);
    expect(result.signal).is.null;
    expect(result.data).to.deep.eq(['A', 'B', 'C', 'D']);
  });
});
