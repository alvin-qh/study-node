import { expect } from 'chai';

import { argumentsFunc } from './arguments.js';
import { simpleFunc } from './simple.js';

/**
 * 测试 Node 插件系统
 */
describe("test addon for node with 'napi' interface", () => {
  /**
   * 测试从 C++ 导出变量
   */
  it('should export function from C++ module', () => {
    expect(simpleFunc()).to.eq('Hello World');
  });

  it('should pass arguments to exported C++ function', () => {
    expect(argumentsFunc(100, 200)).to.eq(300);
  });
});
