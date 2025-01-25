import { expect } from 'chai';

import { Demo } from './demo.js';

/**
 * 测试通过 `cmake-js` 编译的 `napi` 模块
 */
describe("test 'node-addon-api' compiled by 'cmake-js'", () => {
  /**
   * 测试从 `.node` 文件中导出 `Demo` 类
   */
  it("should export 'Demo' class from '.node' file", () => {
    const demo = new Demo('Alvin');
    expect(demo).is.not.null;

    expect(demo.value).to.eq('Alvin');
    expect(demo.toString()).to.eq('Hello CMakeJS, value is: Alvin');

    demo.value = 'Emma';
    expect(demo.toString()).to.eq('Hello CMakeJS, value is: Emma');
  });
});
