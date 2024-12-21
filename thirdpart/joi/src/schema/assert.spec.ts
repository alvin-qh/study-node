import Joi from 'joi';

describe("test 'assert' by joi 'schema'", () => {
  const schema = Joi.object({
    x: Joi.number().required().integer(),
    y: Joi.number().required().max(2),
  });

  const correctValue = {
    x: 1,
    y: 2,
  };

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
    expect(() => Joi.assert(errorValue, schema, { abortEarly: false }))
      .toThrow('{\n  "y" \u001B[31m[2]\u001B[0m: 2.2,\n  "x" \u001B[31m[1]\u001B[0m: 1.1\n}\n\u001B[31m\n[1] "x" must be an integer\n[2] "y" must be less than or equal to 2\u001B[0m');
  });

  /**
   * 测试通过 `schema` 对正确值进行断言, 不会抛出异常
   */
  it("should 'assert' correct value", () => {
    Joi.assert(correctValue, schema);
  });
});
