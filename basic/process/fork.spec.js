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
   * @returns
   */
  async function startChildProcess(name, data) {
    return new Promise((resolve, reject) => {
      const result = {
        stdout: '',
        code: 0,
        signal: null,
        data: [],
      };

      const ctrl = new AbortController();
      const { signal } = ctrl;

      const childProcess = fork(path.join(__dirname, './child-process.js'), [name, data], {
        env: { CHILD: '1' },
        silent: true,
        signal,
      });

      childProcess.stdout.on('data', data => {
        result.stdout = data.toString();
      });

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

      childProcess.on('error', reject);

      childProcess.on('exit', (code, signal) => {
        if (code === 0) {
          resolve({ ...result, code });
        } else {
          if (signal) {
            reject(new Error(`child-process exit caused signal ${signal} and code is ${code}`));
          } else {
            reject(new Error(`child-process exit, code is ${code}`));
          }
        }
      });
    });
  }

  it('should fork child-process from js file', async () => {
    const result = await startChildProcess('Alvin', ['A', 'B', 'C', 'D']);

    expect(result.stdout).to.equal("child-process was started, 'Hello Alvin'\n");
    expect(result.code).to.equal(0);
    expect(result.signal).is.null;
    expect(result.data).to.deep.eq(['A', 'B', 'C', 'D']);
  });
});
