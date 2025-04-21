import '../root';

import { countTables, listTables } from './ttl';

/**
 * 测试 `util` 模块
 */
describe("test 'util.ttl' module", () => {
  /**
   * 测试 `createTables` 函数创建数据表
   */
  it("should 'executeSqlScript' function create all tables", async () => {
    // 获取数据库中的所有数据表, 确认数据表是否创建成功
    const tables = await listTables();
    expect(tables).toEqual(
      expect.arrayContaining([
        'user',
        'project',
      ]),
    );
  });

  /**
   * 测试 `truncateTables` 函数清空数据表
   */
  it("should 'truncateTables' function clear all data in tables", async () => {
    // 获取指定数据表数据量
    const recordCounts = await countTables('user', 'project');

    expect(recordCounts.size).toEqual(2);
    expect(recordCounts.get('user')).toEqual(0);
    expect(recordCounts.get('project')).toEqual(0);
  });
});
