import { start } from './server/index';


async function main(): Promise<void> {
  const stop = start();
  return new Promise((resolve) => {
    process.on('SIGINT', () => {
      stop();
      resolve();
    });
  });
}

main().then(() => {
  console.log('服务已关闭');
  process.exit();
}).catch((err) => {
  console.error('服务启动失败', err);
  process.exit(1);
});
