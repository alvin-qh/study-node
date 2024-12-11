import { close, start } from './dist/http/server.js';

async function main() {
  await start(3000);
  console.log('Server is started at http://localhost:3000');

  process.on('SIGINT', async () => {
    await close();
    console.log('\nServer is shutdown');
  });
}

main().catch(e => console.error(e));
