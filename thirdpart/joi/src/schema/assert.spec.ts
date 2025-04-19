import Joi from 'joi';

/**
 * 测试 `Joi` 对象的 `assert` 方法
 *
 * 该方法用于通过 `Schema` 对象对指定对象进行验证, 断言该对象是否符合验证规则
 *
 * 如果验证成功, 则代码将继续执行, 否则将抛出异常
 */
describe("test 'assert' by joi 'schema'", () => {
  // 创建 `schema` 对象, 用于对对象进行验证
  const schema = Joi.object({
    x: Joi.number().integer().required(), // 必须为数值类型, 必填
    y: Joi.number().max(2).required(), // 必须为数值类型, 最大值为 2, 必填
  });

  // 定义属性正确的对象
  const correctValue = {
    x: 1,
    y: 2,
  };

  // 定义属性错误的对象
  const errorValue = {
    x: 1.1,
    y: 2.2,
  };

  /**
   * 测试通过 `schema` 对错误值进行断言, 会抛出 `ValidationError` 异常, 包含断言错误信息
   *
   * 该错误信息会包含终端的格式化字符, 目的是为了在终端清晰显式错误信息
   */
  it("should 'assert' error value for all value", () => {
    try {
      Joi.assert(errorValue, schema, { abortEarly: false });
      fail('should throw error');
    } catch (error) {
      // 确认错误信息
      expect(error.message).toEqual(
        '{\n  "y" \u001B[31m[2]\u001B[0m: 2.2,\n  "x" \u001B[31m[1]\u001B[0m: 1.1\n}\n\u001B[31m\n[1] "x" must be an integer\n[2] "y" must be less than or equal to 2\u001B[0m'
      );
      expect(error.name).toEqual('ValidationError');

      // 确认产生两个错误
      expect(error.details).toHaveLength(2);

      // 确认第一个错误信息
      expect(error.details[0].path).toEqual(['x']);
      expect(error.details[0].type).toEqual('number.integer');
      expect(error.details[0].message).toEqual('"x" must be an integer');

      // 确认第二个错误信息
      expect(error.details[1].path).toEqual(['y']);
      expect(error.details[1].type).toEqual('number.max');
      expect(error.details[1].message).toEqual('"y" must be less than or equal to 2');
    }
  });

  /**
   * 测试通过 `schema` 对正确值进行断言, 不会抛出异常
   */
  it("should 'assert' correct value", () => {
    Joi.assert(correctValue, schema);
  });
});
