import fs from 'node:fs';

import { QueryTypes } from 'sequelize';

import { sequelize } from '../db';

/**
 * 执行 SQL 脚本
 *
 * @param filename 要执行的脚本文件名
 * @param terminator 语句结束符号, 默认为 `;`
 */
export async function executeSqlScript(filename: string, terminator: string = ';'): Promise<void> {
  // 读取脚本文件
  const fileContent = await fs.promises.readFile(filename, 'utf-8');
  console.log('* read sql from file:');
  console.log(fileContent);

  // 将脚本文件通过结束符分割为多个部分
  const sqls = fileContent.split(terminator).map(sql => sql.trim()).filter(sql => sql);

  // 启动事务
  await sequelize.transaction(async (trans) => {
    // 逐部分执行脚本语句
    for (const sql of sqls) {
      await sequelize.query(sql, { type: QueryTypes.RAW, transaction: trans });
    }
  });
}

/**
 * 清空指定名称的表
 *
 * @param tableNames 要清空的表名称集合
 */
export async function truncateTables(...tableNames: string[]): Promise<void> {
  // SQL 执行选项
  const options = { type: QueryTypes.RAW };

  // 启动事务
  await sequelize.transaction(async (trans) => {
    for (const tn of tableNames) {
      // 执行一次清空操作
      await sequelize.query('SET FOREIGN_KEY_CHECKS = 0;', { ...options, transaction: trans });
      await sequelize.query(`TRUNCATE TABLE ${tn};`, { ...options, transaction: trans });
      await sequelize.query('SET FOREIGN_KEY_CHECKS = 0;', { ...options, transaction: trans });
    }
  });
}

/**
 * 列出数据库中所有的表
 *
 * @returns 返回表名称集合
 */
export async function listTables(): Promise<string[]> {
  const sql = 'show tables';

  // 执行 SELECT 语句
  const results = await sequelize.query(sql, { type: QueryTypes.SELECT });

  // 返回结果
  return (results ?? []).flatMap(r => Object.values(r));
}

/**
 * 获取指定表包含记录数
 *
 * @param tableNames 表名称集合
 * @returns 表名称和每个表记录数对应的 `Map` 集合
 */
export async function countTables(...tableNames: string[]): Promise<Map<string, number>> {
  const result = new Map<string, number>();

  await Promise.all(tableNames.map(async (tn) => {
    // 执行查询, 计算数据表中的记录数
    const rs = await sequelize.query<{ c: number }>(`select count(1) as c from ${tn}`, { type: QueryTypes.SELECT });
    if (rs && rs.length > 0) {
      // 保存结果
      result.set(tn, (rs[0]).c);
    }
  }));

  return result;
}
