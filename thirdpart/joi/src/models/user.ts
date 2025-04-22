import Joi from 'joi';

/**
 * 定义 `User` 接口类型, 表示一个用户
 */
export interface User {
  id: number
  name: string
  password: string
  email: string
}

/**
 * 定义 `User` 类型对象各字段的校验规则
 */
export const validation = Joi.object({
  id: Joi.number().min(1000).max(10000000).required(), // 必须为数值类型, 必须为范围在 1000 到 10000000 之间的数值, 必填
  name: Joi.string().min(1).max(20).required(), // 必须为字符串类型, 必须为范围在 1 到 20 之间的字符串, 必填
  password: Joi.string().min(8).max(20).required(), // 必须为字符串类型, 必须为范围在 8 到 20 之间的字符串, 必填
  email: Joi.string().email().required(), // 必须为字符串类型, 必须为邮箱格式, 必填
});
