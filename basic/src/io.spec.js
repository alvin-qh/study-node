const { expect } = require("chai");
const { describe, it } = require("mocha");
const path = require("path");
const fs = require("fs");
const fse = require("fs-extra");
const crypto = require("crypto");

/**
 * 测试 IO 操作
 */
describe("test 'path' module", () => {
  /**
   * 将表示路径的字符串规范化
   */
  it("should normalize a path", () => {
    const dir = "a/b/c/../d";

    const normalized = path.normalize(dir);
    expect(normalized).to.eq("a/b/d");
  });

  /**
   * 将多个路径连接成一个路径
   */
  it("should join paths", () => {
    const dir1 = "a/b/c";
    const dir2 = "../x/y";
    const file = "foo.txt";

    const joined = path.join(dir1, dir2, file);
    expect(joined).to.eq("a/b/x/y/foo.txt");
  });

  /**
   * 获取相对路径对应的绝对路径
   */
  it("should get absolute path by relative path", () => {
    const dir = "../a/b/c";

    const absDir = path.resolve(dir);
    expect(absDir).to.eq(path.join(path.join(__dirname, "../../a/b/c")));
  });

  /**
   * 获取相对路径对应的绝对路径
   */
  it("should get relative path by absolute path", () => {
    const dir = path.join(__dirname, "a/b/c");

    // 获取 dir 路径相对于 __dirname 路径的相对路径
    const relative = path.relative(__dirname, dir);
    expect(relative).to.eq("a/b/c");
  });

  /**
   * 获取所给路径的目录名部分
   */
  it("should get directory name of given path", () => {
    const fullpath = "a/b/c/d.txt";

    const dirname = path.dirname(fullpath);
    expect(dirname).to.eq("a/b/c");
  });

  /**
   * 获取所给路径的文件名部分
   */
  it("should get file name of given path", () => {
    const fullpath = "a/b/c/d.txt";

    const basename = path.basename(fullpath);
    expect(basename).to.eq("d.txt");
  });

  /**
   * 获取文件扩展名部分
   */
  it("should get file extenstion name of given path", () => {
    const fullpath = "a/b/c/d.txt";

    const extname = path.extname(fullpath);
    expect(extname).to.eq(".txt");
  });
});

/**
 * 测试文件操作
 * 
 * `fs` 模块的一系列方法可以以"同步"方式操作文件, 而 `fs.promises` 模块下面的同名方法则可以用异步方式 (`Promise`) 操作文件
 */
describe("test file operates", () => {
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
   * 测试路径是否存在
   */
  it("should check if a path is exist", async () => {
    let r = await exist(path.join(__dirname, "io.spec.js"));
    expect(r).to.be.true;

    r = await exist(path.join(__dirname, "..", "io.spec.js"));
    expect(r).to.be.false;
  });

  /**
   * 创建不存在的文件
   * 
   * @param {string} filename 要创建的文件路径名
   * @returns {Promise<void>} 异步对象
   */
  async function touch(filename) {
    fs.close((await fs.promises.open(filename, "w")).fd);
  }

  /**
   * 测试创建和删除文件
   */
  it("should create and remove file", async () => {
    const filename = path.join(__dirname, "test.txt");

    try {
      await touch(filename);
      expect(await exist(filename)).to.be.true;
    } finally {
      await fs.promises.unlink(filename);
    }
  });

  /**
   * 测试创建和删除目录
   * 
   * 注意, 本例中使用的目录删除方法仅能删除空目录
   */
  it("should create and remove directory", async () => {
    const dirname = path.join(__dirname, "test");

    try {
      await fs.promises.mkdir(dirname);
      expect(await exist(dirname)).to.be.true;
    } finally {
      await fs.promises.rmdir(dirname);
    }
  });

  /**
   * 测试递归方式创建和删除目录
   * 
   * 所谓递归方式, 即创建和删除目录时, 会包含其子目录
   */
  it("should create and remove directory include subs", async () => {
    const basedir = path.join(__dirname, "test");
    const dir = path.join(basedir, "a/b");

    try {
      await fse.mkdirs(dir);
    } finally {
      await fse.remove(basedir);
    }
  });

  /**
   * 测试文件读写
   */
  it("should write and read a file", async () => {
    const filename = path.join(__dirname, "test.txt");

    try {
      // 向指定文件写入内容, 如果文件不存在则创建文件, 如果文件存在, 则覆盖文件
      await fs.promises.writeFile(filename, Buffer.from("Hello", "utf-8"));
      // 向文件中追加内容, 如果文件不存在则操作失败
      await fs.promises.appendFile(filename, Buffer.from(", 大家好", "utf-8"));

      // 从文件中读取全部内容, 返回保存文件内容的字节缓存, 确认和写入文件的内容一致
      const data = await fs.promises.readFile(filename);
      expect(data.toString("utf-8")).to.eq("Hello, 大家好")

      // 从文件中读取全部内容, 以字符串形式返回文件内容
      const s = await fs.promises.readFile(filename, "utf-8");
      expect(s).to.eq("Hello, 大家好");
    } finally {
      // 删除文件
      await fs.promises.unlink(filename);
    }
  });

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

  /**
   * 测试底层文件读写接口
   */
  it("should write and read file by low level IO interface", async () => {
    const filename = path.join(__dirname, "test.txt");

    // 按给定文件路径名创建文件, 并允许对文件进行写入和追加内容操作
    let file = await File.create(filename, "w+");

    // 准备要写入文件的数据
    const data = Buffer.from('Hello, 大家好', 'utf-8');

    try {
      // 将数据写入文件, 确认共写入 16 字节
      const nw = await file.write(data);
      expect(nw).to.eq(16);

      // 以只读模式重新打开文件, 生成新的文件对象
      file = await File.create(filename, "r");

      // 分配 nw (16) 字节的缓存对象
      const buf = Buffer.alloc(nw);

      // 从文件 0 位置开始, 读取 16 字节内容, 写入缓存对象 0 开始的位置
      const nr = await file.read(buf);
      // 确认读取长度和写入长度一致
      expect(nr).to.eq(nw)
      // 确认读取和写入内容一致
      expect(buf).to.deep.eq(data);
    } finally {
      // 关闭文件
      await file.close();
      
      // 删除测试文件
      await fs.promises.unlink(filename);
    }
  });
});

