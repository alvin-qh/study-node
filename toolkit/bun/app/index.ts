import { close, start } from 'bun-server';

import { welcome } from 'bun-lib';

/**
 * 入口函数
 */
async function main(): Promise<void> {
  // 调用 `bin-lib` 模块下的函数
  console.log(welcome());

  // 调用 `http-server` 包下的函数, 启动 http 服务器
  await start(5001, '0.0.0.0');

  // 等待进程结束信号, 关闭 http 服务器
  process.on('SIGINT', async () => {
    try {
      await close();
    } catch {
      // do nothing
    }
    process.exit();
  });
}

// 启动程序
await main();
