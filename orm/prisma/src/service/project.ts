import { type Prisma, type PrismaClient, type Project, type User } from '@prisma/client';
import { type ITXClientDenyList } from '@prisma/client/runtime/library';

import { prisma } from '@/conn';

/**
 * 创建 `Project` 实体对象
 *
 * @param project `Project` 实体属性对象
 */
export async function create(project: Prisma.ProjectCreateInput, _tx?: Omit<PrismaClient, ITXClientDenyList>): Promise<Project> {
  if (!_tx) {
    return await prisma.$transaction(async (tx) => await tx.project.create({ data: project }));
  }
  return await _tx.project.create({ data: project });
}

/**
 * 根据 `id` 属性值查询实体对象
 *
 * @param id 实体对象 `id` 属性值
 * @returns 符合 `id` 属性值的实体对象
 */
export async function find(id: number): Promise<Project | null> {
  return await prisma.project.findFirst({ where: { id }, include: { users: true } });
}

/**
 * 查询所有的 `Project` 实体对象
 *
 * @param limit 限制查询数量
 * @returns `Project` 实体集合
 */
export async function findAll(limit: number = 100): Promise<Project[]> {
  return await prisma.project.findMany({ take: limit, include: { users: true } });
}

/**
 * 根据 `name` 字段值查询实体对象
 *
 * @param name `name` 字段值
 * @returns 匹配 `name` 参数的实体对象
 */
export async function findByName(name: string): Promise<Project | null> {
  return await prisma.project.findFirst({
    where: {
      name: {
        contains: name
      }
    }
  });
}

/**
 * 查询符合条件的记录总数
 *
 * @param type `type` 属性值
 * @returns 符合条件的记录数
 */
export async function countByType(type: string): Promise<number> {
  return await prisma.project.count({
    where: { type }
  });
}

/**
 * 按照 `type` 属性对查询结果进行分组
 *
 * 0:
{_count: {…}, type: 'PROD'}
1:
{_count: {…}, type: 'DEV'}
 *
 * @returns 按照 `type` 属性分组的结果
 */
export async function groupingByType(): Promise<Array<{ _count: { _all: number }, type: string }>> {
  const result = prisma.project.groupBy({
    by: 'type',
    _count: {
      _all: true
    },
    orderBy: {
      type: 'asc'
    }
  });
  return await result;
}

/**
 * 根据 `id` 属性值更新实体属性值
 *
 * 本例是通过查询到实体对象, 对实体对象属性进行修改后, 保存实体对象
 *
 * @param id `id` 属性值
 * @param project 包含要更新属性的实体对象
 * @returns 更新后的实体对象, 如果为 null 表示更新失败
 */
export async function update(id: number, project: Prisma.ProjectUpdateInput, _tx?: Omit<PrismaClient, ITXClientDenyList>): Promise<Project> {
  if (!_tx) {
    return await prisma.$transaction(async (tx) => await tx.project.update({
      data: project,
      where: { id }
    }));
  }
  return await _tx.project.update({ where: { id }, data: project });
}

/**
 * 根据 `name` 属性值更新 `type` 属性值
 *
 * 本例是通过 SQL 语句直接执行 update 操作对数据进行更新
 *
 * @param name `name` 属性值
 * @param newType 要更新的的 `type` 属性值
 * @returns 一个整数数组, 表示 `update` 操作影响的行数
 */
export async function updateTypeByName(name: string, newType: string, _tx?: Omit<PrismaClient, ITXClientDenyList>): Promise<number> {
  if (!_tx) {
    const { count } = await prisma.$transaction(async (tx) => await tx.project.updateMany({
      data: {
        type: newType
      },
      where: { name }
    }));
    return count;
  }

  const { count } = await _tx.project.updateMany({
    data: {
      type: newType
    },
    where: { name }
  });

  return count;
}

/**
 * 根据 `id` 属性删除实体对象
 *
 * @param id `id` 属性值
 * @returns 被删除的实体对象, `null` 表示删除失败
 */
export async function remove(id: number, _tx?: Omit<PrismaClient, ITXClientDenyList>): Promise<Project | null> {
  if (!_tx) {
    return await prisma.$transaction(async (tx) => await tx.project.delete({ where: { id } }));
  }
  return await _tx.project.delete({ where: { id } });
}

/**
 * 根据条件通过 SQL 删除数据记录
 *
 * @param name `name` 属性值
 * @returns 本次删除影响的行数
 */
export async function removeByName(name: string, _tx?: Omit<PrismaClient, ITXClientDenyList>): Promise<number> {
  if (!_tx) {
    const { count } = await prisma.$transaction(async (tx) => await tx.project.deleteMany({ where: { name } }));
    return count;
  }
  const { count } = await _tx.project.deleteMany({ where: { name } });
  return count;
}

/**
 * 查询实体以及子实体
 *
 * @param name `name` 属性值
 * @returns 包含 `UserModel` 集合的 `ProjectModel` 实体对象
 */
export async function findWithUsers(name: string): Promise<Project & { users: User[] } | null> {
  return await prisma.project.findFirst({
    where: {
      name
    },
    include: {
      users: {
        orderBy: {
          name: 'asc'
        }
      }
    }
  });
}
