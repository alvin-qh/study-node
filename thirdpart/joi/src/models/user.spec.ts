import { User, validation } from './user';

/**
 * 测试 `user` 模块
 */
describe("test 'user' module", () => {
  /**
   * 测试对 `User` 类型对象属性值进行验证
   */
  it("should validate 'User' object", () => {
    const u: User = {
      id: 1,
      name: 'Alvin',
      password: '123456',
      email: 'alvin_@163.com',
    };

    // 验证 `User` 对象属性值, 返回错误对象和值对象
    const { error, value } = validation.validate(u, { abortEarly: false });
    expect(value).toEqual(u);

    // 确认返回了 `ValidationError` 对象
    expect(error).toBeTruthy();
    // 确认 `ValidationError::name` 属性值
    expect(error.name).toEqual('ValidationError');
    // 确认 `ValidationError:message` 属性值
    expect(error.message).toEqual('"id" must be greater than or equal to 1000. "password" length must be at least 8 characters long');

    // 确认有两个规则不符合
    expect(error.details).toHaveLength(2);

    // 确认第一个不符合规则返回的错误属性
    expect(error.details[0].path).toEqual(['id']);
    expect(error.details[0].type).toEqual('number.min');
    expect(error.details[0].context).toEqual({
      key: 'id',
      label: 'id',
      limit: 1000,
      value: 1,
    });
    expect(error.details[0].message).toEqual('"id" must be greater than or equal to 1000');

    // 确认第二个不符合规则返回的错误属性
    expect(error.details[1].path).toEqual(['password']);
    expect(error.details[1].type).toEqual('string.min');
    expect(error.details[1].context).toEqual({
      key: 'password',
      label: 'password',
      limit: 8,
      value: '123456',
      encoding: undefined,
    });
    expect(error.details[1].message).toEqual('"password" length must be at least 8 characters long');
  });
});
