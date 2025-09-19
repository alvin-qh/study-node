import Joi from 'joi';

import { makeI18nJoi } from './i18n';

/**
 * 测试通过 `ValidationOptions` 类型的 `messages` 选项进行自定义错误信息
 */
describe("test 'ValidationOptions::messages' option", () => {
  /**
   * 测试通过设置的 `messages` 设置, 获取自定义的验证错误信息
   */
  it("should get 'validate' error by given 'messages'", () => {
    // 创建一个 `Joi` 的 `Schema` 对象, 用于对数值类型值进行验证
    const schema = Joi
      .number() // 必须为数值类型
      .integer() // 必须为一个整数
      .min(18) // 必须大于等于 18
      .max(100) // 必须大于等于 18
      .required(); // 必须为必填项

    // 调用 `validate` 函数, 验证数字 `10`, 并设置 `ValidationOptions` 类型验证选项
    const { error, value } = schema.validate(10, {
      // 通过 `messages` 选项设置可能的错误信息模板
      messages: {
        'number.base': '{{#label}} 必须为数值类型',
        'number.min': '{{#label}} 的值必须等于或大于 {{#limit}}',
        'number.max': '{{#label}} 的值必须小于 {{#limit}}',
        'number.integer': '{{#label}} 的值必须为一个整数',
      },
      abortEarly: false,
    });

    // 确认验证结果为被验证的数值 `10`
    expect(value).toEqual(10);

    // 确认验证返回了错误, 表示验证未通过
    expect(error).toBeTruthy();

    // 确认验证返回了 1 个错误信息
    expect(error!.details).toHaveLength(1);

    // 确认获取的错误信息是从所给的模板生成
    expect(error!.details[0].type).toEqual('number.min');
    expect(error!.details[0].message).toEqual('"value" 的值必须等于或大于 18');
  });

  /**
   * 测试通过设置的 `messages` 设置, 获取自定义的验证错误信息
   */
  it('should set Chinese messages', () => {
    // 创建一个 `Joi` 的 `Schema` 对象, 用于对对象类型进行验证
    // 指定对象中各个字段的验证规则
    const schema = Joi.object({
      name: Joi.string().min(3).max(10).required(), // 必须为字符串类型, 必须大于等于 3 个字符, 必须小于等于 10 个字符, 必填
      age: Joi.number().integer().min(18).max(100).required(), // 必须为数值类型, 必须为一个整数, 必须大于等于 18, 必须小于等于 100, 必填
      email: Joi.string().email().required(), // 必须为一个有效的邮箱, 必填
    });

    // 调用 `validate` 函数, 对一个对象进行验证, 并设置 `ValidationOptions` 类型验证选项
    const { error, value } = schema.validate({
      name: 'A',
      age: 10.5,
      email: 'XXXXXXXXXXXXX',
    }, {
      // 通过 `messages` 选项设置可能的错误信息模板
      messages: {
        'string.base': '{{#label}} 必须为字符串类型',
        'string.email': '{{#label}} 必须为一个有效的邮箱',
        'string.min': '{{#label}} 长度必须等于或大于 {{#limit}} 个字符',
        'string.max': '{{#label}} 长度必须小于 {{#limit}} 个字符',
        'number.base': '{{#label}} 必须为数值类型',
        'number.min': '{{#label}} 的值必须等于或大于 {{#limit}}',
        'number.max': '{{#label}} 的值必须小于 {{#limit}}',
        'number.integer': '{{#label}} 的值必须为一个整数',
      },
      abortEarly: false,
    });

    // 确认验证结果为被验证的对象
    expect(value).toEqual({
      name: 'A',
      age: 10.5,
      email: 'XXXXXXXXXXXXX',
    });

    // 确认验证返回了错误, 表示验证未通过
    expect(error).toBeTruthy();

    // 确认验证返回了 4 个错误信息
    expect(error!.details).toHaveLength(4);

    // 确认第一个错误信息为对象中 `name` 字段导致的验证错误信息
    expect(error!.details[0].path).toEqual(['name']);
    expect(error!.details[0].type).toEqual('string.min');
    expect(error!.details[0].message).toEqual('"name" 长度必须等于或大于 3 个字符');

    // 确认第二个错误信息为对象中 `age` 字段导致的验证错误信息
    expect(error!.details[1].path).toEqual(['age']);
    expect(error!.details[1].type).toEqual('number.integer');
    expect(error!.details[1].message).toEqual('"age" 的值必须为一个整数');

    // 确认第三个错误信息为对象中 `age` 字段导致的验证错误信息
    expect(error!.details[3].path).toEqual(['email']);
    expect(error!.details[3].type).toEqual('string.email');
    expect(error!.details[3].message).toEqual('"email" 必须为一个有效的邮箱');
  });
});

