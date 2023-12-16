import '../root.spec';

import { expect } from 'chai';
import dayjs from 'dayjs';

import { sequelize } from '../db';
import * as project from './project';
import {
  create,
  findAll,
  findAllByGenderAndBirthYear,
  findAllByGenderAndBirthYear2,
  findAllByNameLike,
  findAllNameLengths,
  findByNameWithProject,
  pageByName
} from './user';

/**
 * 测试 `user` 模块
 */
describe('Test `service.user` module', () => {
  /**
   * 测试实体创建
   */
  it('should `create` function created `UserModel`', async () => {
    const user = await sequelize.transaction(async () => {
      // 创建用户实体
      const model = await create({
        name: 'Alvin',
        gender: 'M',
        birthday: dayjs('1981-03-17').toDate(),
        phone: '13991320110'
      });
      return model;
    });

    // 确认用户创建成功
    expect(user.id).is.not.null;
    expect(user.name).is.eq('Alvin');
    expect(user.birthday).is.deep.eq(dayjs('1981-03-17').toDate());

    // 从测试表中查询用户数据, 确认查询成功
    const users = await findAll();
    expect(users).has.length(1);
    expect(users[0].id).is.eq(user.id);
  });

  /**
   * 测试返回指定字段
   */
  it('should `findAllNameLengths` function returned length of `name` field', async () => {
    await sequelize.transaction(async () => {
      // 创建多个 User 实体对象
      await Promise.all([
        create({
          name: 'Alvin',
          gender: 'M',
          birthday: dayjs('1981-03-17').toDate(),
          phone: '13991320110'
        }),
        create({
          name: 'Emma',
          gender: 'F',
          birthday: dayjs('1985-03-29').toDate(),
          phone: '13991320111'
        })
      ]);
    });

    // 查找所有用户的 `name` 和 `name` 字段长度
    const nameLengths = await findAllNameLengths();

    // 确认查询结果正确
    expect(nameLengths).has.length(2);
    expect(nameLengths[0].length).is.eq(nameLengths[0].name.length);
    expect(nameLengths[1].length).is.eq(nameLengths[1].name.length);
  });

  /**
   * 测试模糊查询
   */
  it('should `findAllByNameLike` function returned results by matched condition', async () => {
    await sequelize.transaction(async () => {
      // 创建多个 User 实体对象
      await Promise.all([
        create({
          name: 'Alvin',
          gender: 'M',
          birthday: dayjs('1981-03-17').toDate(),
          phone: '13991320110'
        }),
        create({
          name: 'Arthur',
          gender: 'M',
          birthday: dayjs('1981-09-12').toDate(),
          phone: '13991320111'
        }),
        create({
          name: 'Emma',
          gender: 'F',
          birthday: dayjs('1985-03-29').toDate(),
          phone: '13991320112'
        })
      ]);
    });

    // 根据 `name` 属性模糊查询结果
    const users = await findAllByNameLike('A');

    // 确认结果查询正确
    expect(users).has.length(2);
    expect(users[0].name).is.eq('Alvin');
    expect(users[1].name).is.eq('Arthur');
  });

  /**
   * 测试多条件查询
   */
  it('should `findAllByGenderAndBirthYear` function returned results by multi conditions', async () => {
    await sequelize.transaction(async () => {
      // 创建多个 User 实体对象
      await Promise.all([
        create({
          name: 'Alvin',
          gender: 'M',
          birthday: dayjs('1981-03-17').toDate(),
          phone: '13991320110'
        }),
        create({
          name: 'Arthur',
          gender: 'M',
          birthday: dayjs('1981-09-12').toDate(),
          phone: '13991320111'
        }),
        create({
          name: 'Emma',
          gender: 'F',
          birthday: dayjs('1985-03-29').toDate(),
          phone: '13991320112'
        })
      ]);
    });

    // 查询 User 集合
    const users = await findAllByGenderAndBirthYear('M', 1981);

    // 确认结果查询正确
    expect(users).has.length(2);
    expect(users[0].name).is.eq('Alvin');
    expect(users[1].name).is.eq('Arthur');
  });

  /**
   * 测试在 where 条件中使用函数
   */
  it('should `findAllByGenderAndBirthYear2` function returned results by functional conditions', async () => {
    await sequelize.transaction(async () => {
      // 创建多个 User 实体对象
      await Promise.all([
        create({
          name: 'Alvin',
          gender: 'M',
          birthday: dayjs('1981-03-17').toDate(),
          phone: '13991320110'
        }),
        create({
          name: 'Arthur',
          gender: 'M',
          birthday: dayjs('1981-09-12').toDate(),
          phone: '13991320111'
        }),
        create({
          name: 'Emma',
          gender: 'F',
          birthday: dayjs('1985-03-29').toDate(),
          phone: '13991320112'
        })
      ]);
    });

    // 查询 User 集合
    const users = await findAllByGenderAndBirthYear2('M', 1981);

    // 确认结果查询正确
    expect(users).has.length(2);
    expect(users[0].name).is.eq('Alvin');
    expect(users[1].name).is.eq('Arthur');
  });

  /**
   * 测试分页查询
   */
  it('should `pageByName` function returned results by pagination', async () => {
    await sequelize.transaction(async () => {
      // 创建多个 User 实体对象
      await Promise.all([
        create({
          name: 'Alvin',
          gender: 'M',
          birthday: dayjs('1981-03-17').toDate(),
          phone: '13991320110'
        }),
        create({
          name: 'Arthur',
          gender: 'M',
          birthday: dayjs('1981-09-12').toDate(),
          phone: '13991320111'
        }),
        create({
          name: 'Alice',
          gender: 'F',
          birthday: dayjs('1985-03-29').toDate(),
          phone: '13991320112'
        })
      ]);
    });

    // 查询第一页
    let users = await pageByName('A', { page: 1, pageSize: 2 });

    // 确认结果查询正确
    expect(users).has.length(2);
    expect(users[0].name).is.eq('Alice');
    expect(users[1].name).is.eq('Alvin');

    // 查询第二页
    users = await pageByName('A', { page: 2, pageSize: 2 });

    // 确认结果查询正确
    expect(users).has.length(1);
    expect(users[0].name).is.eq('Arthur');
  });

  /**
   * 测试通过多对一关系查询实体何其父实体
   */
  it('should `findByNameWithProject` returned model with joined parent model', async () => {
    await sequelize.transaction(async () => {
      const pro = await project.create({
        name: 'ROOMIS',
        type: 'PROD'
      });

      // 添加两个关联实体
      await Promise.all([
        create({
          name: 'Alvin',
          gender: 'M',
          birthday: dayjs('1981-03-17').toDate(),
          phone: '13991320110',
          projectId: pro.id
        }),
        create({
          name: 'Emma',
          gender: 'F',
          birthday: dayjs('1985-03-29').toDate(),
          phone: '13991320111',
          projectId: pro.id
        })
      ]);
    });

    // 查询实体对象
    const user = await findByNameWithProject('Alvin');

    // 确认查询结果
    expect(user).is.not.null;

    // 获取关联的实体对象
    const pro = user?.project;

    // 确认关联实体对象正确
    expect(pro?.name).is.eq('ROOMIS');
    expect(pro?.type).is.eq('PROD');
  });
});
