import { exec, execSync } from 'node:child_process';

/**
 * 通过 `exec` 函数启动子进程
 *
 * 调用 `exec` 函数, 并传递一个表示命令行的字符串, 即可启动子进程, 相当于通过系统的 SHELL 启动子进程
 */
describe("test 'exec' function", () => {
  /**
   * 异步启动子进程, 并通过回调返回子进程的执行结果
   */
  it('should execute a shell command', async () => {
    // 实例化异步对象, 异步启动子进程
    const result = await new Promise((resolve, reject) => {
      // 启动子进程, 并传入回调函数
      exec("echo -n 'Hello World'", (err, stdout, stderr) => {
        // 判断子进程是否产生错误
        if (err) {
          reject(err);
        }

        // 判断子进程是否输出错误信息
        if (stderr) {
          reject(new Error(stderr));
        }

        // 判断子进程是否输出正常结果
        if (stdout) {
          resolve(stdout);
        }
      });
    });

    // 确认子进程
    expect(result).toEqual('Hello World');
  });

  /**
   * 测试同步启动子进程并等待进程执行完毕, 获取进程结果
   *
   * 调用 `execSync` 函数, 并传递一个表示命令行的字符串, 即可同步启动子进程, 该函数会阻塞直到子进程执行结束
   */
  it('should execute a shell command synchronized', async () => {
    // 启动子进程, 并返回子进程执行结果
    const result = execSync("echo -n 'Hello World'");

    // 确认子进程结果
    expect(result.toString()).toEqual('Hello World');
  });
});
