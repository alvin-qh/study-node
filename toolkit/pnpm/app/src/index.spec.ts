import { expect } from 'chai';

import { main } from './index';
/**
 * 测试导入 `./index` 模块
 */
describe('test `./index` module', () => {
  /**
   * 测试导入模块的 `main` 函数正常工作
   */
  it('test `main` function worked', async () => {
    const srcLog = console.log;

    try {
      let log = '';
      console.log = (msg: string) => {
        log += msg;
      };

      await main();

      expect(log).to.be.equal('Hello PNPM!, repo lib version is: pnpm-lib@1.0.0, workspace lib version is: pnpm-app-lib@1.0.0');
    } finally {
      console.log = srcLog;
    }
  });
});
