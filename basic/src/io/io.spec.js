import { describe, it } from 'mocha';
import { expect } from 'chai';

import * as crypto from 'node:crypto';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

import * as fse from 'fs-extra';
import { glob } from 'glob';

import * as file from './file.js';
import * as fstream from './fstream.js';

// 在 ES Module 模式下, `__dirname` 常量不存在, 故需要自行定义
if (!global.__dirname) {
  global.__dirname = path.dirname(fileURLToPath(import.meta.url));
}

/**
 * 测试 IO 操作
 */
describe('test `path` module', () => {
  /**
   * 测试 `__dirname` 全局量是否指向正确的路径
   */
  it('should `__dirname` variable has correct value', () => {
    expect(__dirname).is.eq(path.resolve('./src/io'));
  });

  /**
   * 将表示路径的字符串规范化
   */
  it('should `normalize` a path', () => {
    const dir = './a/b/c/../d';

    const normalized = path.normalize(dir);
    expect(normalized).is.eq('a/b/d');
  });

  /**
   * 将多个路径连接成一个路径
   */
  it('should `join` paths', () => {
    const dir1 = 'a/b/c';
    const dir2 = '../x/y';
    const filename = 'foo.txt';

    const joined = path.join(dir1, dir2, filename);
    expect(joined).is.eq('a/b/x/y/foo.txt');
  });

  /**
   * 获取相对路径对应的绝对路径
   */
  it('should `resolve` relative path to absolute path', () => {
    const dir = '../a/b/c';

    const absDir = path.resolve(dir);
    expect(absDir).is.eq(path.join(path.join(__dirname, '../../../a/b/c')));
  });

  /**
   * 获取一个路径相对于另一个路径的相对路径
   */
  it('should get `relative` one path from another', () => {
    const dir = path.join(__dirname, 'a/b/c');

    // 获取 dir 路径相对于 __dirname 路径的相对路径
    const relative = path.relative(__dirname, dir);
    expect(relative).is.eq('a/b/c');
  });

  /**
   * 获取所给路径的目录名部分
   */
  it('should get `dirname` of given path', () => {
    const fullpath = 'a/b/c/d.txt';

    const dirname = path.dirname(fullpath);
    expect(dirname).is.eq('a/b/c');
  });

  /**
   * 获取所给路径的文件名部分
   */
  it('should file `basename` of given path', () => {
    const fullpath = 'a/b/c/d.txt';

    const basename = path.basename(fullpath);
    expect(basename).is.eq('d.txt');
  });

  /**
   * 获取文件扩展名部分
   */
  it('should get file `extname` of given path', () => {
    const fullpath = 'a/b/c/d.txt';

    const extname = path.extname(fullpath);
    expect(extname).is.eq('.txt');
  });
});

/**
 * 测试文件操作
 *
 * `fs` 模块的一系列方法可以以"同步"方式操作文件, 而 `fs.promises` 模块下面的同名方法则可以用异步方式 (`Promise`) 操作文件
 */
