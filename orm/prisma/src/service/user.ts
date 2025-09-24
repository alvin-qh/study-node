import { prisma } from '@/@prisma/connection';

import {
  type Prisma,
  type PrismaClient,
  type Project,
  type User,
} from '@/@prisma/client/client';

import { type ITXClientDenyList } from '@prisma/client/runtime/library';

/**
 * 创建 `User` 实体对象
 *
 * @param user `User` 实体属性对象
 */
export async function create(user: Prisma.UserCreateInput, _tx?: Omit<PrismaClient, ITXClientDenyList>): Promise<User> {
  if (!_tx) {
    return prisma.$transaction(async tx => tx.user.create({ data: user }));
  }
  return _tx.user.create({ data: user });
}

/**
 * 查找所有的 `User` 实体对象集合
 *
 * @param limit 返回结果的数量限制
 * @returns `User` 实体对象集合
 */
export async function findAll(limit: number = 100): Promise<User[]> {
  return prisma.user.findMany({ take: limit });
}

/**
 * 查询 `User` 实体对象中指定的字段值
 *
 * 本例演示了指定查询属性列表, 以及在查询属性列表中使用 SQL 函数
 *
 * @param limit 结果最大条数限制
 * @returns 用户名和其长度实体
 */
export async function findAllNameLengths(limit: number = 100): Promise<Array<User & { length: number | bigint }>> {
  return prisma.$queryRaw<Promise<Array<User & { length: number }>>>`SELECT name, LENGTH(name) AS length FROM user LIMIT ${limit}`;
}

/**
 * 根据所给的 `name` 属性值模糊查询 `UserModel` 实体对象集合
 *
 * @param nameLike 要查询实体的 `name` 属性
 * @returns 根据 `nameLike` 参数模糊查询得到的 `UserModel` 实体对象集合
 */
export async function findAllByNameLike(nameLike: string): Promise<User[]> {
  return prisma.user.findMany({
    orderBy: { name: 'asc' },
    where: { name: { startsWith: nameLike } },
  });
}

/**
 * 根据 `gender` 和 `birthday` 属性查询 `UserModel` 实体对象集合
 *
 * 本函数演示了复杂条件的使用, 包括 `where` 条件中的 `and` 和 `or` 连接符
 *
 * @param gender `gender` 属性值
 * @param birthYear `birthday` 属性值的年份
 * @returns 符合条件的 `UserModel` 实体对象集合
 */
export async function findAllByGenderAndBirthYear(gender: string, birthYear: number): Promise<User[]> {
  const beginDate = new Date(birthYear, 0, 1);
  const endDate = new Date(birthYear, 11, 31);

  return prisma.user.findMany({
    orderBy: { name: 'asc' },
    where: {
      birthday: {
        gt: beginDate,
        lte: endDate,
      },
      gender,
    },
  });
}

/**
 * 根据 `gender` 和 `birthday` 属性查询 `UserModel` 实体对象集合
 *
 * 本函数中演示了在 `where` 条件中使用 SQL 函数
 *
 * @param gender `gender` 属性值
 * @param birthYear `birthday` 属性值的年份
 * @returns 符合条件的 `UserModel` 实体对象集合
 */
export async function findAllByGenderAndBirthYear2(gender: string, birthYear: number): Promise<User[]> {
  return prisma.$queryRaw<User[]>`SELECT * FROM user WHERE gender = ${gender} AND year(birthday) = ${birthYear}`;
}

/**
 * 定义分页类型
 */
export interface Pagination {
  page: number
  pageSize: number
}

/**
 * 定义分页结果数据
 */
export interface PageResult<T> {
  page: number
  pageSize: number
  total: number
  data: T[]
}

/**
 * 根据 `name` 属性和分页参数查询 `UserModel` 实体对象集合
 *
 * 本函数中演示了如何对查询结果进行分页
 *
 * @param name `name` 属性值
 * @param page 分页参数
 * @returns 符合条件的 `UserModel` 实体对象集合
 */
export async function pageByName(name: string, page: Pagination): Promise<PageResult<User>> {
  // 计算分页参数
  const offset = (page.page - 1) * page.pageSize;
  const limit = page.pageSize;

  const where = { name: { startsWith: name } };

  const count = await prisma.user.count({ where });

  const data = count > 0
    ? await prisma.user.findMany({
      orderBy: { name: 'asc' },
      skip: offset,
      take: limit,
      where,
    })
    : [];

  return {
    ...page,
    data,
    total: count,
  };
}

/**
 * 根据 `name` 属性查询 `Project` 实体并关联 `User` 实体
 *
 * @param name `name` 属性值
 * @returns 关联 `Project` 实体的 `User` 实体对象
 */
export async function findByNameWithProject(name: string): Promise<User & { project: Project | null } | null> {
  return prisma.user.findFirst({
    include: { project: true },
    where: { name },
  });
}
