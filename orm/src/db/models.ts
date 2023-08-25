import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";

import sequelize from "./conn";

const DEFAULT_OPTS = {
  freezeTableName: true,
  timestamps: false
};

/** 
 * 定义 `User` 实体, 对应 `user` 数据表
 */
const User = sequelize.define("user", {
  id: { type: DataTypes.INTEGER, field: "id", primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, field: "name" },
  gender: { type: DataTypes.STRING, field: "gender" },
  birthday: { type: DataTypes.DATE, field: "birthday", allowNull: true },
  phone: { type: DataTypes.STRING, field: "phone" },
  projectId: { type: DataTypes.INTEGER, field: "project_id" }
}, DEFAULT_OPTS);

/** 
 * 定义 `Project` 实体, 对应 `project` 数据表
 */
interface ProjectModel extends Model<InferAttributes<ProjectModel>, InferCreationAttributes<ProjectModel>> {
  id: CreationOptional<number>;
  name: string;
  type: string;
}

const ProjectModel = sequelize.define<ProjectModel>("project", {
  id: { type: DataTypes.INTEGER, field: "id", primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, field: "name" },
  type: { type: DataTypes.STRING, field: "type" }
}, DEFAULT_OPTS);

// User => Project: 定义 `User` 到 `Project` 的多对一关系
User.belongsTo(ProjectModel, { as: "project", foreignKey: "project_id", targetKey: "id" });

// Project => User: 定义 `Project` 到 `User` 的一对多关系
ProjectModel.hasMany(User, { as: "users", foreignKey: "project_id" });

export { ProjectModel, User };