describe('test `fs/fs-extra` module', () => {
  /**
   * 测试路径是否存在
   */
  it('should given path `exist`', async () => {
    let r = await file.exist(path.join(__dirname, 'io.spec.js'));
    expect(r).is.be.true;

    r = await file.exist(path.join(__dirname, '../io.spec.js'));
    expect(r).is.be.false;
  });

  /**
   * 测试创建和删除文件
   *
   * @see `./file.js`
   */
  it('should `touch` and `unlink` file', async () => {
    const filename = path.join(__dirname, 'test.txt');

    try {
      await file.touch(filename);
      expect(await file.exist(filename)).is.true;
    } finally {
      await fs.promises.unlink(filename);
    }
  });

  /**
   * 测试创建和删除目录
   *
   * 注意, 本例中使用的目录删除方法仅能删除空目录
   */
  it('should `mkdir` and `rmdir` directory', async () => {
    const dirname = path.join(__dirname, 'test');

    try {
      await fs.promises.mkdir(dirname);
      expect(await file.exist(dirname)).is.true;
    } finally {
      await fs.promises.rmdir(dirname);
    }
  });

  /**
   * 测试递归方式创建和删除目录
   *
   * 所谓递归方式, 即创建和删除目录时, 会包含其子目录
   */
  it('should `mkdirs` and `remove` directories', async () => {
    const basedir = path.join(__dirname, 'test');
    const dir = path.join(basedir, 'a/b');

    try {
      await fse.mkdirs(dir);
    } finally {
      await fse.remove(basedir);
    }
  });

  /**
   * 测试文件读写
   */
  it('should `readFile`, `writeFile` and `appendFile` in premiss mode', async () => {
    const filename = path.join(__dirname, 'test.txt');

    try {
      // 向指定文件写入内容, 如果文件不存在则创建文件, 如果文件存在, 则覆盖文件
      await fs.promises.writeFile(filename, Buffer.from('Hello', 'utf-8'));
      // 向文件中追加内容, 如果文件不存在则操作失败
      await fs.promises.appendFile(filename, Buffer.from(', 大家好', 'utf-8'));

      // 从文件中读取全部内容, 返回保存文件内容的字节缓存, 确认和写入文件的内容一致
      const data = await fs.promises.readFile(filename);
      expect(data.toString('utf-8')).is.eq('Hello, 大家好');

      // 从文件中读取全部内容, 以字符串形式返回文件内容
      const s = await fs.promises.readFile(filename, 'utf-8');
      expect(s).is.eq('Hello, 大家好');
    } finally {
      // 删除文件
      await fs.promises.unlink(filename);
    }
  });

  /**
   * 测试底层文件读写接口
   *
   * @see `./file.js`
   */
  it('should `File` object worked', async () => {
    const filename = path.join(__dirname, 'test.txt');

    // 准备要写入文件的数据
    const data = Buffer.from('Hello, 大家好', 'utf-8');

    try {
      // 按给定文件路径名创建文件, 并允许对文件进行写入和追加内容操作
      const fw = await file.File.create(filename, 'w+');
      try {
        // 将数据写入文件, 确认共写入 16 字节
        const n = await fw.write(data);
        expect(n).is.eq(16);
      } finally {
        // 关闭文件
        await fw.close();
      }

      // 创建用于读取文件的文件对象
      const fr = await file.File.create(filename, 'r');
      try {
        // 分配 nw (16) 字节的缓存对象
        const buf = Buffer.alloc(await fr.size());
        expect(buf.byteLength).is.eq(16);

        // 从文件 0 位置开始, 读取 16 字节内容, 写入缓存对象 0 开始的位置, 确认读取长度和写入长度一致
        const n = await fr.read(buf);
        expect(n).is.eq(16);

        // 确认读取和写入内容一致
        expect(buf).is.deep.eq(data);
      } finally {
        // 关闭文件
        await fr.close();
      }
    } finally {
      // 删除测试文件
      await fs.promises.unlink(filename);
    }
  });

  /**
   * 测试对路径进行监听操作
   */
  it('should `watch` file', async () => {
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
    } finally {
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
    expect(events[key].event).has.length(4);
    expect(events[key].event).is.deep.eq(['rename', 'change', 'change', 'rename']);
  });

  /**
   * 测试通过 "事件" 方式异步读写文件
   *
   * @see `./fstream.js`
   */
  it('should `FileOutputStream` and `FileInputStream` type worked', async () => {
    const filename = path.join(__dirname, 'test.txt');

    // 准备要写入文件的数据
    const data = Buffer.from('Hello, 大家好', 'utf-8');

    try {
      // 创建文件输出流
      const os = new fstream.FileOutputStream(filename);
      try {
        // 向文件写入内容
        await os.write(data);
      } finally {
        // 关闭输出流
        await os.close();
      }

      // 创建文件输入流
      const is = new fstream.FileInputStream(filename);
      try {
        // 从文件中读取内容
        const buf = await is.read();

        // 确认读取内容和写入内容一致
        expect(buf).is.deep.eq(data);
      } finally {
        // 关闭输入流
        is.close();
      }
    } finally {
      // 删除测试文件
      await fs.promises.unlink(filename);
    }
  });
});

/**
 * 测试缓存类型
 */
describe('test `Buffer` type', () => {
  /**
   * 测试将缓存数据转为字符串
   */
  it('should create buffer `from` string', () => {
    const s = 'Hello 大家好';

    // 通过字符串创建缓冲区
    let buf = Buffer.from(s, 'utf-8');

    // 将缓冲区内容写入数组
    const data = [...buf];

    // 从数组中读取内容形成缓存对象
    buf = Buffer.from(data);

    // 将缓存对象转为字符串, 确认和原字符串相同
    expect(buf.toString('utf-8')).is.eq(s);
  });

  /**
   * 测试通过缓存对象读写数据
   */
  it('should `concat` more buffers into one', () => {
    const s = 'Hello, 大家好';

    // 创建长度为 4 字节的长度缓存对象
    const wb1 = Buffer.alloc(4);

    // 从字符串创建缓存对象
    const wb2 = Buffer.from(s, 'utf-8');

    // 将字符串缓存对象的长度写入长度缓存对象
    wb1.writeInt32BE(wb2.byteLength);

    // 求字符串缓存对象的散列值, 得到散列值缓存对象
    const wb3 = crypto.createHash('MD5').update(wb2).digest();

    // 将上面的三个缓存对象合并为一个缓存对象
    const data = Buffer.concat([wb1, wb2, wb3]);

    // 从缓存对象中读取前四字节, 为字符串长度
    const len = data.readInt32BE(0);

    // 从缓存对象中第 5 个字节开始, 按已知长度读取字符串
    const rb1 = data.subarray(4, 4 + len);

    // 从缓存对象中读取字符串之后的散列值
    const rb2 = data.subarray(4 + len);

    // 确认字符串读取正确
    expect(rb1.toString('utf-8')).is.eq(s);

    // 确认读取的内容和读取的散列值匹配
    expect(rb2).is.deep.eq(crypto.createHash('MD5').update(rb1).digest());
  });

  // 测试 base64 编码
  it('should encode and decode by `base64`', () => {
    const data = Buffer.from('Hello, 大家好', 'utf-8');

    // 将缓存对象编码为 base64 字符串
    const b64 = data.toString('base64');

    // 确认编码结果为 base64 字符串
    const match = /^[a-zA-Z0-9+/=]{24}$/.test(b64);
    expect(match).is.true;

    // 将 base64 字符串进行解码, 得到缓存对象
    const buf = Buffer.from(b64, 'base64');
    expect(buf).is.deep.eq(data);
  });
});

/**
 * 测试通过 glob 模式对文件进行检索
 */
describe('test `glob` module', () => {
  it('should find files by `glob` pattern', async () => {
    const files = await glob.glob(path.join(__dirname, '/**/*.js'));

    expect(files).has.length(3);
    expect(files.map(f => path.relative(__dirname, f))).has.contains('file.js', 'fstream.js', 'io.spec.js');
  });
});
