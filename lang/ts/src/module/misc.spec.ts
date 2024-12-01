import { expect } from 'chai';

import { add } from './misc';

// 在 esModule 模式下, 如果需要通过 `tsc` 命令将 `ts` 脚本编译为 `js` 脚本, 则在 `import` 是需要加上 `.js` 扩展名, 否则编译后的结果无法正确执行 `import`
// import { add } from './misc.js';

/**
 * 测试 module 下面的 misc 模块
 */
describe('Test `misc` in module', () => {
  /**
   * 测试 misc 模块下的 add 函数
   */
  it('should `add` function returned sum of two numbers', () => {
    expect(add(10, 20)).to.eq(30);
  });
});
