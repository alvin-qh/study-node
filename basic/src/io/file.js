const fs = require("fs");

/**
 * 判断文件是否存在
 * 
 * @param {string} filename 要检测的文件名
 * @returns {Promise<boolean>} 文件是否存在
 */
async function exist(filename) {
  try {
    // 查看
    await fs.promises.access(filename);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * 创建不存在的文件
 * 
 * @param {string} filename 要创建的文件路径名
 * @param {fs.OpenMode} [mode="r"] 
 * @param {boolean} [keepOpen=false] 是否保持文件打开
 * @returns {Promise<fs.promises.FileHandle|void>} 异步对象
 */
function touch(filename, mode = "w", keepOpen = false) {
  return new Promise((resolve, reject) => {
    fs.promises.open(filename, mode)
      .then(fh => {
        if (!keepOpen) {
          fs.close(fh.fd, () => resolve());
        } else {
          resolve(fh);
        }
      })
      .catch(err => reject(err));
  });
}

/**
 * 定义文件类
 */
class File {
  /**
   * 构造器, 通过文件句柄实例化对象
   * 
   * @param {fs.promises.FileHandle} _handle 文件对象句柄
   */
  constructor(_handle) {
    this._fh = _handle;
  }

  /**
   * 创建 `File` 类对象
   * 
   * @param {string} filename 文件路径名
   * @param {string} mode 文件打开模式
   * @returns {Promise<File>} `File` 类对象
   */
  static async create(filename, mode = "r") {
    const fh = await fs.promises.open(filename, mode);
    return new File(fh);
  }

  /**
   * 获取文件长度
   * 
   * @returns {Promise<number>} 返回文件长度
   */
  async size() {
    return new Promise((resolve, reject) => {
      fs.fstat(this._fh.fd, (err, stats) => {
        if (err) {
          reject(err);
        } else {
          resolve(stats.size);
        }
      });
    });
  }

  /**
   * 关闭打开的文件句柄
   * 
   * @returns {Promise<void>} 异步执行对象
   */
  async close() {
    return new Promise((resolve, reject) => {
      fs.close(this._fh.fd, err => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  /**
   * 向文件中写入数据
   * 
   * @param {Buffer} data 要写入的内容
   * @returns {Promise<number>} 写入的数据长度
   */
  async write(data) {
    return new Promise((resolve, reject) => {
      // 向文件写入内容
      fs.write(this._fh.fd, data, (err, n) => {
        if (err) {
          reject(err);
        } else {
          resolve(n);
        }
      });
    });
  }

  /**
   * 读取文件内容
   * 
   * @param {Buffer} buf 存储读取内容的缓存对象
   * @param {number} offset `buf` 参数的偏移量, 即读取内容存入缓存对象的起始位置
   * @param {number} len 要读取的内容长度
   * @param {fs.ReadPosition} position 文件偏移量, 即从文件的该位置开始读取
   * @returns {Promise<number>} 实际读取的长度
   */
  async read(buf, offset = 0, len = -1, position = 0) {
    if (len < 0) {
      len = buf.byteLength;
    }

    return new Promise((resolve, reject) => {
      // 读取文件内容
      fs.read(this._fh.fd, buf, offset, len, position, (err, n) => {
        if (err) {
          reject(err);
        } else {
          resolve(n);
        }
      });
    });
  }
}

module.exports = {
  exist, touch, File
}
