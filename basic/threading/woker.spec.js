import { expect } from 'chai';

import { executor } from './worker.js';

/**
 * 测试工作线程
 */
describe('test working thread', () => {
  /**
   * 测试在工作线程中执行函数
   */
  it('should execute function in working thread', async () => {
    const result = await executor(10000);

    expect(result).to.have.length(1229);
    expect(result[0]).to.eq(2);
    expect(result[result.length - 1]).to.eq(9973);
  });
});
