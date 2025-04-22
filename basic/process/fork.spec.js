import { expect } from '@jest/globals';

import { fileURLToPath } from 'node:url';
import { fork } from 'node:child_process';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * 测试 `fork` 函数, 启动子进程
 */
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
  async function startChildProcess(name, data, opts = {}) {
    // 返回异步对象
    return new Promise((resolve, reject) => {
      // 进程执行结果, 作为异步执行结果返回
      const result = {
        stdout: '',
        code: 0,
        signal: null,
        data: [],
      };

      // 启动子进程, 传递进程参数和进程启动选项
      // 进程参数必须是一个 '字符串数组', 数组中的每一项将作为一个进程参数
      const childProcess = fork(path.join(__dirname, './child-process.js'), [name, data.join(',')], {
        ...opts,
        // 传递给子进程的环境变量
        env: {
          ...process.env,
          CHILD: '1',
        },
        // 控制台输出流, 如果为 `true`, 则共享父进程的控制台输出流, 如果为 `false`, 则子进程创建自己的控制台输出流
        silent: true,
      });

      // 监听子进程的控制台输出内容
      childProcess.stdout.on('data', (data) => {
        result.stdout = data.toString();
      });

      // 监听子进程发送到主进程的消息
      childProcess.on('message', (payload) => {
        if (payload.message === 'data') {
          result.data.push(payload.data);
        }
        else if (payload.message === 'done') {
          // 如果子进程无法正常结束, 可采用如下方式结束子进程

          // 停止进程执行
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
        }
        else {
          // 非正常退出子进程
          if (signal) {
            reject(new Error(`child-process exit caused signal ${signal} and code is ${code}`));
          }
          else {
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

    expect(result.stdout).toEqual("child-process was started, 'Hello Alvin'\n");
    expect(result.code).toEqual(0);
    expect(result.signal).toBeNull();
    expect(result.data).toEqual(['A', 'B', 'C', 'D']);
  });

  /**
   * 测试子进程的启动选项
   */
  it('should fork child-process from js file with options', async () => {
    // 实例化控制器对象, 用于中断进程执行
    const ctrl = new AbortController();

    // 从控制器对象中获取进程信号对象
    const { signal } = ctrl;

    // 设置超时后结束进程, 通过信号量中止进程执行
    setTimeout(() => ctrl.abort('exit'), 1000);

    const result = await startChildProcess('Alvin', ['A', 'B', 'C', 'D'], {
      // 子进程的工作目录
      // cwd: __dirname,

      // 子进程的环境变量
      env: {
        ...process.env,
        CHILD: '1',
        NODE_ENV: 'test',
      },

      // 设置进程的第一个参数, 默认为命令行本身
      // argv0: __filename,

      // 子进程的默认标准输入输出配置, 可以为如下字符串值, 默认为 `pipe`:
      // - `pipe`: 在子进程和父进程之间创建管道. 管道两端分别连接父进程的 `stdio[fd]` 和子进程的 `stdio[fd]`,
      //          `fd` 称为描述符, 可以为 `0`, `1` 和 `2`, 分别表示 `subprocess.stdin`, `subprocess.stdout` 和 `subprocess.stderr`.
      //          这些不是实际的 Unix 管道, 因此子进程不能通过它们的描述符文件使用它们, 例如 `/dev/fd/2` 或 `/dev/stdout`;
      // - `overlapped`: 与 `pipe` 相同, 只是在句柄上设置了 `FILE_FLAG_OVERLAPPED` 标志. 这对于子进程的 `stdio` 句柄上的重叠 `I/O` 是必需的.
      //          有关详细信息, 请参阅 <https://learn.microsoft.com/en-us/windows/win32/fileio/synchronous-and-asynchronous-i-o> 文档,
      //          这与非 Windows 系统上的 `pipe` 完全相同
      // - `ipc`: 创建一个 IPC 通道, 用于在父子之间传递消息或文件描述符. 一个子进程最多可以有一个 IPC stdio 文件描述符.
      //          设置此选项可启用 `subprocess.send()` 方法. 如果子进程是 Node 实例, 则 IPC 通道的存在将启用 `process.send()` 和 `process.disconnect()` 方法,
      //          以及子进程内的 `disconnect` 和 `message` 事件
      //          不支持以 `process.send()` 以外的任何方式访问 IPC 通道描述符或将 IPC 通道用于非 Node实例的子进程
      // - `ignore`：指示 Node 忽略子项中的描述符. 虽然 Node 将始终为其生成的进程打开 `0`, `1` 和 `2` 三个描述符,
      //          但将描述符设置为 `ignore` 将导致 Node 打开 `/dev/null` 并将其附加到子进程的描述符上
      // - `inherit`：通过相应的 `stdio` 流传入/传出父进程. 在前三个位置, 这分别相当于 `process.stdin`, `process.stdout`, `process.stderr`.
      //          在任何其他位置, 相当于 `ignore`
      // - `<Stream>` 对象: 与子进程共享引用 tty, 文件, 套接字或管道的可读或可写流. 流的底层文件描述符在子进程中复制到与 `stdio` 数组中的索引相对应的描述符.
      //          流必须有一个底层描述符 (文件流在 `open` 事件发生之前不会启动). 注意: 虽然从技术上讲可以将 stdin 作为可写或将 `stdout`/`stderr` 作为可读传递,
      //          但不建议这样做. 可读流和可写流设计为具有不同的行为, 如果使用不当 (例如, 在需要可写流的地方传递可读流) 可能会导致意外结果或错误. 不鼓励这种做法,
      //          因为如果流遇到错误, 它可能会导致未定义的行为或丢弃回调. 始终确保 stdin 可写, `stdout`/`stderr` 可读, 以维持父进程和子进程之间预期的数据流
      // - 整数: 整数值被解释为在父进程中打开的文件描述符 (即 `fd` ), 它与子进程共享, 类似于 `<Stream>` 对象的共享方式
      // - `null`, `undefined`: 使用默认值. 对于 stdio 描述符 `0`, `1` 和 `2` (换句话说, `stdin`, `stdout` 和 `stderr`), 创建了一个管道.
      //          对于 fd=3 及更高版本, 默认值为 `ignore`
      // 当在父进程和子进程之间建立了 IPC 通道, 并且子进程是 Node 实例时, 子进程启动时 IPC 通道未引用 (使用 `unref()` 函数), 直到子进程为 `disconnect` 事件或 `message`
      // 事件注册事件处理程序. 这允许子进程正常退出, 而无需通过打开的 IPC 通道保持进程打开. 可以参考: `child_process.exec()` 和 `child_process.fork()` 函数
      stdio: 'pipe',

      // 设置子进程的用户 ID
      // uid: '',

      // 设置子进程的用户组 ID
      // gid: '',

      // 设置同子进程发送消息的数据序列化方式, 可以为 `json`, `advanced` (V8 高级序列化格式), 默认为 `json`
      // serialization: 'json',

      // 如果是 `true`, 则在 SHELL 内运行命令行, 在 UNIX 上使用 `/bin/sh`, 在 WINDOWS 上使用 `process.env.ComSpec`. 可以将不同的 SHELL 指定为字符串
      shell: false,

      // 在 WINDOWS 上不为参数加上引号或转义. 在 UNIX 上被忽略. 当指定了 SHELL 并且是 `'cmd'` 时, 则自动设置为 `true`. 默认值: `false`
      windowsVerbatimArguments: false,

      // 允许使用 `AbortSignal` 中止子进程
      signal,

      // 设置子进程执行的超时时间
      timeout: 1000,

      // 设置当子进程超时或中止时, 结束该进程所使用的信号量, 默认为 `SIGTERM`
      killSignal: 'SIGTERM',
    });

    // 确认子进程执行结果
    expect(result.stdout).toEqual("child-process was started, 'Hello Alvin'\n");
    expect(result.code).toEqual(0);
    expect(result.signal).toBeNull();
    expect(result.data).toEqual(['A', 'B', 'C', 'D']);
  });
});
