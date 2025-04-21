import * as fs from 'node:fs';

/**
 * 文件流超类
 */
class FileStream {
  /**
   * 通过文件流构建对象
   *
   * @param {fs.ReadStream|fs.WriteStream} stream 文件流对象
   * @param {string} encoding 文件内容编码格式
   */
  constructor(stream, encoding) {
    // 设置流默认编码
    if (encoding) {
      stream.setDefaultEncoding(encoding);
    }

    this._stream = stream;
  }

  /**
   * 关闭文件流对象
   *
   * @returns {Promise<void>} 异步调用
   */
  async close() {
    return new Promise((resolve, reject) => {
      if (!this._stream || this._stream.closed) {
        resolve();
      }

      this._stream.close((err) => {
        if (err) {
          reject(err);
        }
        else {
          resolve();
        }
      });
    });
  }
}

/**
 * 文件输入流, 即从文件中读取内容的流
 */
export class FileInputStream extends FileStream {
  /**
   * 构造器
   *
   * @param {string} filename 文件名
   * @param {string} encoding 文件内容编码方式, `null` 表示不进行解码, 读取原始 byte
   */
  constructor(filename, encoding = null) {
    // 创建读取流, 保存流对象
    super(fs.createReadStream(filename), encoding);
  }

  /**
   * 对文件流进行读操作
   *
   * @param {encoding} encoding 文件内容编码方式, `null` 表示不进行解码, 读取原始 byte
   * @returns {Promise<Buffer|string>} 返回读取内容
   */
  async read(encoding = null) {
    // 返回异步对象
    return new Promise((resolve, reject) => {
      // 定义 error 事件处理函数
      const onError = err => reject(err);

      const chunks = [];
      // 定义 data 事件处理函数
      const onData = chunk => chunks.push(chunk);

      // 定义 end 事件处理函数
      const onEnd = () => {
        // 取消之前定义的事件监听
        this._stream.off('data', onData);
        this._stream.off('error', onError);
        this._stream.off('end', onEnd);

        // 将读取内容进行合并
        let data = Buffer.concat(chunks);
        if (encoding) {
          // 如果需要, 对读取内容进行解码
          data = data.toString(encoding);
        }
        // 返回读取数据内容
        resolve(data);
      };

      // 注册各类事件监听
      this._stream.on('error', onError);
      this._stream.on('data', onData);
      this._stream.on('end', onEnd);
    });
  }
}

/**
 * 文件输出流, 即将内容写入文件的流
 */
export class FileOutputStream extends FileStream {
  /**
   * 构造器
   *
   * @param {string} filename 文件路径名
   * @param {string} encoding 文件内容编码格式
   */
  constructor(filename, encoding = null) {
    // 创建写入流, 保存流对象
    super(fs.createWriteStream(filename), encoding);
  }

  /**
   * 向文件写入内容
   *
   * @param {Buffer|string} data 待写入文件的数据内容
   * @param {string} encoding 内容编码格式
   * @returns {Promise<number>} 写入的数据长度
   */
  async write(data, encoding = null) {
    // 返回异步对象
    return new Promise((resolve, reject) => {
      // 定义 error 事件处理函数
      const onError = err => reject(err);

      // 定义 finish 事件处理函数
      const onFinish = () => {
        // 取消事件监听
        this._stream.off('error', onError);
        this._stream.off('finish', onFinish);

        // 返回实际写入的字节数
        resolve(this._stream.bytesWritten);
      };

      // 注册事件监听函数
      this._stream.on('error', onError);
      this._stream.on('finish', onFinish);

      // 如果需要, 对数据进行编码
      if (encoding != null) {
        data = Buffer.from(data, encoding);
      }

      // 写入数据
      this._stream.write(data);
      // 结束数据写入
      this._stream.end();
    });
  }
}
