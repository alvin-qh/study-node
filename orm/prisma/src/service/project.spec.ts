import { describe, expect, it } from 'bun:test';

import { type Project } from '@prisma/client';
import dayjs from 'dayjs';

import '../root.spec';
import { prisma } from '@/conn';

import {
  countByType,
  create,
  find,
  findAll,
  findByName,
  findWithUsers,
  groupingByType,
  remove,
  removeByName,
  update,
  updateTypeByName,
} from './project';

import * as user from './user';

/**
 * 测试 `project` 模块
 */
describe("test 'service.project' module", () => {
  /**
   * 测试实体创建
   */
  it("should 'create' function created 'Project' model", async () => {
    const project = await create({
      name: 'ROOMIS',
      type: 'DEV',
    });

    // 确认实体创建成功
    expect(project.id).not.toBeNull();
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
  it("should 'findByName' function returned 'Project' model", async () => {
    // 创建 `Project` 实体对象
    await create({
      name: 'ROOMIS',
      type: 'DEV',
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
    await prisma.$transaction(async (tx) => {
      // 创建一系列实体
      await Promise.all([
        create(
          {
            name: 'ROOMIS',
            type: 'PROD',
          },
          tx
        ),
        create(
          {
            name: 'FINDER',
            type: 'DEV',
          },
          tx
        ),
        create(
          {
            name: 'WATCHER',
            type: 'DEV',
          },
          tx
        ),
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
    await prisma.$transaction(async (tx) => {
      // 创建一系列实体
      await Promise.all([
        create(
          {
            name: 'ROOMIS',
            type: 'PROD',
          },
          tx
        ),
        create(
          {
            name: 'FINDER',
            type: 'DEV',
          },
          tx
        ),
        create(
          {
            name: 'WATCHER',
            type: 'DEV',
          },
          tx
        ),
      ]);
    });

    // 查询分组结果
    const results = await groupingByType();

    // 确认分组结果正确
    expect(results).toHaveLength(2);

    expect(results[0].type).toEqual('DEV');
    expect(results[0]._count._all).toEqual(2);

    expect(results[1].type).toEqual('PROD');
    expect(results[1]._count._all).toEqual(1);
  });

  /**
   * 测试通过实体对象进行数据更新
   */
  it("should 'update' function updated properties of model by 'id'", async () => {
    // 创建实体对象并返回主键 `id`
    const { id } = await create({
      name: 'ROOMIS',
      type: 'PROD',
    });

    // 更新数据
    let project: Project | null = await update(id, {
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
    await create({
      name: 'ROOMIS',
      type: 'PROD',
    });

    // 更新数据
    const count = await updateTypeByName('ROOMIS', 'DEV');
    expect(count).toEqual(1);

    // 确认数据更新成功
    const project = await findByName('ROOMIS');
    expect(project).not.toBeNull();
    expect(project?.name).toEqual('ROOMIS');
    expect(project?.type).toEqual('DEV');
  });

  /**
   * 测试通过实体对象删除自身
   */
  it("should 'remove' function deleted model by 'id'", async () => {
    const { id } = await create({
      name: 'ROOMIS',
      type: 'PROD',
    });

    // 通过 id 删除实体对象
    let project = await remove(id);
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
    await create({
      name: 'ROOMIS',
      type: 'PROD',
    });

    // 通过 name 删除符合条件的记录
    const count = await removeByName('ROOMIS');
    expect(count).toEqual(1);

    // 确认对象已被删除
    const project = await findByName('ROOMIS');
    expect(project).toBeNull();
  });

  /**
   * 测试一对多连接查询
   */
  it("should 'findWithUsers' returned model with joined sub model", async () => {
    await prisma.$transaction(async (tx) => {
      const project = await create(
        {
          name: 'ROOMIS',
          type: 'PROD',
        },
        tx
      );

      // 添加两个关联实体
      await Promise.all([
        user.create(
          {
            name: 'Alvin',
            gender: 'MALE',
            birthday: dayjs('1981-03-17').toDate(),
            phone: '13991320110',
            project: { connect: project },
          },
          tx
        ),
        user.create(
          {
            name: 'Emma',
            gender: 'FEMALE',
            birthday: dayjs('1985-03-29').toDate(),
            phone: '13991320111',
            project: { connect: project },
          },
          tx
        ),
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
