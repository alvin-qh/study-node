import { describe, expect, it } from 'bun:test';

import { welcome } from './welcome';

/**
 * 测试模块导入
 */
describe('test `welcome` module', () => {
  /**
   * 测试导入模块的函数
   */
  it('should `welcome` function worked', () => {
    expect(welcome()).toEqual('Welcome to Bun script');
  });
});
