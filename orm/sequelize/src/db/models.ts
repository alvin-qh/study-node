import {
  type CreationOptional,
  DataTypes,
  type InferAttributes,
  type InferCreationAttributes,
  type Model
} from 'sequelize';

import { sequelize } from './conn';

// 定义数据模型的默认构造选项
const DEFAULT_OPTS = {
  freezeTableName: true,
  timestamps: false
};

// 定义性别类型
export type Gender = 'F' | 'M';

/**
 * 定义 `User` 实体类型
 */
export interface UserModelType extends Model<InferAttributes<UserModelType>, InferCreationAttributes<UserModelType>> {
  id: CreationOptional<number>
  name: string
  gender: Gender
  birthday?: Date
  phone: string
  projectId?: number
  project?: ProjectModelType
}

/**
 * 定义 `User` 实体和 `user` 数据表的映射关系
 */
export const UserModel = sequelize.define<UserModelType>('user', {
  id: {
    field: 'id',
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    field: 'name',
    type: DataTypes.STRING
  },
  gender: {
    field: 'gender',
    type: DataTypes.STRING
  },
  birthday: {
    field: 'birthday',
    type: DataTypes.DATE,
    allowNull: true
  },
  phone: {
    field: 'phone',
    type: DataTypes.STRING
  },
  projectId: {
    field: 'project_id',
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { // 定义外键引用
      key: 'id',
      model: 'project'
    }
  }
}, DEFAULT_OPTS);

/**
 * 定义 `Project` 实体类型
 */
export interface ProjectModelType extends Model<InferAttributes<ProjectModelType>, InferCreationAttributes<ProjectModelType>> {
  id: CreationOptional<number>
  name: string
  type: string
  users?: UserModelType[]
}

/**
 * 定义 `Project` 实体和 `project` 数据表的映射关系
 */
export const ProjectModel = sequelize.define<ProjectModelType>('project', {
  id: {
    field: 'id',
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    field: 'name',
    type: DataTypes.STRING
  },
  type: {
    field: 'type',
    type: DataTypes.STRING
  }
}, DEFAULT_OPTS);

// User => Project: 定义 `User` 到 `Project` 的多对一关系
UserModel.belongsTo(ProjectModel, {
  as: 'project',
  foreignKey: 'project_id',
  targetKey: 'id'
});

// Project => User: 定义 `Project` 到 `User` 的一对多关系
ProjectModel.hasMany(UserModel, {
  as: 'users'
});

/**
 * 定义名称和名称长度组成的实体类型
 */
export interface UserNameLengthModelType extends Model<InferAttributes<UserNameLengthModelType>> {
  name: string
  length: number
}

/**
 * 定义 `UserNameLengthModel` 实体和 `user` 数据表的映射关系
 */
export const UserNameLengthModel = sequelize.define<UserNameLengthModelType>('user', {
  name: { type: DataTypes.STRING, field: 'name' },
  length: { type: DataTypes.INTEGER, field: 'length' }
}, DEFAULT_OPTS);

/**
 * 定义类型和类型数量组成的实体
 */
export interface TypeCountModelType extends Model<InferAttributes<TypeCountModelType>> {
  type: string
  count: number
}

/**
 * 定义 `TypeCountModel` 实体和 `project` 数据表的映射关系
 */
export const TypeCountModel = sequelize.define<TypeCountModelType>('project', {
  type: { type: DataTypes.STRING, field: 'type' },
  count: { type: DataTypes.INTEGER, field: 'count' }
}, DEFAULT_OPTS);

/**
 * 定义分页类型
 */
export interface Pagination {
  page: number
  pageSize: number
}
