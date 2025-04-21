/**
 * 进程函数, 通过标准输出输出字符串内容, 通过进程消息通信向主进程发送数据消息
 *
 * @param {string} name 姓名参数
 * @param {Array<string>} data 数据集合参数
 * @returns {Promise<{message: string, data: string}>} 返回进程异步对象
 */
async function runChildProcess(name, data) {
  return new Promise((resolve, reject) => {
    try {
      // 通过标准输出输出字符串
      console.log(`child-process was started, 'Hello ${name}'`);

      let n = 0;
      const timer = setInterval(() => {
        if (n >= data.length) {
          clearInterval(timer);

          // 退出子进程
          resolve();
        }
        else {
          // 向主进程发送数据消息
          process.send({ message: 'data', data: data[n] });
          n++;
        }
      }, 50);
    }
    catch (e) {
      // 捕获进程执行异常, 包括 `AbortException`
      reject(e);
    }
  });
}

// 当环境变量中包含 `CHILD` 变量时, 表示当前文件由子进程执行
if (process.env.CHILD === '1') {
  // 获取进程参数, 为一个字符串数组
  const [name, data] = process.argv.slice(2);

  // 调用进程函数
  await runChildProcess(name, data.split(','));
}
