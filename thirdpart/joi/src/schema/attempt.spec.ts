import Joi from 'joi';

describe("test 'attempt' by joi 'schema'", () => {
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
   *
   * 注意: `attempt` 方法的 `abortEarly` 选项不起作用, 不会在错误中包含所有的错误信息
   */
  it("should 'attempt' error value", () => {
    expect(() => Joi.attempt(errorValue, schema, { abortEarly: false })).toThrow('"x" must be an integer');
  });

  /**
   * 测试通过 `schema` 对正确值进行断言, 不会抛出异常
   */
  it("should 'attempt' correct value", () => {
    Joi.assert(correctValue, schema);
  });
});
