import { expect } from '@jest/globals';

/**
 * 测试 JSON 操作
 */
describe("test 'JSON' module", () => {
  /**
   * 测试将 JSON 字符串转为对象
   */
  it("should parse 'JSON' string to Object", () => {
    // 将 "{}" 转为空对象
    let obj = JSON.parse('{}');
    expect(obj).toEqual({});

    // 将 "true" 转为 true
    obj = JSON.parse('true');
    expect(obj).toEqual(true);

    // 将 '"foo"' 转为字符串, 注意: 需要包含双引号
    obj = JSON.parse('"foo"');
    expect(obj).toEqual('foo');

    // 将 "null" 转为 null
    obj = JSON.parse('null');
    expect(obj).toBeNull();

    // 将 JSON 字符串转为数组
    obj = JSON.parse('[1, 5, false]');
    expect(obj).toEqual([1, 5, false]);

    // 将 JSON 字符串转为对象
    obj = JSON.parse(`{
      "a": 100,
      "b": "Hello",
      "c": false,
      "d": {
        "type":"array",
        "value":[1,2,3]
      }
    }`);

    expect(obj).toEqual({
      a: 100,
      b: 'Hello',
      c: false,
      d: {
        type: 'array',
        value: [1, 2, 3],
      },
    });
  });

  /**
   * 测试将 JSON 字符串转为对象
   */
  it("should convert Object to 'JSON' string", () => {
    // 将空对象转为 "{}"
    let s = JSON.stringify({});
    expect(s).toEqual('{}');

    // 将 true 转为 "true"
    s = JSON.stringify(true);
    expect(s).toEqual('true');

    // 将 "foo" 转为 '"foo"'
    s = JSON.stringify('foo');
    expect(s).toEqual('"foo"');

    // 将 null 转为 "null"
    s = JSON.stringify(null);
    expect(s).toEqual('null');

    // 将数组转为 JSON 字符串
    s = JSON.stringify([1, 5, false]);
    expect(s).toEqual('[1,5,false]');

    // 将对象转为 JSON 字符串
    s = JSON.stringify({
      a: 100,
      b: 'Hello',
      c: false,
      d: {
        type: 'array',
        value: [1, 2, 3],
      },
    });
    expect(s).toEqual('{"a":100,"b":"Hello","c":false,"d":{"type":"array","value":[1,2,3]}}');
  });
});
