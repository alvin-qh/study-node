import { expect } from 'chai';

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
    expect(obj).to.deep.eq({});

    // 将 "true" 转为 true
    obj = JSON.parse('true');
    expect(obj).to.eq(true);

    // 将 '"foo"' 转为字符串, 注意: 需要包含双引号
    obj = JSON.parse('"foo"');
    expect(obj).to.eq('foo');

    // 将 "null" 转为 null
    obj = JSON.parse('null');
    expect(obj).is.null;

    // 将 JSON 字符串转为数组
    obj = JSON.parse('[1, 5, false]');
    expect(obj).to.deep.eq([1, 5, false]);

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

    expect(obj).to.deep.eq({
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
    expect(s).to.eq('{}');

    // 将 true 转为 "true"
    s = JSON.stringify(true);
    expect(s).to.eq('true');

    // 将 "foo" 转为 '"foo"'
    s = JSON.stringify('foo');
    expect(s).to.eq('"foo"');

    // 将 null 转为 "null"
    s = JSON.stringify(null);
    expect(s).to.eq('null');

    // 将数组转为 JSON 字符串
    s = JSON.stringify([1, 5, false]);
    expect(s).to.eq('[1,5,false]');

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
    expect(s).to.eq('{"a":100,"b":"Hello","c":false,"d":{"type":"array","value":[1,2,3]}}');
  });
});
