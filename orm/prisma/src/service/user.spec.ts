import '../root';

import { prisma } from '@/@prisma/connection';

import dayjs from 'dayjs';

import * as project from './project';

import {
  create,
  findAll,
  findAllByGenderAndBirthYear,
  findAllByGenderAndBirthYear2,
  findAllByNameLike,
  findAllNameLengths,
  findByNameWithProject,
  pageByName,
} from './user';

/**
 * 测试 `user` 模块
 */
describe("test 'service.user' module", () => {
  /**
   * 测试实体创建
   */
  it("should 'create' function created `UserModel`", async () => {
    const user = await create({
      name: 'Alvin',
      gender: 'MALE',
      birthday: dayjs('1981-03-17').toDate(),
      phone: '13991320110',
    });

    // 确认用户创建成功
    expect(user.id).not.toBeNull();
    expect(user.name).toEqual('Alvin');
    expect(user.birthday).toEqual(dayjs('1981-03-17').toDate());

    // 从测试表中查询用户数据, 确认查询成功
    const users = await findAll();
    expect(users).toHaveLength(1);
    expect(users[0].id).toEqual(user.id);
  });

  /**
   * 测试返回指定字段
   */
  it("should 'findAllNameLengths' function returned length of 'name' field", async () => {
    await prisma.$transaction(async (tx) => {
      // 创建多个 User 实体对象
      await Promise.all([
        create(
          {
            name: 'Alvin',
            gender: 'MALE',
            birthday: dayjs('1981-03-17').toDate(),
            phone: '13991320110',
          },
          tx,
        ),
        create(
          {
            name: 'Emma',
            gender: 'FEMALE',
            birthday: dayjs('1985-03-29').toDate(),
            phone: '13991320111',
          },
          tx,
        ),
      ]);
    });

    // 查找所有用户的 `name` 和 `name` 字段长度
    const nameLengths = await findAllNameLengths();

    // 确认查询结果正确
    expect(nameLengths).toHaveLength(2);
    expect(nameLengths[0].length).toEqual(BigInt(nameLengths[0].name.length));
    expect(nameLengths[1].length).toEqual(BigInt(nameLengths[1].name.length));
  });

  /**
   * 测试模糊查询
   */
  it("should 'findAllByNameLike' function returned results by matched condition", async () => {
    await prisma.$transaction(async (tx) => {
      // 创建多个 User 实体对象
      await Promise.all([
        create(
          {
            name: 'Alvin',
            gender: 'MALE',
            birthday: dayjs('1981-03-17').toDate(),
            phone: '13991320110',
          },
          tx,
        ),
        create(
          {
            name: 'Arthur',
            gender: 'MALE',
            birthday: dayjs('1981-09-12').toDate(),
            phone: '13991320111',
          },
          tx,
        ),
        create(
          {
            name: 'Emma',
            gender: 'FEMALE',
            birthday: dayjs('1985-03-29').toDate(),
            phone: '13991320112',
          },
          tx,
        ),
      ]);
    });

    // 根据 `name` 属性模糊查询结果
    const users = await findAllByNameLike('A');

    // 确认结果查询正确
    expect(users).toHaveLength(2);
    expect(users[0].name).toEqual('Alvin');
    expect(users[1].name).toEqual('Arthur');
  });

  /**
   * 测试多条件查询
   */
  it("should 'findAllByGenderAndBirthYear' function returned results by multi conditions", async () => {
    await prisma.$transaction(async (tx) => {
      // 创建多个 User 实体对象
      await Promise.all([
        create(
          {
            name: 'Alvin',
            gender: 'MALE',
            birthday: dayjs('1981-03-17').toDate(),
            phone: '13991320110',
          },
          tx,
        ),
        create(
          {
            name: 'Arthur',
            gender: 'MALE',
            birthday: dayjs('1981-09-12').toDate(),
            phone: '13991320111',
          },
          tx,
        ),
        create(
          {
            name: 'Emma',
            gender: 'FEMALE',
            birthday: dayjs('1985-03-29').toDate(),
            phone: '13991320112',
          },
          tx,
        ),
      ]);
    });

    // 查询 User 集合
    const users = await findAllByGenderAndBirthYear('MALE', 1981);

    // 确认结果查询正确
    expect(users).toHaveLength(2);
    expect(users[0].name).toEqual('Alvin');
    expect(users[1].name).toEqual('Arthur');
  });

  /**
   * 测试在 where 条件中使用函数
   */
  it("should 'findAllByGenderAndBirthYear2' function returned results by functional conditions", async () => {
    await prisma.$transaction(async (tx) => {
      // 创建多个 User 实体对象
      await Promise.all([
        create(
          {
            name: 'Alvin',
            gender: 'MALE',
            birthday: dayjs('1981-03-17').toDate(),
            phone: '13991320110',
          },
          tx,
        ),
        create(
          {
            name: 'Arthur',
            gender: 'MALE',
            birthday: dayjs('1981-09-12').toDate(),
            phone: '13991320111',
          },
          tx,
        ),
        create(
          {
            name: 'Emma',
            gender: 'FEMALE',
            birthday: dayjs('1985-03-29').toDate(),
            phone: '13991320112',
          },
          tx,
        ),
      ]);
    });

    // 查询 User 集合
    const users = await findAllByGenderAndBirthYear2('MALE', 1981);

    // 确认结果查询正确
    expect(users).toHaveLength(2);
    expect(users[0].name).toEqual('Alvin');
    expect(users[1].name).toEqual('Arthur');
  });

  /**
   * 测试分页查询
   */
  it("should 'pageByName' function returned results by pagination", async () => {
    await prisma.$transaction(async (tx) => {
      // 创建多个 User 实体对象
      await Promise.all([
        create(
          {
            name: 'Alvin',
            gender: 'MALE',
            birthday: dayjs('1981-03-17').toDate(),
            phone: '13991320110',
          },
          tx,
        ),
        create(
          {
            name: 'Arthur',
            gender: 'MALE',
            birthday: dayjs('1981-09-12').toDate(),
            phone: '13991320111',
          },
          tx,
        ),
        create(
          {
            name: 'Alice',
            gender: 'FEMALE',
            birthday: dayjs('1985-03-29').toDate(),
            phone: '13991320112',
          },
          tx,
        ),
      ]);
    });

    // 查询第一页
    let pageResult = await pageByName('A', { page: 1, pageSize: 2 });

    // 确认结果查询正确
    expect(pageResult.total).toEqual(3);
    expect(pageResult.data[0].name).toEqual('Alice');
    expect(pageResult.data[1].name).toEqual('Alvin');

    // 查询第二页
    pageResult = await pageByName('A', { page: 2, pageSize: 2 });

    // 确认结果查询正确
    expect(pageResult.total).toEqual(3);
    expect(pageResult.data[0].name).toEqual('Arthur');
  });

  /**
   * 测试通过多对一关系查询实体何其父实体
   */
  it("should 'findByNameWithProject' returned model with joined parent model", async () => {
    await prisma.$transaction(async (tx) => {
      const projectModel = await project.create(
        {
          name: 'ROOMIS',
          type: 'PROD',
        },
        tx,
      );

      // 添加两个关联实体
      await Promise.all([
        create(
          {
            name: 'Alvin',
            gender: 'MALE',
            birthday: dayjs('1981-03-17').toDate(),
            phone: '13991320110',
            project: { connect: projectModel },
          },
          tx,
        ),
        create(
          {
            name: 'Emma',
            gender: 'FEMALE',
            birthday: dayjs('1985-03-29').toDate(),
            phone: '13991320111',
            project: { connect: projectModel },
          },
          tx,
        ),
      ]);
    });

    // 查询实体对象
    const user = await findByNameWithProject('Alvin');

    // 确认查询结果
    expect(user).not.toBeNull();

    // 获取关联的实体对象
    const pro = user?.project;

    // 确认关联实体对象正确
    expect(pro?.name).toEqual('ROOMIS');
    expect(pro?.type).toEqual('PROD');
  });
});
