async function runChildProcess(name, data) {
  return new Promise((resolve, reject) => {
    try {
      console.log(`child-process was started, 'Hello ${name}'`);

      let n = 0;
      const timer = setInterval(() => {
        if (n >= data.length) {
          clearInterval(timer);

          process.send({ message: 'done' });
          resolve();
        } else {
          process.send({ message: 'data', data: data[n] });
          n++;
        }
      }, 50);
    } catch (e) {
      reject(e);
    }
  });
}

if (process.env.CHILD === '1') {
  const [name, data] = process.argv.slice(2);
  await runChildProcess(name, data.split(''));
}
