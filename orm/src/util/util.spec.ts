import { expect } from "chai";
import { countTable, createTables, listTables, truncateTables } from "./util";

/**
 * 测试 `util` 模块
 */
describe("Test \"util\" module", () => {
  /**
   * 测试 `createTables` 函数创建数据表
   */
  it("should \"createTables\" working", async () => {
    // 创建数据表
    await createTables();

    // 获取数据库中的所有数据表, 确认数据表是否创建成功
    const tables = await listTables();
    expect(tables).is.contains("user", "project");
  });

  /**
   * 测试 `truncateTables` 函数清空数据表
   */
  it("should \"truncateTables\" working", async () => {
    // 清空所有数据表
    await truncateTables("user", "project");

    // 获取指定数据表数据量
    const recordCounts = await countTable("user", "project");
    expect(recordCounts).has.length(2);
    expect(recordCounts.get("user")).is.eq(0);
    expect(recordCounts.get("project")).is.eq(0);
  });
});
