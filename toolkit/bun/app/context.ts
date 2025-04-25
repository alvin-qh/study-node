const now = new Date();

function padNumber(num: number): string {
  return `${num}`.padStart(2, '0');
}

global.context = {
  isDev: process.env.NODE_ENV !== 'production',
  startAt: `${now.getFullYear()}-${padNumber(now.getMonth() + 1)}-${padNumber(now.getDate())} ` +
    `${padNumber(now.getHours())}:${padNumber(now.getMinutes())}:${padNumber(now.getSeconds())}`,
}
