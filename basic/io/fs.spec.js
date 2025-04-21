import { expect } from 'chai';

import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

import * as fse from 'fs-extra';

import * as file from './file.js';

// 在 ES Module 模式下, `__dirname` 常量不存在, 故需要自行定义
const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * 测试文件操作
 *
 * `fs` 模块的一系列方法可以以"同步"方式操作文件, 而 `fs.promises` 模块下面的同名方法则可以用异步方式 (`Promise`) 操作文件
 */
describe("test 'fs' module", () => {
  /**
   * 测试路径是否存在
   */
  it("should given path 'exist'", async () => {
    let r = await file.exist(path.join(__dirname, 'fs.spec.js'));
    expect(r).is.true;

    r = await file.exist(path.join(__dirname, '../io.spec.js'));
    expect(r).is.false;
  });

  /**
   * 测试创建和删除文件
   *
   * @see `./file.js`
   */
  it("should 'touch' and 'unlink' file", async () => {
    const filename = path.join(__dirname, 'test.txt');

    try {
      await file.touch(filename);
      expect(await file.exist(filename)).is.true;
    }
    finally {
      await fs.promises.unlink(filename);
    }
  });

  /**
   * 测试创建和删除目录
   *
   * 注意, 本例中使用的目录删除方法仅能删除空目录
   */
  it("should 'mkdir' and 'rmdir' directory", async () => {
    const dirname = path.join(__dirname, 'test');

    try {
      await fs.promises.mkdir(dirname);
      expect(await file.exist(dirname)).is.true;
    }
    finally {
      await fs.promises.rmdir(dirname);
    }
  });

  /**
   * 测试递归方式创建和删除目录
   *
   * 所谓递归方式, 即创建和删除目录时, 会包含其子目录
   */
  it("should 'mkdirs' and 'remove' directories", async () => {
    const basedir = path.join(__dirname, 'test');
    const dir = path.join(basedir, 'a/b');

    try {
      await fse.mkdirs(dir);
    }
    finally {
      await fse.remove(basedir);
    }
  });

  /**
   * 测试文件读写
   */
  it("should 'readFile', 'writeFile' and 'appendFile' in premiss mode", async () => {
    const filename = path.join(__dirname, 'test.txt');

    try {
      // 向指定文件写入内容, 如果文件不存在则创建文件, 如果文件存在, 则覆盖文件
      await fs.promises.writeFile(filename, Buffer.from('Hello', 'utf-8'));
      // 向文件中追加内容, 如果文件不存在则操作失败
      await fs.promises.appendFile(filename, Buffer.from(', 大家好', 'utf-8'));

      // 从文件中读取全部内容, 返回保存文件内容的字节缓存, 确认和写入文件的内容一致
      const data = await fs.promises.readFile(filename);
      expect(data.toString('utf-8')).to.eq('Hello, 大家好');

      // 从文件中读取全部内容, 以字符串形式返回文件内容
      const s = await fs.promises.readFile(filename, 'utf-8');
      expect(s).to.eq('Hello, 大家好');
    }
    finally {
      // 删除文件
      await fs.promises.unlink(filename);
    }
  });

  /**
   * 测试底层文件读写接口
   *
   * @see `./file.js`
   */
  it("should 'File' object worked", async () => {
    const filename = path.join(__dirname, 'test.txt');

    // 准备要写入文件的数据
    const data = Buffer.from('Hello, 大家好', 'utf-8');

    try {
      // 按给定文件路径名创建文件, 并允许对文件进行写入和追加内容操作
      const fw = await file.File.create(filename, 'w+');
      try {
        // 将数据写入文件, 确认共写入 16 字节
        const n = await fw.write(data);
        expect(n).to.eq(16);
      }
      finally {
        // 关闭文件
        await fw.close();
      }

      // 创建用于读取文件的文件对象
      const fr = await file.File.create(filename, 'r');
      try {
        // 分配 nw (16) 字节的缓存对象
        const buf = Buffer.alloc(await fr.size());
        expect(buf.byteLength).to.eq(16);

        // 从文件 0 位置开始, 读取 16 字节内容, 写入缓存对象 0 开始的位置, 确认读取长度和写入长度一致
        const n = await fr.read(buf);
        expect(n).to.eq(16);

        // 确认读取和写入内容一致
        expect(buf).to.deep.eq(data);
      }
      finally {
        // 关闭文件
        await fr.close();
      }
    }
    finally {
      // 删除测试文件
      await fs.promises.unlink(filename);
    }
  });

  /**
   * 测试对路径进行监听操作
   */
  it("should 'watch' file", async () => {
    const options = {
      // recursive: true,
      encoding: 'utf-8',
    };

    // 用于记录每个文件发生事件的对象
    const events = {
      /**
       * 添加一条事件记录
       *
       * @param {string} event 事件名称
       * @param {string} filename 引发事件的文件名称
       * @returns
       */
      append(event, filename) {
        const item = this[filename];
        if (!item) {
          this[filename] = {
            event: [event],
            file: filename,
          };
          return;
        }
        item.event.push(event);
      },
    };

    // 在指定路径开启监听， 监听该路径的文件变化
    const watcher = fs.watch(__dirname, options, (opt, filename) => {
      console.log(`\t${filename} has been ${opt}`);
      // 将发生的变化进行保存
      events.append(opt, filename);
    });

    // 监听路径变化事件
    watcher.on('change', (opt, filename) => {
      console.log(`\t${filename} trigger ${opt} event`);
    });

    // 生成文件路径名
    const filename = path.join(__dirname, 'test.txt');

    // 准备要写入文件的数据
    const data = Buffer.from('Hello, 大家好', 'utf-8');

    // 对指定监听目录进行一系列操作
    // 创建文件
    const fh = await file.touch(filename, 'w', true);
    try {
      // 写入文件
      await fs.promises.writeFile(fh, data);

      // 向文件添加数据
      await fs.promises.appendFile(fh, data);
    }
    finally {
      // 关闭文件句柄
      await fh.close();

      // 删除测试文件
      await fs.promises.unlink(filename);

      // 关闭目录监听
      watcher.close();
    }

    // 从路径中获取文件名
    const key = path.basename(filename);

    // 确认指定文件监听到了 4 个事件
    expect(events[key].event).to.have.length(4);
    expect(events[key].event).to.deep.eq(['rename', 'change', 'change', 'rename']);
  });
});
