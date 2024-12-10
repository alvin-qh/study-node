import { expect } from 'chai';

import main from './index';

/**
 * 测试导入的 `index.js` 模块
 */
describe('test `./index` module', () => {
  /**
   * 测试导入的 `main` 函数
   */
  it('test `main` function', async () => {
    const srcLog = console.log;
    try {
      let content = '';
      console.log = (c) => { content = c; }

      await main();
      expect(content).is.eq('Hello Babel, the repo version is: babel-lib@1.0.0');
    } finally {
      console.log = srcLog;
    }
  });
});
