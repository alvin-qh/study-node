import { expect } from 'chai';

import { spawn } from 'node:child_process';

/**
 * 测试通过 `spawn` 函数启动子进程，并读取子进程的输出
 */
describe("test 'spawn' function", () => {
  /**
   * 异步启动子进程, 并通过标准输出获取进程执行结果
   */
  it('should start sub-process and read stdout', async () => {
    // 启动进程, 执行 `echo` 命令
    const process = spawn('echo', ['-n', 'hello world']);

    // 实例化异步对象并等待其执行完毕, 返回执行结果
    const result = await new Promise((resolve, reject) => {
      const result = {
        exitCode: null,
        stdout: null,
      };

      // 监听子进程标准输出结果
      process.stdout.on('data', data => {
        result.stdout = data.toString('utf-8');
      });

      // 监听子进程标准错误结果
      process.stderr.on('data', data => {
        reject(new Error(data.toString('utf-8')));
      });

      // 监听子进程退出, 并返回进程执行结果
      process.on('close', code => {
        result.exitCode = code;
        resolve(result);
      });
    });

    expect(result.exitCode).to.equal(0);
    expect(result.stdout).to.equal('hello world');
  });
});
