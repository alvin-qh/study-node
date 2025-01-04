import { expect } from 'chai';

import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

import { glob } from 'glob';

// 在 ES Module 模式下, `__dirname` 常量不存在, 故需要自行定义
const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * 测试 `glob` 模块
 */
describe("test 'glob' module", () => {
  /**
   * 测试匹配符合模式的文件
   */
  it('should find files by `glob` pattern', async () => {
    const files = await glob.glob(path.join(__dirname, '/**/*.js'));

    expect(files).has.length(8);
    expect(files.map(f => path.relative(__dirname, f))).to.contains(
      'file.js',
      'fstream.js',
      'io.spec.js',
    );
  });
});
