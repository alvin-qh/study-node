import 'dotenv/config';

import { type Dialect, Sequelize } from 'sequelize';


/**
 * 创建 `Sequelize` 到数据库的连接
 */
export const sequelize = new Sequelize('study_node_sequelize_dev', 'root', 'root', {
  host: process.env.DATABASE_HOST ?? 'localhost',
  port: parseInt(process.env.DATABASE_PORT ?? '3306', 10),
  dialect: (process.env.DATABASE_DIALECT ?? 'mysql') as Dialect,
  pool: {
    max: parseInt(process.env.DATABASE_POOL_MAX ?? '5', 10),
    min: 0,
    idle: 10000
  },
  logging: process.env.LOGGING === 'true'
});
