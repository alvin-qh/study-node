import Joi from 'joi';

/**
 * 测试 `joi` 模块的验证 `schema`
 */
describe("test 'validate' by joi 'schema'", () => {
  /**
   * 测试通过 `schema` 对字符类型值进行验证
   */
  describe("should 'validate' string value", () => {
    /**
     * 测试验证失败, 返回验证错误对象
     */
    it('if string value is error', () => {
      // 定义校验规则, 创建 `Joi` 对象
      const schema = Joi.string().required().min(3).max(10);

      // 对字符串进行校验
      const { error, value } = schema.validate('x');

      // 确认被校验的值
      expect(value).toEqual('x');

      // 确认校验后产生的的错误对象内容
      expect(error).toBeTruthy();
      expect(error.name).toEqual('ValidationError');
      expect(error.message).toEqual('"value" length must be at least 3 characters long');
    });

    /**
     * 测试验证成功
     */
    it('if string value is correct', () => {
      // 定义校验规则, 创建 `Joi` 对象
      const schema = Joi.string().required().min(3).max(10);

      // 对字符串进行校验
      const { error, value } = schema.validate('xyz');

      // 确认被校验的值
      expect(value).toEqual('xyz');

      // 确认未发生验证错误
      expect(error).toBeUndefined();
    });
  });

  /**
   * 测试通过 `schema` 对数值进行验证
   */
  describe("should 'validate' number value", () => {
    /**
     * 测试验证失败, 返回验证错误对象
     */
    it('if number value is error', () => {
      // 定义校验规则, 创建 `Joi` 对象
      const schema = Joi.number().required().min(3).max(10);

      // 对数值进行校验
      const { error, value } = schema.validate(2);

      // 确认被校验的值
      expect(value).toEqual(2);

      // 确认校验后产生的的错误对象内容
      expect(error).toBeTruthy();
      expect(error.name).toEqual('ValidationError');
      expect(error.message).toEqual('"value" must be greater than or equal to 3');
    });

    /**
     * 测试验证成功
     */
    it('if number value is correct', () => {
      // 定义校验规则, 创建 `Joi` 对象
      const schema = Joi.number().required().min(3).max(10);

      // 对数值进行校验
      const { error, value } = schema.validate(5);

      // 确认被校验的值
      expect(value).toEqual(5);

      // 确认未发生验证错误
      expect(error).toBeUndefined();
    });
  });

  /**
   * 测试通过 `schema` 对数组类型值进行验证
   */
  describe("should 'validate' array value", () => {
    /**
     * 测试验证失败, 返回验证错误对象
     */
    it('if array value is error', () => {
      // 定义校验规则, 创建 `Joi` 对象
      const schema = Joi.array().required().min(3).max(10);

      // 对数组进行校验
      const { error, value } = schema.validate([1, 2]);

      // 确认被校验的值
      expect(value).toEqual([1, 2]);

      // 确认校验后产生的的错误对象内容
      expect(error).toBeTruthy();
      expect(error.name).toEqual('ValidationError');
      expect(error.message).toEqual('"value" must contain at least 3 items');
    });

    /**
     * 测试验证成功
     */
    it('if array value is correct', () => {
      // 定义校验规则, 创建 `Joi` 对象
      const schema = Joi.array().required().min(3).max(10);

      // 对数组进行校验
      const { error, value } = schema.validate([1, 2, 3]);

      // 确认被校验的值
      expect(value).toEqual([1, 2, 3]);

      // 确认未发生验证错误
      expect(error).toBeUndefined();
    });
  });

  /**
   * 测试通过 `schema` 对对象类型值进行验证
   */
  describe("should 'validate' object value", () => {
    /**
     * 测试验证失败, 返回验证错误对象
     */
    it('if object value is error', () => {
      // 定义校验规则, 创建 `Joi` 对象
      const schema = Joi.object({
        name: Joi.string().required().min(1).max(20),
        age: Joi.number().required().min(18).max(100),
      });

      // 对对象进行校验
      const { error, value } = schema.validate({ name: 'Alvin', age: 17 });

      // 确认被校验的值
      expect(value).toEqual({ name: 'Alvin', age: 17 });

      // 确认校验后产生的的错误对象内容
      expect(error).toBeTruthy();
      expect(error.name).toEqual('ValidationError');
      expect(error.message).toEqual('"age" must be greater than or equal to 18');
    });

    /**
     * 测试验证成功
     */
    it('if object value is correct', () => {
      // 定义校验规则, 创建 `Joi` 对象
      const schema = Joi.object({
        name: Joi.string().required().min(1).max(20),
        age: Joi.number().required().min(18).max(100),
      });

      // 对对象进行校验
      const { error, value } = schema.validate({ name: 'Alvin', age: 18 });

      // 确认被校验的值
      expect(value).toEqual({ name: 'Alvin', age: 18 });

      // 确认未发生验证错误
      expect(error).toBeUndefined();
    });
  });

  /**
   * 测试自定义验证函数
   */
  describe("should 'validate' by custom function", () => {
    /**
     * 定义要验证的对象类型
     */
    interface User { name: string, age: number };

    // 定义 `schema` 对象
    const schema = Joi.object({
      name: Joi.string().required().min(1).max(20),
      age: Joi.number(),
    })
      // 自定义验证函数
      // 参数 `value` 表示待验证的值, 这里为 `{ name, age }` 类型对象
      // 参数 `helper` 表示验证错误信息的工具对象 (`CustomHelpers` 类型), 帮助产生返回的 `ErrorReport` 类型对象
      // 返回值为验证后的值, 如果验证失败则返回错误信息
      .custom((value: User, helper: Joi.CustomHelpers<User>): User | Joi.ErrorReport => {
        // 判断值是否正确
        if (value.age < 18) {
          // 通过 `CustomHelpers::error` 方法返回 `ErrorReport` 对象
          // 此时需要通过 `messages` 方法定义 `age.too.young` 对应的错误信息模板
          return helper.error('age.too.young', { young: 18 });
        }
        if (value.age > 100) {
          // 通过 `CustomHelpers::message` 方法返回 `ErrorReport` 对象
          // 这里直接传入错误信息模板, 此时模板的 `key` 为 `custom`
          return helper.message({ custom: '"age" cannot greater than {{#old}}' }, { old: 100 });
        }
        return value;
      })
      // 定义额外的错误信息模板
      .messages({ 'age.too.young': '"age" cannot less than {{#young}}' });

    /**
     * 测试自定义验证函数, 在函数中通过 `CustomHelpers::error` 方法返回错误对象
     */
    it("if return 'validate' result by 'CustomHelpers::error' method", () => {
      // 对对象进行校验
      const { error, value } = schema.validate(
        {
          name: 'Alvin',
          age: 17,
        }
      );

      // 确认被校验的值
      expect(value).toEqual({ name: 'Alvin', age: 17 });

      // 确认校验后产生的的错误对象内容
      expect(error).toBeTruthy();
      expect(error.name).toEqual('ValidationError');
      expect(error.message).toEqual('"age" cannot less than 18');
    });

    /**
     * 测试自定义验证函数, 在函数中通过 `CustomHelpers::message` 方法返回错误对象
     */
    it("if return 'validate' result by 'CustomHelpers::message' method", () => {
      const { error, value } = schema.validate(
        {
          name: 'Alvin',
          age: 101,
        }
      );

      // 确认被校验的值
      expect(value).toEqual({ name: 'Alvin', age: 101 });

      // 确认校验后产生的的错误对象内容
      expect(error).toBeTruthy();
      expect(error.name).toEqual('ValidationError');
      expect(error.message).toEqual('"age" cannot greater than 100');
    });
  });
});
