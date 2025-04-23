import { spawn, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

/**
 * 测试通过 `spawn` 函数启动子进程
 *
 * `spawn` 通过操作系统提供的系统调用 (例如 `CreateProcess` 或 `fork` 等) 启动子进程, 返回表示子进程句柄的对象
 */
describe("test 'spawn' function", () => {
  /**
   * 异步启动子进程, 并通过标准输出获取进程执行结果
   *
   * 通过 `spawn` 函数启动子进程, 返回表示子进程句柄的对象;
   * 子进程和当前进程并行执行, 通过消息机制进行通讯 (IPC 方式)
   */
  it('should start child-process and read result from stdout', async () => {
    // 启动进程, 执行 `echo` 命令
    const echo = spawn('echo', ['-n', 'Hello World']);

    // 实例化异步对象并等待其执行完毕, 返回执行结果
    const result = await new Promise((resolve, reject) => {
      const result = {
        exitCode: null,
        stdout: null,
      };

      // 监听子进程标准输出结果
      echo.stdout.on('data', (data) => {
        result.stdout = data.toString('utf-8');
      });

      // 监听子进程标准错误结果
      echo.stderr.on('data', (data) => {
        reject(new Error(data.toString('utf-8')));
      });

      // 监听子进程退出, 并返回进程执行结果
      echo.on('close', (code) => {
        result.exitCode = code;
        resolve(result);
      });
    });

    // 确认进程执行结果
    expect(result.exitCode).toEqual(0);
    expect(result.stdout).toEqual('Hello World');
  });

  /**
   * 同步启动子进程, 并通过标准输出获取进程执行结果
   *
   * 通过 `spawnSync` 函数同步启动子进程, 当子进程执行完毕后, `spawnSync` 函数方可返回, 结果中包含进程执行结果
   */
  it('should start child-process synchronized', async () => {
    const ctrl = new AbortController();
    const { signal } = ctrl;

    // 设置超时后结束进程
    setTimeout(() => ctrl.abort(), 1000);

    // 启动进程, 执行 `echo` 命令
    const result = spawnSync('echo', ['-n', 'Hello World'], { signal });

    // 确认进程执行结果
    expect(result.status).toEqual(0);
    expect(result.stdout.toString('utf-8')).toEqual('Hello World');
  });

  /**
   * 测试子进程的启动选项
   */
  it('should start child-process with options', async () => {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));

    const ctrl = new AbortController();
    const { signal } = ctrl;

    // 设置超时后结束进程
    setTimeout(() => ctrl.abort(), 1000);

    // 启动进程, 执行 `echo` 命令
    const echo = spawn('echo', ['-n', 'Hello World'], {
      // 子进程的工作目录
      cwd: __dirname,

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

    // 实例化异步对象并等待其执行完毕, 返回执行结果
    const result = await new Promise((resolve, reject) => {
      const result = {
        exitCode: null,
        stdout: null,
      };

      // 监听子进程标准输出结果
      echo.stdout.on('data', (data) => {
        result.stdout = data.toString('utf-8');
      });

      // 监听子进程标准错误结果
      echo.stderr.on('data', (data) => {
        reject(new Error(data.toString('utf-8')));
      });

      // 监听子进程退出, 并返回进程执行结果
      echo.on('close', (code) => {
        result.exitCode = code;
        resolve(result);
      });
    });

    // 确认子进程执行结果
    expect(result.stdout).toEqual('Hello World');
  });
});
