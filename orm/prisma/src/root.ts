import { misc, ttl } from './util';

import { config } from 'dotenv';
config();

/**
 * 初始化测试
 */
beforeAll(async () => {
  // 如果未创建测试表格, 则创建测试表格
  await misc.whenStateNotExistAsync('created', async () => {
    await ttl.executeSqlScript('tables.sql');
    misc.saveState('created', true);
  });
});

/**
 * 在每次测试前执行
 */
beforeEach(async () => {
  await ttl.truncateTables('project', 'user');
});
