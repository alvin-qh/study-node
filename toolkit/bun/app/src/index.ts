import { close, start } from 'bun-http-server';
import { welcome } from 'bun-lib';

async function main(): Promise<void> {
  console.log(welcome());

  await start(5001, '0.0.0.0');

  process.on('SIGINT', async () => {
    await close();
    process.exit();
  });
}

await main();
