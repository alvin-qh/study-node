import fs from "fs";
import path from "path";
import { QueryTypes } from "sequelize";

import { sequelize } from "../db";

let tableCreated = false;

async function createTables(): Promise<void> {
  if (!tableCreated) {
    const fileContent = await fs.promises.readFile(path.join(process.cwd(), "tables.sql"), "utf-8");
    console.log("* read sql from file:");
    console.log(fileContent);

    const sqls = fileContent.split(";").map(sql => sql.trim()).filter(sql => sql);

    await sequelize.transaction(async () => {
      sqls.forEach(async (sql) => await sequelize.query(sql, { type: QueryTypes.RAW }));
    });
    tableCreated = true;
  }
}

async function truncateTables(...tableNames: Array<string>): Promise<void> {
  const options = { type: QueryTypes.RAW };
  await sequelize.transaction(async () => {
    for (const tn of tableNames) {
      await sequelize.query("SET FOREIGN_KEY_CHECKS = 0;", options);
      await sequelize.query(`TRUNCATE TABLE ${tn};`, options);
      await sequelize.query("SET FOREIGN_KEY_CHECKS = 0;", options);
    }
  });
}

async function listTables(): Promise<Array<string>> {
  const sql = "show tables";
  const results = await sequelize.query(sql, { type: QueryTypes.SELECT });
  return (results ?? []).flatMap(r => Object.values(r));
}

async function countTable(...tableNames: Array<string>): Promise<Map<string, number>> {
  const result = new Map<string, number>();
  await Promise.all(tableNames.map(async (tn) => {
    const rs = await sequelize.query(`select count(1) as c from ${tn}`, { type: QueryTypes.SELECT });
    if (rs && rs.length > 0) {
      result.set(tn, rs[0]["c"]);
    }
  }));
  return result;
}

export { countTable, createTables, listTables, truncateTables };

