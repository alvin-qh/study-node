import '../root';

import dayjs from 'dayjs';

import * as user from './user';

import {
  countByType,
  create,
  destroy,
  destroyByName,
  find,
  findAll,
  findByName,
  findWithUsers,
  groupingByType,
  update,
  updateTypeByName,
} from './project';

import { sequelize } from '../db';

/**
 * 测试 `project` 模块
 */
describe("test 'service.project' module", () => {
  /**
   * 测试实体创建
   */
  it("should 'create' function created 'ProjectModel'", async () => {
    const project = await sequelize.transaction(async () =>
      // 创建 `Project` 实体对象
      create({
        name: 'ROOMIS',
        type: 'DEV',
      }),
    );

    // 确认实体创建成功
    expect(project.id).toBeTruthy();
    expect(project.name).toEqual('ROOMIS');
    expect(project.type).toEqual('DEV');

    // 确认实体对象可以被查询
    const projects = await findAll();
    expect(projects).toHaveLength(1);
    expect(projects[0].id).toEqual(project.id);
  });

  /**
   * 测试实体查询
   */
  it("should 'findByName' function returned 'ProjectModel'", async () => {
    await sequelize.transaction(async () => {
      // 创建 `Project` 实体对象
      await create({
        name: 'ROOMIS',
        type: 'DEV',
      });
    });

    // 查询实体
    const project = await findByName('ROOMIS');

    // 确认查询结果正确
    expect(project).not.toBeNull();
    expect(project?.name).toEqual('ROOMIS');
  });

  /**
   * 测试符合结果的记录数
   */
  it("should 'countByType' function returned results count", async () => {
    await sequelize.transaction(async () => {
      // 创建一系列实体
      await Promise.all([
        create({
          name: 'ROOMIS',
          type: 'PROD',
        }),
        create({
          name: 'FINDER',
          type: 'DEV',
        }),
        create({
          name: 'WATCHER',
          type: 'DEV',
        }),
      ]);
    });

    // 查询记录总数
    const count = await countByType('DEV');

    // 确认查询结果正确
    expect(count).toEqual(2);
  });

  /**
   * 测试对查询结果进行分组
   */
  it("should 'groupingByType' function returned grouped results", async () => {
    await sequelize.transaction(async () => {
      // 创建一系列实体
      await Promise.all([
        create({
          name: 'ROOMIS',
          type: 'PROD',
        }),
        create({
          name: 'FINDER',
          type: 'DEV',
        }),
        create({
          name: 'WATCHER',
          type: 'DEV',
        }),
      ]);
    });

    // 查询分组结果
    const results = await groupingByType();

    // 确认分组结果正确
    expect(results).toHaveLength(2);

    expect(results[0].type).toEqual('DEV');
    expect(results[0].count).toEqual(2);

    expect(results[1].type).toEqual('PROD');
    expect(results[1].count).toEqual(1);
  });

  /**
   * 测试通过实体对象进行数据更新
   */
  it("should 'update' function updated properties of model by 'id'", async () => {
    const id = await sequelize.transaction(async () =>
      // 创建实体对象并返回主键 `id`
      (
        await create({
          name: 'ROOMIS',
          type: 'PROD',
        })
      ).id,
    );

    // 更新数据
    let project = await update(id, {
      name: 'ROOMIS-10',
      type: 'DEV',
    });
    expect(project).not.toBeNull();
    expect(project?.name).toEqual('ROOMIS-10');
    expect(project?.type).toEqual('DEV');

    // 确认数据更新成功
    project = await find(id);
    expect(project).not.toBeNull();
    expect(project?.name).toEqual('ROOMIS-10');
    expect(project?.type).toEqual('DEV');
  });

  /**
   * 测试通过 SQL 进行数据更新
   */
  it("should 'updateTypeByName' function updated 'type' property of model", async () => {
    await sequelize.transaction(async () => {
      await create({
        name: 'ROOMIS',
        type: 'PROD',
      });
    });

    // 更新数据
    const counts = await updateTypeByName('ROOMIS', 'DEV');
    expect(counts).toHaveLength(1);
    expect(counts[0]).toEqual(1);

    // 确认数据更新成功
    const project = await findByName('ROOMIS');
    expect(project).not.toBeNull();
    expect(project?.name).toEqual('ROOMIS');
    expect(project?.type).toEqual('DEV');
  });

  /**
   * 测试通过实体对象删除自身
   */
  it("should 'destroy' function deleted model by 'id'", async () => {
    const id = await sequelize.transaction(async () => (
      await create({
        name: 'ROOMIS',
        type: 'PROD',
      })
    ).id);

    // 通过 id 删除实体对象
    let project = await sequelize.transaction(async () => {
      const model = await destroy(id);
      return model;
    });
    expect(project).not.toBeNull();
    expect(project?.id).toEqual(id);

    // 确认对象已被删除
    project = await find(id);
    expect(project).toBeNull();
  });

  /**
   * 测试通过 SQL 删除符合条件的记录
   */
  it("should 'destroyByName' function deleted model by 'name'", async () => {
    await sequelize.transaction(async () => {
      await create({
        name: 'ROOMIS',
        type: 'PROD',
      });
    });

    // 通过 name 删除符合条件的记录
    const count = await sequelize.transaction(async () => {
      const model = await destroyByName('ROOMIS');
      return model;
    });
    expect(count).toEqual(1);

    // 确认对象已被删除
    const project = await findByName('ROOMIS');
    expect(project).toBeNull();
  });

  /**
   * 测试一对多连接查询
   */
  it("should 'findWithUsers' returned model with joined sub model", async () => {
    await sequelize.transaction(async () => {
      const project = await create({
        name: 'ROOMIS',
        type: 'PROD',
      });

      // 添加两个关联实体
      await Promise.all([
        user.create({
          name: 'Alvin',
          gender: 'M',
          birthday: dayjs('1981-03-17').toDate(),
          phone: '13991320110',
          projectId: project.id,
        }),
        user.create({
          name: 'Emma',
          gender: 'F',
          birthday: dayjs('1985-03-29').toDate(),
          phone: '13991320111',
          projectId: project.id,
        }),
      ]);
    });

    // 查询实体对象
    const project = await findWithUsers('ROOMIS');

    // 确认查询结果
    expect(project).not.toBeNull();

    // 获取关联的实体对象
    const users = project?.users;

    // 确认关联实体对象正确
    expect(users).toHaveLength(2);
    expect(users?.[0].name).toEqual('Alvin');
    expect(users?.[1].name).toEqual('Emma');
  });
});
