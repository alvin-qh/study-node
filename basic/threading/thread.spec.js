import { expect } from 'chai';

import { execute as broadcastExec } from './broadcast.js';
import { execute as messageExec } from './message.js';
import { execute as workerExec } from './worker.js';

/**
 * 测试工作线程
 */
describe('test working thread', () => {
  /**
   * 测试在工作线程中执行函数
   */
  it('should execute function in working thread', async () => {
    const result = await workerExec(10000);

    expect(result).to.have.length(1229);
    expect(result[0]).to.eq(2);
    expect(result[result.length - 1]).to.eq(9973);
  });

  /**
   * 测试将消息发送到指定线程
   */
  it('should send message to other thread', async () => {
    const result = await messageExec(['A', 'B', 'C', 'D']);
    expect(result.data).to.deep.eq([
      `message coming: from ${result.source}, data: A`,
      `message coming: from ${result.source}, data: B`,
      `message coming: from ${result.source}, data: C`,
      `message coming: from ${result.source}, data: D`,
    ]);
  });

  /**
   * 测试线程中的信息广播
   */
  it('should send broadcast message', async () => {
    const result = await broadcastExec(10);

    expect(result).to.have.length(10);
    for (const r of result) {
      expect(r).to.match(/worker ([1-9]|10) done/);
    }
  });
});
