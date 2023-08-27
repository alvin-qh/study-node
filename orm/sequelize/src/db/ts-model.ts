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
class Class extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataTypes.INTEGER)
  id: number;

  @Column
  grade: number;

  @Column
  no: number;

  @HasMany(() => Student, { foreignKey: "class_id", sourceKey: "id" })
  students: Array<Student>;
}

@Table({ tableName: "student", freezeTableName: true })
class Student extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataTypes.INTEGER)
  id: number;

  @Column
  name: string;

  @Column
  no: string;

  @BelongsTo(() => Class)
  clazz: Class;
}


export {
  Class,
  Student
};

