import { parseCookie } from './cookie'; // Adjust import path

/**
 * 测试 'cookie' 模块
 */
describe("test 'parseCookie' function in 'cookie' module", () => {
  /**
   * 测试参数为 `undefined` 时, `parseCookie` 函数返回空对象
   */
  it('should return empty object if input is undefined', () => {
    const cookies = parseCookie(undefined);
    expect(cookies).toEqual([]);
  });

  /**
   * 测试参数为空数组时, `parseCookie` 函数返回空对象
   */
  it('should return empty object if input is empty array', () => {
    const cookies = parseCookie([]);
    expect(cookies).toEqual([]);
  });

  /**
   * 测试参数为单个字符串时, `parseCookie` 函数返回正确的对象
   */
  it('should parse simple cookie string', () => {
    const cookies = parseCookie(['a=1;b=2']);
    expect(cookies).toEqual([{ a: '1', b: '2' }]);
  });

  /**
   * 测试 Cookie 中包含 `httponly` 设置的情况
   */
  it('should remove case-insensitive HttpOnly flag', () => {
    let cookies = parseCookie(['a=2; HttpOnly']);
    expect(cookies).toEqual([{
      a: '2',
      httponly: true,
    }]);

    cookies = parseCookie(['b=2;httponly']);
    expect(cookies).toEqual([{ b: '2', httponly: true }]);
  });

  /**
   * 测试  Cookie 中包含空格的情况
   */
  it('should trim whitespace from keys and values', () => {
    const cookies = parseCookie(['  a  =  1  ;  b  =  2  ']);
    expect(cookies).toEqual([{
      a: '1',
      b: '2',
    }]);
  });

  /**
   * 测试 Cookie 中包含无效的键值对时, `parseCookie` 函数忽略该键值对
   */
  it('should ignore cookies without valid key=value pairs', () => {
    const cookies = parseCookie(['a=1', 'secure']);
    expect(cookies).toEqual([{ a: '1' }, { secure: true }]);
  });

  /**
   * 测试 Cookie 中包含多个键值对时, `parseCookie` 函数返回正确的对象
   */
  it('should merge key-value pairs from multiple cookies', () => {
    const cookies = parseCookie(['a=1;b=2', 'c=3;d=4']);
    expect(cookies).toEqual([{
      a: '1',
      b: '2',
    }, {
      c: '3',
      d: '4',
    }]);
  });

  /**
   * 测试 Cookie 中包含值中包含等号（"="）的情况
   */
  it('should handle values with "=" characters', () => {
    const cookies = parseCookie(['a=1=2=3']);
    expect(cookies).toEqual([{ a: '1=2=3' }]);
  });

  /**
   * 测试 Cookie 中包含值中包含分号（";"）的情况
   */
  it('should ignore cookie with no value (e.g., "key")', () => {
    const cookies = parseCookie(['key']);
    expect(cookies).toEqual([]);
  });

  // 解析 Cookie 中包含多个键值对时, `parseCookie` 函数返回正确的对象
  it('should parse cookies with `httponly` and other flags', () => {
    const cookies = parseCookie(['a=1; Path=/; httponly; secure']);
    expect(cookies).toEqual([{
      a: '1',
      path: '/',
      httponly: true,
      secure: true,
    }]);
  });
});
