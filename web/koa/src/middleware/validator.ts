import { Context, Middleware, Next } from 'koa';

import Joi from 'joi';

/**
 * 定义验证结构类型
 */
export interface Schema {
  [key: string]: Joi.Schema;
};

/**
 * 定义验证请求参数的选项
 */
export type ValidateFor = 'body' | 'query';

/**
 * 定义验证错误详情
 */
export interface ValidateErrorDetail {
  // 错误类型, 为字段验证错误
  type: 'field';

  // 错误信息
  msg: string;

  // 错误路径, 即错误对应的对象字段
  path: string;

  // 错误原因标识
  key: string;
}

/**
 * 定义验证错误
 */
export type ValidateError =  {
  errors: Array<ValidateErrorDetail>;
}

/**
 * 创建验证错误对象
 *
 * @param error 验证错误对象
 */
export function makeValidateError(error: Joi.ValidationError): ValidateError {
  if (!error) {
    return {errors: []};
  }

  // 创建验证错误对象
  return {
    errors: error.details.map(({
      message, path, type,
    }) => ({
      type: 'field',
      msg: message,
      path: path.length > 0 ? path[0] : '',
      key: type,
    } as ValidateErrorDetail)),
  };
}

/**
 * 创建验证中间件
 *
 * @param schema 验证结构
 * @param validateFor 验证请求参数类型
 */
export function validator(schema: Schema, validateFor: ValidateFor = 'body'): Middleware {
  // 创建验证中间件方法
  return async (ctx: Context, next: Next) => {
    try {
      // 创建 `joi` 验证对象
      const validator = Joi.object(schema);

      // 验证请求参数
      const { error } = validator.validate(validateFor === 'body' ? ctx.request.body : ctx.request.query);
      if (error) {
        // 验证失败, 在 KOA 上下文对象中设置错误信息
        ctx.validateError = makeValidateError(error);
      }
      return next();
    } catch (err) {
      ctx.throw(400, err.message);
    }
  };
}
