import { serve, stop } from './server/core/serve';

/**
 * 入口函数
 */
function main(): void {
  // 启动服务器
  serve();

  let running = true;

  // 监听进程中断信号, 停止服务器实例
  process.on('SIGINT', async () => {
    if (!running) {
      return;
    }
    try {
      stop();
    }
    catch {
      // 忽略关闭错误
    }
    finally {
      running = false;
    }
  });
}

main();
