import { expect } from 'chai';

import { version } from './utils';

/**
 * 测试 module 下面的 misc 模块
 */
describe('test `npm-lib` module', () => {
  /**
   * 测试 misc 模块下的 add 函数
   */
  it('should `version` function worked', async () => {
    const ver = await version();
    expect(ver).to.eq('yarn-lib@1.0.0');
  });
});
