import { execute as broadcastExec } from './broadcast.js';
import { execute as channelExec } from './channel.js';
import { execute as eventExec } from './event.js';
import { execute as messageExec } from './message.js';
import { execute as workerExec } from './worker.js';

/**
 * 测试工作线程
 */
describe('test working thread', () => {
  /**
   * 测试在工作线程中执行函数
   *
   * @see worker.js
   */
  it('should execute function in working thread', async () => {
    const result = await workerExec(10000);

    expect(result).toHaveLength(1229);
    expect(result[0]).toEqual(2);
    expect(result[result.length - 1]).toEqual(9973);
  });

  /**
   * 测试工作线程中的事件通信
   *
   * @see event.js
   */
  it('should send and receive message between work thread and main thread', async () => {
    const result = await eventExec(['A', 'B', 'C', 'D']);

    expect(result).toHaveLength(4);
    expect(result).toEqual([
      "received 'A from work thread'",
      "received 'B from work thread'",
      "received 'C from work thread'",
      "received 'D from work thread'",
    ]);
  });

  /**
   * 测试将消息发送到指定线程
   *
   * @see message.js
   */
  it('should send message to other thread', async () => {
    const result = await messageExec(['A', 'B', 'C', 'D']);

    expect(result.data).toEqual([
      `message coming: from ${result.source}, data: A`,
      `message coming: from ${result.source}, data: B`,
      `message coming: from ${result.source}, data: C`,
      `message coming: from ${result.source}, data: D`,
    ]);
  });

  /**
   * 测试线程中的信息广播
   *
   * @see broadcast.js
   */
  it('should send broadcast message', async () => {
    const result = await broadcastExec(10);

    expect(result).toHaveLength(10);
    for (const r of result) {
      expect(r).toMatch(/worker ([1-9]|10) done/);
    }
  });

  /**
   * 测试通过 `MessageChannel` 发送和接收消息
   *
   * @see channel.js
   */
  it('should send and receive message by chanel port', async () => {
    const result = await channelExec(['A', 'B', 'C', 'D']);

    expect(result.data).toHaveLength(4);
    expect(result.data).toEqual([
      'received message data A',
      'received message data B',
      'received message data C',
      'received message data D',
    ]);
  });
});
