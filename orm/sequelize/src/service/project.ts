import {
  type CreationAttributes,
  Sequelize,
} from 'sequelize';

import {
  ProjectModel,
  type ProjectModelType,
  TypeCountModel,
  type TypeCountModelType,
  UserModel,
} from '../db';

/**
 * 创建 `Project` 实体对象
 *
 * @param project `Project` 实体属性对象
 */
export async function create(project: CreationAttributes<ProjectModelType>): Promise<ProjectModelType> {
  return ProjectModel.create(project);
}

/**
 * 根据 `id` 属性值查询实体对象
 *
 * @param id 实体对象 `id` 属性值
 * @returns 符合 `id` 属性值的实体对象
 */
export async function find(id: number): Promise<ProjectModelType | null> {
  return ProjectModel.findByPk(id);
}

/**
 * 查询所有的 `Project` 实体对象
 *
 * @param limit 限制查询数量
 * @returns `Project` 实体集合
 */
export async function findAll(limit: number = 100): Promise<ProjectModelType[]> {
  return ProjectModel.findAll({ limit });
}

/**
 * 根据 `name` 字段值查询实体对象
 *
 * @param name `name` 字段值
 * @returns 匹配 `name` 参数的实体对象
 */
export async function findByName(name: string): Promise<ProjectModelType | null> {
  const model = await ProjectModel.findOne({
    where: [ // where
      { name }, //   name = :name
    ],
  });
  return model;
}

/**
 * 查询符合条件的记录总数
 *
 * @param type `type` 属性值
 * @returns 符合条件的记录数
 */
export async function countByType(type: string): Promise<number> {
  return ProjectModel.count({
    where: [ // where
      { type }, // type = :type
    ],
  });
}

/**
 * 按照 `type` 属性对查询结果进行分组
 *
 * @returns 按照 `type` 属性分组的结果
 */
export async function groupingByType(): Promise<TypeCountModelType[]> {
  return TypeCountModel.findAll({
    attributes: [
      'type',
      [Sequelize.fn('count', 1), 'count'],
    ],
    group: 'type',
    order: [
      ['type', 'asc'],
    ],
  });
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
export async function update(id: number, project: CreationAttributes<ProjectModelType>): Promise<ProjectModelType | null> {
  let model = await find(id);
  if (!model) {
    return null;
  }

  model.name = project.name;
  model.type = project.type;

  model = await model.save();
  return model;
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
export async function updateTypeByName(name: string, newType: string): Promise<number[]> {
  return ProjectModel.update(
    { type: newType },
    {
      where: [
        { name },
      ],
    },
  );
}

/**
 * 根据 `id` 属性删除实体对象
 *
 * @param id `id` 属性值
 * @returns 被删除的实体对象, `null` 表示删除失败
 */
export async function destroy(id: number): Promise<ProjectModelType | null> {
  // 通过 id 查询实体对象
  const model = await ProjectModel.findByPk(id);
  if (!model) {
    return null;
  }

  // 对实体对象进行删除
  await model.destroy();
  return model;
}

/**
 * 根据条件通过 SQL 删除数据记录
 *
 * @param name `name` 属性值
 * @returns 本次删除影响的行数
 */
export async function destroyByName(name: string): Promise<number> {
  return ProjectModel.destroy({
    where: [
      { name },
    ],
  });
}

/**
 * 查询实体以及子实体
 *
 * @param name `name` 属性值
 * @returns 包含 `UserModel` 集合的 `ProjectModel` 实体对象
 */
export async function findWithUsers(name: string): Promise<ProjectModelType | null> {
  return ProjectModel.findOne({
    where: [
      { name },
    ],
    include: [
      {
        model: UserModel,
        as: 'users',
        required: true,
      },
    ],
    order: [
      ['users', 'name', 'asc'],
    ],
  });
}
