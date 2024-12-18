import { expect } from 'chai';

/**
 * 测试 nodejs 类型
 */
describe('test node type', () => {
  /**
   * 测试 Boolean 类型
   */
  it("test 'Boolean' type", () => {
    // 非空字符串表示的布尔类型
    let b = Boolean('Hello');
    expect(b).is.true;

    // 空字符串表示的布尔类型
    b = Boolean('');
    expect(b).is.false;

    // 非零数值表示的布尔类型
    b = Boolean(1);
    expect(b).is.true;

    // 数值零表示的布尔类型
    b = Boolean(0);
    expect(b).is.false;

    // 空数组表示的布尔类型, 注意: 空数组的布尔值为 true
    b = Boolean([]);
    expect(b).is.true;

    // 对象数组表示的布尔类型, 注意: 对象数组的布尔值为 true
    b = Boolean({});
    expect(b).is.true;

    // null 值表示的布尔类型
    b = Boolean(null);
    expect(b).is.false;

    // NaN 值表示的布尔类型
    b = Boolean(NaN);
    expect(b).is.false;

    // undefined 值表示的布尔类型
    b = Boolean(undefined);
    expect(b).is.false;
  });
});

/**
 * 测试 JSON 操作
 */
describe("test 'JSON' operator", () => {
  /**
   * 测试将 JSON 字符串转为对象
   */
  it("should parse 'JSON' string to Object", () => {
    // 将 "{}" 转为空对象
    let obj = JSON.parse('{}');
    expect(obj).is.deep.eq({});

    // 将 "true" 转为 true
    obj = JSON.parse('true');
    expect(obj).is.eq(true);

    // 将 '"foo"' 转为字符串, 注意: 需要包含双引号
    obj = JSON.parse('"foo"');
    expect(obj).is.eq('foo');

    // 将 "null" 转为 null
    obj = JSON.parse('null');
    expect(obj).is.null;

    // 将 JSON 字符串转为数组
    obj = JSON.parse('[1, 5, false]');
    expect(obj).is.deep.eq([1, 5, false]);

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
    expect(obj).is.deep.eq({
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
    expect(s).is.eq('{}');

    // 将 true 转为 "true"
    s = JSON.stringify(true);
    expect(s).is.eq('true');

    // 将 "foo" 转为 '"foo"'
    s = JSON.stringify('foo');
    expect(s).is.eq('"foo"');

    // 将 null 转为 "null"
    s = JSON.stringify(null);
    expect(s).is.eq('null');

    // 将数组转为 JSON 字符串
    s = JSON.stringify([1, 5, false]);
    expect(s).is.eq('[1,5,false]');

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
    expect(s).is.eq('{"a":100,"b":"Hello","c":false,"d":{"type":"array","value":[1,2,3]}}');
  });
});

/**
 * 测试 Symbol
 */
describe("test 'Symbol'", () => {
  // 定义匿名 Symbol, 必须通过引用变量使用

  const anonymousSymbol = Symbol();
  // 定义命名 Symbol, 可以通过相同的名称获取同一个 Symbol
  const namedSymbol = Symbol.for('symbol_one');

  /**
   * 将 Symbol 用于对象的 Key
   */
  it("should use 'Symbol' as object key", () => {
    // 定义一个以 Symbol 作为属性名的对象, 确认可以用 Symbol 对对象属性进行访问
    const obj = { [anonymousSymbol]: 100 };
    obj[namedSymbol] = 200;

    expect(obj[anonymousSymbol]).is.eq(100);
    expect(obj[namedSymbol]).is.eq(200);
  });

  /**
   * 将 Symbol 用于类属性或方法名
   */
  it("should use 'Symbol' as name of class field or method", () => {
    class SymbolInClass {
      // 将 Symbol 用于类方法名

      [anonymousSymbol]() {
        return 'get anonymousSymbol';
      }

      // 将 Symbol 用于类字段名
      [namedSymbol] = 100;
    }

    // 实例化对象, 确认可以通过 Symbol 访问对象中的属性和方法
    const s = new SymbolInClass();
    expect(s[anonymousSymbol]()).is.eq('get anonymousSymbol');
    expect(s[namedSymbol]).is.eq(100);
  });

  /**
   * 通过 Symbol 的名称获取实例
   */
  it("should get 'Symbol' instance by name", () => {
    const s = Symbol.for('symbol_one');
    expect(s).be.eq(namedSymbol);
  });
});
