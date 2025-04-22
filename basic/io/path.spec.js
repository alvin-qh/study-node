import { expect } from '@jest/globals';

import { fileURLToPath } from 'node:url';
import path from 'node:path';

// 在 ES Module 模式下, `__dirname` 常量不存在, 故需要自行定义
const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * 测试 IO 操作
 */
describe("test 'path' module", () => {
  /**
   * 测试 `__dirname` 全局量是否指向正确的路径
   */
  it("should '__dirname' variable has correct value", () => {
    expect(__dirname).toEqual(path.resolve('./io'));
  });

  /**
   * 将表示路径的字符串规范化
   */
  it("should 'normalize' a path", () => {
    const dir = './a/b/c/../d';

    const normalized = path.normalize(dir);
    expect(normalized).toEqual('a/b/d');
  });

  /**
   * 将多个路径连接成一个路径
   */
  it("should 'join' paths", () => {
    const dir1 = 'a/b/c';
    const dir2 = '../x/y';
    const filename = 'foo.txt';

    const joined = path.join(dir1, dir2, filename);
    expect(joined).toEqual('a/b/x/y/foo.txt');
  });

  /**
   * 获取相对路径对应的绝对路径
   */
  it("should 'resolve' relative path to absolute path", () => {
    const dir = '../a/b/c';

    const absDir = path.resolve(dir);
    expect(absDir).toEqual(path.join(path.join(__dirname, '../../a/b/c')));
  });

  /**
   * 获取一个路径相对于另一个路径的相对路径
   */
  it("should get 'relative' one path from another", () => {
    const dir = path.join(__dirname, 'a/b/c');

    // 获取 dir 路径相对于 __dirname 路径的相对路径
    const relative = path.relative(__dirname, dir);
    expect(relative).toEqual('a/b/c');
  });

  /**
   * 获取所给路径的目录名部分
   */
  it("should get 'dirname' of given path", () => {
    const fullpath = 'a/b/c/d.txt';

    const dirname = path.dirname(fullpath);
    expect(dirname).toEqual('a/b/c');
  });

  /**
   * 获取所给路径的文件名部分
   */
  it("should file 'basename' of given path", () => {
    const fullpath = 'a/b/c/d.txt';

    const basename = path.basename(fullpath);
    expect(basename).toEqual('d.txt');
  });

  /**
   * 获取文件扩展名部分
   */
  it("should get file 'extname' of given path", () => {
    const fullpath = 'a/b/c/d.txt';

    const extname = path.extname(fullpath);
    expect(extname).toEqual('.txt');
  });
});
