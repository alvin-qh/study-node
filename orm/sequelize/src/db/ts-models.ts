import { DataTypes } from 'sequelize';
import {
  AutoIncrement,
  BelongsTo,
  Column,
  HasMany,
  Model,
  PrimaryKey,
  Table
} from 'sequelize-typescript';


@Table({ tableName: 'class', freezeTableName: true })
export class ClassModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataTypes.INTEGER)
  declare id: number;

  @Column(DataTypes.INTEGER)
  declare grade: number;

  @Column(DataTypes.INTEGER)
  declare no: number;

  @HasMany(() => StudentModel, { foreignKey: 'class_id', sourceKey: 'id' })
  declare students: StudentModel[];
}

@Table({ tableName: 'student', freezeTableName: true })
export class StudentModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataTypes.INTEGER)
  declare id: number;

  @Column(DataTypes.STRING)
  declare name: string;

  @Column(DataTypes.STRING)
  declare no: string;

  @BelongsTo(() => ClassModel)
  declare clazz: ClassModel;
}
