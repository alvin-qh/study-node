import { close, start } from './http/server.js';

/**
 * 入口函数
 */
async function main() {
  await start(3000);
  console.log('Server is started at http://localhost:3000');

  process.on('SIGINT', async () => {
    try {
      await close();
      console.log('\nServer is shutdown');
    } catch {
      // 忽略关闭错误
    }
  });
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
