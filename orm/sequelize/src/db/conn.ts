import 'dotenv/config';

import { type Dialect, Sequelize } from 'sequelize';


/**
 * 创建 `Sequelize` 到数据库的连接
 */
export const sequelize = new Sequelize(
  process.env.DATABASE_NAME ?? 'study_node_sequelize_test',
  process.env.DATABASE_USER ?? 'root',
  process.env.DATABASE_PASSWORD ?? 'root',
  {
    host: process.env.DATABASE_HOST ?? 'localhost',
    port: parseInt(process.env.DATABASE_PORT ?? '3306', 10),
    dialect: (process.env.DATABASE_DIALECT ?? 'mysql') as Dialect,
    pool: {
      max: parseInt(process.env.DATABASE_POOL_MAX ?? '5', 10),
      min: parseInt(process.env.DATABASE_POOL_MIN ?? '0', 10),
      idle: parseInt(process.env.DATABASE_POOL_IDLE ?? '1000', 10),
    },
    logging: process.env.DATABASE_LOGGING === 'true',
  }
);
