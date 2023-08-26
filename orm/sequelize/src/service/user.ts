import { CreationAttributes, Op, Sequelize } from "sequelize";
import { model, sequelize } from "../db";
import { UserModel, UserNameLengthModel } from "../db/models";

/**
 * 创建 `User` 实体对象
 * 
 * @param user `User` 实体属性对象
 */
async function create(user: CreationAttributes<model.UserModel>): Promise<model.UserModel> {
  return await sequelize.transaction(async () => {
    return await model.UserModel.create(user);
  });
}

/**
 * 查找所有的 `User` 实体对象集合
 * 
 * @param limit 返回结果的数量限制
 * @returns `User` 实体对象集合
 */
async function findAll(limit: number = 100): Promise<Array<model.UserModel>> {
  return await UserModel.findAll({
    limit: limit
  });
}

/**
 * 查询 `User` 实体对象中指定的字段值
 * 
 * 本例演示了指定查询属性列表, 以及在查询属性列表中使用 SQL 函数
 * 
 * @param limit 结果最大条数限制
 * @returns 用户名和其长度实体
 */
async function findAllNameLengths(limit: number = 100): Promise<Array<model.UserNameLengthModel>> {
  return await UserNameLengthModel.findAll({
    attributes: [
      "name", // select `name`,
      [
        Sequelize.fn("length", Sequelize.col("name")), // length(`name`)
        "length" // as length
      ]
    ],
    limit: limit
  });
}

/**
 * 根据所给的 `name` 属性值模糊查询 `UserModel` 实体对象集合
 * 
 * @param nameLike 要查询实体的 `name` 属性
 * @returns 根据 `nameLike` 参数模糊查询得到的 `UserModel` 实体对象集合
 */
async function findAllByNameLike(nameLike: string): Promise<Array<model.UserModel>> {
  return await UserModel.findAll({
    where: {
      name: {
        [Op.like]: `${nameLike}%`  // like :name%
      }
    },
    order: [
      ["name", "asc"]
    ]
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
async function findAllByGenderAndBirthYear(gender: model.Gender, birthYear: number): Promise<Array<model.UserModel>> {
  const beginDate = new Date(birthYear, 0, 1);
  const endDate = new Date(birthYear, 11, 31);

  return await UserModel.findAll({
    where: {
      [Op.and]: { // Op.and 并不是必须的, where 的默认条件即为 and
        gender: gender, // gender=:gender
        birthday: {     // and (birthday >= :beginDate and birthday <= :endDate)
          [Op.and]: {
            [Op.gte]: beginDate,
            [Op.lte]: endDate,
          }
        }
      },
    },
    order: [
      ["name", "asc"]
    ]
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
async function findAllByGenderAndBirthYear2(gender: model.Gender, birthYear: number): Promise<Array<model.UserModel>> {
  return await UserModel.findAll({
    where: [ // where
      { gender: gender }, // gender = :gender
      Sequelize.where(    // and year(birthday) = :birthYear
        Sequelize.fn("year", Sequelize.col("birthday")),
        {
          [Op.eq]: birthYear
        }
      ),
    ]
  });
}


export {
  create,
  findAll,
  findAllByGenderAndBirthYear,
  findAllByGenderAndBirthYear2,
  findAllByNameLike,
  findAllNameLengths
};

