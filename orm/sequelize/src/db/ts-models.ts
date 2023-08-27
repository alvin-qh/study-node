import { DataTypes } from "sequelize";
import {
  AutoIncrement,
  BelongsTo,
  Column,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";


@Table({ tableName: "class", freezeTableName: true })
class ClassModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataTypes.INTEGER)
  id: number;

  @Column
  grade: number;

  @Column
  no: number;

  @HasMany(() => StudentModel, { foreignKey: "class_id", sourceKey: "id" })
  students: Array<StudentModel>;
}

@Table({ tableName: "student", freezeTableName: true })
class StudentModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataTypes.INTEGER)
  id: number;

  @Column
  name: string;

  @Column
  no: string;

  @BelongsTo(() => ClassModel)
  clazz: ClassModel;
}


export {
  ClassModel,
  StudentModel
};

