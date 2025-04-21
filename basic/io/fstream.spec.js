import { expect } from 'chai';

import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

import * as fstream from './fstream.js';

// 在 ES Module 模式下, `__dirname` 常量不存在, 故需要自行定义
const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * 测试 `fstream` 模块
 */
describe("test 'fstream' module", () => {
  /**
   * 测试通过 "事件" 方式异步读写文件
   *
   * @see `./fstream.js`
   */
  it("should 'FileOutputStream' and 'FileInputStream' type worked", async () => {
    const filename = path.join(__dirname, 'test.txt');

    // 准备要写入文件的数据
    const data = Buffer.from('Hello, 大家好', 'utf-8');

    try {
      // 创建文件输出流
      const os = new fstream.FileOutputStream(filename);
      try {
        // 向文件写入内容
        await os.write(data);
      }
      finally {
        // 关闭输出流
        await os.close();
      }

      // 创建文件输入流
      const is = new fstream.FileInputStream(filename);
      try {
        // 从文件中读取内容
        const buf = await is.read();

        // 确认读取内容和写入内容一致
        expect(buf).to.deep.eq(data);
      }
      finally {
        // 关闭输入流
        is.close();
      }
    }
    finally {
      // 删除测试文件
      await fs.promises.unlink(filename);
    }
  });
});
