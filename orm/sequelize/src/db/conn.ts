import { Sequelize } from "sequelize";

/**
 * 创建 `Sequelize` 到数据库的连接
 */
const sequelize = new Sequelize("study_node", "root", "root", {
  host: "localhost",
  port: 3306,
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
  logging: process.env.LOGGING === "true",
});

export default sequelize;