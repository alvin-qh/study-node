import {
  CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model
} from "sequelize";

import sequelize from "./conn";

// 定义数据模型的默认构造选项
const DEFAULT_OPTS = {
  freezeTableName: true,
  timestamps: false
};

// 定义性别类型
type Gender = "F" | "M";

/**
 * 定义 `User` 实体类型
 */
interface UserModel extends Model<InferAttributes<UserModel>, InferCreationAttributes<UserModel>> {
  id: CreationOptional<number>;
  name: string;
  gender: Gender;
  birthday?: Date;
  phone: string;
  projectId?: number;
}

/** 
 * 定义 `User` 实体和 `user` 数据表的映射关系
 */
const UserModel = sequelize.define<UserModel>("user", {
  id: { type: DataTypes.INTEGER, field: "id", primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, field: "name" },
  gender: { type: DataTypes.STRING, field: "gender" },
  birthday: { type: DataTypes.DATE, field: "birthday", allowNull: true },
  phone: { type: DataTypes.STRING, field: "phone" },
  projectId: { type: DataTypes.INTEGER, field: "project_id", allowNull: true }
}, DEFAULT_OPTS);

/** 
 * 定义 `Project` 实体类型
 */
interface ProjectModel extends Model<InferAttributes<ProjectModel>, InferCreationAttributes<ProjectModel>> {
  id: CreationOptional<number>;
  name: string;
  type: string;
}

/**
 * 定义 `Project` 实体和 `project` 数据表的映射关系
 */
const ProjectModel = sequelize.define<ProjectModel>("project", {
  id: { type: DataTypes.INTEGER, field: "id", primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, field: "name" },
  type: { type: DataTypes.STRING, field: "type" },
}, DEFAULT_OPTS);

// User => Project: 定义 `User` 到 `Project` 的多对一关系
UserModel.belongsTo(ProjectModel, { as: "project", foreignKey: "project_id", targetKey: "id" });

// Project => User: 定义 `Project` 到 `User` 的一对多关系
ProjectModel.hasMany(UserModel, { as: "users", foreignKey: "project_id" });

/**
 * 定义名称和名称长度组成的实体类型
 */
interface UserNameLengthModel extends Model<InferAttributes<UserNameLengthModel>> {
  name: string;
  length: number;
}

/**
 * 定义 `UserNameLengthModel` 实体和 `user` 数据表的映射关系
 */
const UserNameLengthModel = sequelize.define<UserNameLengthModel>("user", {
  name: { type: DataTypes.STRING, field: "name" },
  length: { type: DataTypes.INTEGER, field: "length" },
}, DEFAULT_OPTS);

/**
 * 定义分页类型
 */
type Pagination = {
  page: number;
  pageSize: number;
};


export {
  Gender,
  Pagination,
  ProjectModel,
  UserModel,
  UserNameLengthModel,
};