/**
 * 测试将错误信息国际化
 */
describe("test 'i18n' module", () => {
  /**
   * 测试中文 (`cn`) 地区的国际化错误信息
   */
  it("should get error message by 'cn' location", () => {
    // 创建一个包含中文错误信息的 `Joi` 对象
    const Joi = makeI18nJoi('cn');

    const schema = Joi.object({
      name: Joi.string().min(3).max(10).required(), // 必须为字符串类型, 必须大于等于 3 个字符, 必须小于等于 10 个字符, 必填
      age: Joi.number().integer().min(18).max(100).required(), // 必须为数值类型, 必须为一个整数, 必须大于等于 18, 必须小于等于 100, 必填
      email: Joi.string().email().required(), // 必须为一个有效的邮箱, 必填
    });

    // 创建验证对象
    const { error, value } = schema.validate({
      name: 'A',
      age: 10.5,
      email: 'XXXXXXXXXXXXX',
    }, { abortEarly: false });

    // 验证指定对象
    expect(value).toEqual({
      name: 'A',
      age: 10.5,
      email: 'XXXXXXXXXXXXX',
    });

    expect(error).toBeTruthy();
    expect(error!.details).toHaveLength(4);

    // 确认错误信息内容为中文

    expect(error!.details[0].path).toEqual(['name']);
    expect(error!.details[0].type).toEqual('string.min');
    expect(error!.details[0].message).toEqual('"name" 长度必须等于或大于 3 个字符');

    expect(error!.details[1].path).toEqual(['age']);
    expect(error!.details[1].type).toEqual('number.integer');
    expect(error!.details[1].message).toEqual('"age" 的值必须为一个整数');

    expect(error!.details[2].path).toEqual(['age']);
    expect(error!.details[2].type).toEqual('number.min');
    expect(error!.details[2].message).toEqual('"age" 的值必须等于或大于 18');

    expect(error!.details[3].path).toEqual(['email']);
    expect(error!.details[3].type).toEqual('string.email');
    expect(error!.details[3].message).toEqual('"email" 必须为一个有效的邮箱');
  });

  /**
   * 测试法语 (`fr`) 地区的国际化错误信息
   */
  it('should get error message by `fr` location', () => {
    // 创建一个包含法语错误信息的 `Joi` 对象
    const Joi = makeI18nJoi('fr');

    // 创建验证对象
    const schema = Joi.object({
      name: Joi.string().min(3).max(10).required(), // 必须为字符串类型, 必须大于等于 3 个字符, 必须小于等于 10 个字符, 必填
      age: Joi.number().integer().min(18).max(100).required(), // 必须为数值类型, 必须为一个整数, 必须大于等于 18, 必须小于等于 100, 必填
      email: Joi.string().email().required(), // 必须为一个有效的邮箱, 必填
    });

    // 验证指定对象
    const { error, value } = schema.validate({
      name: 'A',
      age: 10.5,
      email: 'XXXXXXXXXXXXX',
    }, { abortEarly: false });

    expect(value).toEqual({
      name: 'A',
      age: 10.5,
      email: 'XXXXXXXXXXXXX',
    });

    expect(error).toBeTruthy();
    expect(error!.details).toHaveLength(4);

    // 确认错误信息内容为法文

    expect(error!.details[0].path).toEqual(['name']);
    expect(error!.details[0].type).toEqual('string.min');
    expect(error!.details[0].message).toEqual('"name" doit être égal ou supérieur à 3 caractères');

    expect(error!.details[1].path).toEqual(['age']);
    expect(error!.details[1].type).toEqual('number.integer');
    expect(error!.details[1].message).toEqual('"age" doit être un entier');

    expect(error!.details[2].path).toEqual(['age']);
    expect(error!.details[2].type).toEqual('number.min');
    expect(error!.details[2].message).toEqual('"age" doit être égal ou supérieur à 18');

    expect(error!.details[3].path).toEqual(['email']);
    expect(error!.details[3].type).toEqual('string.email');
    expect(error!.details[3].message).toEqual('"email" doit être une boîte aux lettres valide');
  });
});
