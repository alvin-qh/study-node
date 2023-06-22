const { expect } = require("chai");
const { describe, it } = require("mocha");
const path = require("path");
const fs = require("fs");
const fse = require("fs-extra");

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
});

/**
 * 测试缓冲区类型
 */
describe("test 'Buffer' type", () => {
  /**
   * 测试将缓存数据转为字符串
   */
  it("should convert to string", () => {
    const s = "Hello 大家好";

    // 通过字符串创建缓冲区
    let buf = Buffer.from(s, "UTF-8");

    // 将缓冲区内容写入数组
    const data = [...buf];

    // 从数组中读取内容形成缓存对象
    buf = Buffer.from(data);
    // 将缓存对象转为字符串, 确认和原字符串相同
    expect(buf.toString("UTF-8")).to.eq(s);
  });

});
