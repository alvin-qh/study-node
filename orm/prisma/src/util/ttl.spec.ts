import '../root.spec';

import { expect } from 'chai';

import {
  countTables,
  listTables,
} from './ttl';

/**
 * 测试 `util` 模块
 */
describe('Test `util.ttl` module', () => {
  /**
   * 测试 `createTables` 函数创建数据表
   */
  it('should `executeSqlScript` function create all tables', async () => {
    // 获取数据库中的所有数据表, 确认数据表是否创建成功
    const tables = await listTables();
    expect(tables).is.contains('user', 'project');
  });

  /**
   * 测试 `truncateTables` 函数清空数据表
   */
  it('should `truncateTables` function clear all data in tables', async () => {
    // 获取指定数据表数据量
    const recordCounts = await countTables('user', 'project');
    expect(recordCounts).has.length(2);
    expect(recordCounts.get('user')).is.eq(0n);
    expect(recordCounts.get('project')).is.eq(0n);
  });
});
