import dayjs from 'dayjs';

export function main(): void {
  if (process.env['npm_lifecycle_script']?.startsWith('nodemon')) {
    console.log('nodemon is watching the files!!');
  }

  const timer = setInterval(() => {
    const s = dayjs().format();
    console.log(`Now is ${s}`);
  }, 1000);

  process.on('SIGINT', async () => {
    clearTimeout(timer);
    console.log('\nStopped!!');
  });
}
