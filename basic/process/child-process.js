async function runChildProcess() {
  return new Promise((resolve) => {
    console.log('Hello Child process');
    resolve();
  });
}

if (process.env.CHILD === '1') {
  const [name, age] = process.argv.slice(2);
  await runChildProcess(name, age);
}
