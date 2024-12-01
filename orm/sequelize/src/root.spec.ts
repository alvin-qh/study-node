import { expect } from 'chai';

import { Sequelize } from 'sequelize';
import cls from 'cls-hooked';

import { misc, ttl } from './util';
import { sequelize } from './db';

// 定义上下文命名空间
const namespace = cls.createNamespace('sequelize-trans');

// 定义 Sequelize 使用上下文命名空间, 则 Sequelize 可以自动使用定义的事务
Sequelize.useCLS(namespace);

/**
 * 初始化测试
 */
before(async () => {
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

/**
 * 确认启动了 `cls-hooked` 的命名空间后, 当事务启动会自动加入命名空间
 */
it('should transaction use cls namespace', async () => {
  await sequelize.transaction(async (trans) => {
    expect(namespace.get('transaction')).is.eq(trans);
  });
});