/**
 * 测试缓存类型
 */
describe("test 'Buffer' type", () => {
  /**
   * 测试将缓存数据转为字符串
   */
  it("should convert to string", () => {
    const s = "Hello 大家好";

    // 通过字符串创建缓冲区
    let buf = Buffer.from(s, "utf-8");

    // 将缓冲区内容写入数组
    const data = [...buf];

    // 从数组中读取内容形成缓存对象
    buf = Buffer.from(data);
    // 将缓存对象转为字符串, 确认和原字符串相同
    expect(buf.toString("utf-8")).to.eq(s);
  });

  /**
   * 测试通过缓存对象读写数据
   */
  it("should read and write data by 'Buffer' object", () => {
    const s = "Hello, 大家好";

    // 创建长度为 4 字节的长度缓存对象
    const wb1 = Buffer.alloc(4);

    // 从字符串创建缓存对象
    const wb2 = Buffer.from(s, "utf-8");
    // 将字符串缓存对象的长度写入长度缓存对象
    wb1.writeInt32BE(wb2.byteLength);

    // 求字符串缓存对象的散列值, 得到散列值缓存对象
    const wb3 = crypto.createHash("MD5").update(wb2).digest();

    // 将上面的三个缓存对象合并为一个缓存对象
    const data = Buffer.concat([wb1, wb2, wb3]);

    // 从缓存对象中读取前四字节, 为字符串长度
    const len = data.readInt32BE(0);
    // 从缓存对象中第 5 个字节开始, 按已知长度读取字符串
    const rb1 = data.subarray(4, 4 + len);
    // 从缓存对象中读取字符串之后的散列值
    const rb2 = data.subarray(4 + len);

    // 确认字符串读取正确
    expect(rb1.toString("utf-8")).to.eq(s);
    // 确认读取的内容和读取的散列值匹配
    expect(rb2).to.deep.eq(crypto.createHash("MD5").update(rb1).digest());
  });

  // 测试 base64 编码
  it("should encode and decode by 'base64'", () => {
    const data = Buffer.from("Hello, 大家好", "utf-8");

    // 将缓存对象编码为 base64 字符串
    const b64 = data.toString("base64");

    // 确认编码结果为 base64 字符串
    const match = /^[a-zA-Z0-9+/=]{24}$/.test(b64);
    expect(match).to.be.true;

    // 将 base64 字符串进行解码, 得到缓存对象
    const buf = Buffer.from(b64, "base64");
    expect(buf).to.deep.eq(data);
  });
});
