import { parseCookie } from './cookie'; // Adjust import path

/**
 * 测试 'cookie' 模块
 */
describe("test 'parseCookie' function in 'cookie' module", () => {
  /**
   * 测试参数为 `undefined` 时, `parseCookie` 函数返回空对象
   */
  it('should return empty object if input is undefined', () => {
    expect(parseCookie(undefined)).toEqual({});
  });

  /**
   * 测试参数为空数组时, `parseCookie` 函数返回空对象
   */
  it('should return empty object if input is empty array', () => {
    expect(parseCookie([])).toEqual({});
  });

  /**
   * 测试参数为单个字符串时, `parseCookie` 函数返回正确的对象
   */
  it('should parse simple cookie string', () => {
    expect(parseCookie(['a=1;b=2'])).toEqual({ a: '1', b: '2' });
  });

  /**
   * 测试 Cookie 中包含 `httponly` 设置的情况
   */
  it('should remove case-insensitive HttpOnly flag', () => {
    expect(parseCookie(['a=1; HttpOnly'])).toEqual({ a: '1', HttpOnly: true });
    expect(parseCookie(['b=2;httponly'])).toEqual({ b: '2', httponly: true });
  });

  /**
   * 测试  Cookie 中包含空格的情况
   */
  it('should trim whitespace from keys and values', () => {
    expect(parseCookie(['  a  =  1  ;  b  =  2  '])).toEqual({ a: '1', b: '2' });
  });

  /**
   * 测试 Cookie 中包含无效的键值对时, `parseCookie` 函数忽略该键值对
   */
  it('should ignore cookies without valid key=value pairs', () => {
    expect(parseCookie(['a=1', 'invalid'])).toEqual({ a: '1' });
  });

  /**
   * 测试 Cookie 中包含多个键值对时, `parseCookie` 函数返回正确的对象
   */
  it('should merge key-value pairs from multiple cookies', () => {
    expect(parseCookie(['a=1;b=2', 'c=3;d=4'])).toEqual({
      a: '1',
      b: '2',
      c: '3',
      d: '4',
    });
  });

  /**
   * 测试 Cookie 中包含值中包含等号（"="）的情况
   */
  it('should handle values with "=" characters', () => {
    expect(parseCookie(['a=1=2=3'])).toEqual({ a: '1=2=3' });
  });

  /**
   * 测试 Cookie 中包含值中包含分号（";"）的情况
   */
  it('should ignore cookie with no value (e.g., "key")', () => {
    expect(parseCookie(['key'])).toEqual({});
  });

  // TC10: Multiple flags with HttpOnly
  it('should parse cookies with `httponly` and other flags', () => {
    expect(parseCookie(['a=1; Path=/; httponly; secure'])).toEqual({ a: '1' });
  });
});
