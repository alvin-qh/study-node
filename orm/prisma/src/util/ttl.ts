import { prisma } from '@/@prisma/connection';

import fs from 'fs';

/**
 * 执行 SQL 脚本
 *
 * @param {string} filename 要执行的脚本文件名
 * @param {string} terminator 语句结束符号, 默认为 `;`
 */
export async function executeSqlScript(filename: string, terminator: string = ';'): Promise<void> {
  // 读取脚本文件
  const fileContent = await fs.promises.readFile(filename, 'utf-8');

  // 将脚本文件通过结束符分割为多个部分
  const statements = fileContent.split(terminator).map(sql => sql.trim()).filter(sql => sql);

  // 启动事务
  await prisma.$transaction(async (tx) => {
    // 逐部分执行脚本语句
    for (const stat of statements) {
      await tx.$executeRawUnsafe(stat);
    }
  });
}

/**
 * 清空指定名称的表
 *
 * @param {string[]} tableNames 要清空的表名称集合
 */
export async function truncateTables(...tableNames: string[]): Promise<void> {
  // 启动事务
  await prisma.$transaction(async (tx) => {
    for (const tn of tableNames) {
      // 执行一次清空操作

      await tx.$executeRawUnsafe('SET FOREIGN_KEY_CHECKS = 0;');

      await tx.$executeRawUnsafe(`TRUNCATE TABLE ${tn};`);

      await tx.$executeRawUnsafe('SET FOREIGN_KEY_CHECKS = 0;');
    }
  });
}

/**
 * 列出数据库中所有的表
 *
 * @returns {string[]} 返回表名称集合
 */
export async function listTables(): Promise<string[]> {
  // 执行 SELECT 语句
  const results = await (prisma.$queryRaw`SHOW TABLES` as Promise<Array<Record<string, string>>>);
  // 返回结果
  return results.flatMap(r => Object.values(r));
}

/**
 * 获取指定表包含记录数
 *
 * @param {string[]} tableNames 表名称集合
 * @returns {Map<string, number>} 表名称和每个表记录数对应的 `Map` 集合
 */
export async function countTables(...tableNames: string[]): Promise<Map<string, number | bigint>> {
  const result = new Map<string, number>();

  await Promise.all(tableNames.map(async (tn) => {
    // 执行查询, 计算数据表中的记录数
    const rs = await (prisma.$queryRawUnsafe(`select count(1) as c from \`${tn}\``) as Promise<Array<Record<string, number>>>);
    if (rs && rs.length > 0) {
      // 保存结果
      result.set(tn, (rs[0]).c);
    }
  }));

  return result;
}
