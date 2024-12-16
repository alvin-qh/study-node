import { serve, stop } from './server/core/serve';

function main(): void {
  serve();

  process.on('SIGINT', async () => {
    try {
      stop();
      console.log('\nServer is shutdown');
    } catch {
      // 忽略关闭错误
    }
  });
}

main();
