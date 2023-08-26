import { CreationAttributes } from "sequelize";
import { model, sequelize } from "../db";

/**
 * 创建 `Project` 实体对象
 * 
 * @param {CreationAttributes<model.ProjectModel>} project `Project` 实体属性对象
 */
async function create(project: CreationAttributes<model.ProjectModel>): Promise<model.ProjectModel> {
  return await sequelize.transaction(async () => {
    return await model.ProjectModel.create(project);
  });
}

/**
 * 查询所有的 `Project` 实体对象
 * 
 * @param {number} limit 限制查询数量
 * @returns {model.ProjectModel[]} `Project` 实体集合
 */
async function findAll(limit: number = 100): Promise<Array<model.ProjectModel>> {
  return await model.ProjectModel.findAll({
    limit
  });
}

/**
 * 根据 `name` 字段值查询实体对象
 * 
 * @param {string} name `name` 字段值
 * @returns {model.ProjectModel|null} 匹配 `name` 参数的实体对象
 */
async function findByName(name: string): Promise<model.ProjectModel | null> {
  return await model.ProjectModel.findOne({
    where: [   // where
      { name } //   name = :name
    ]
  });
}

/**
 * 查询符合条件的记录总数
 * 
 * @param type `type` 属性值
 * @returns 符合条件的记录数
 */
async function countByType(type: string): Promise<number> {
  return await model.ProjectModel.count({
    where: [   // where
      { type } //   type = :type
    ]
  });
}

export {
  countByType,
  create,
  findAll,
  findByName
};

