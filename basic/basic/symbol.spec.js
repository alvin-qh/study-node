import { expect } from 'chai';

/**
 * 测试 `Symbol`
 */
describe("test 'Symbol'", () => {
  /**
   * 测试定义一个 `Symbol` 类型实例
   */
  it("should defined 'Symbol' type instance", () => {
    // 定义一个 `Symbol` 实例
    const symbol = Symbol();

    // 确认 `Symbol` 对象的类型名称为 `symbol`
    expect(typeof symbol).to.eq('symbol');
  });

  /**
   * 测试为 `Symbol` 实例添加描述
   */
  it("should add description to 'Symbol' instance", () => {
    // 定义一个具有描述的 `Symbol` 实例
    const symbol = Symbol('symbol_one');

    // 确认 `Symbol` 实例转为字符串的结果
    expect(symbol.toString()).to.eq('Symbol(symbol_one)');
    expect(String(symbol)).to.eq('Symbol(symbol_one)');

    // 确认 `Symbol` 对象的描述符为 'symbol_one'
    expect(symbol.description).to.eq('symbol_one');
  });

  /**
   * 将 `Symbol` 用于对象的 Key
   */
  it("should use 'Symbol' as object key", () => {
    // 定义两个 `Symbol` 实例
    const sName = Symbol('name');
    const sAge = Symbol('age');

    // 定义一个以 `Symbol` 作为属性名的对象
    const user = {
      [sName]: 'Alvin',
      [sAge]: 42,
    };

    // 通过 `Symbol` 实例为对象添加新方法
    const sFormat = Symbol('format');
    user[sFormat] = function () {
      return `Name: ${this[sName]}, Age: ${this[sAge]}`;
    };

    // 确认可以用 `Symbol` 实例对对象属性进行访问
    expect(user[sName]).to.eq('Alvin');
    expect(user[sAge]).to.eq(42);
    expect(user[sFormat]()).to.eq('Name: Alvin, Age: 42');
  });

  /**
   * 测试命名 `Symbol` 实例
   *
   * 通过 `Symbol.for` 函数可以通过一个字符串 (名称) 创建 `Symbol` 实例,
   * 当再次用相同的字符串 (名称) 通过 `Symbol.for` 函数创建时, 会返回同一个 `Symbol` 实例
   */
  it("should create 'Symbol' instance by name", () => {
    // 对于直接创建的 `Symbol` 对象, 称为 '匿名' `Symbol`,
    // 对于 '匿名' `Symbol`, 每次创建的对象都为新对象, 和之前创建的 `Symbol` 对象不同
    const s1 = Symbol();
    const s2 = Symbol();
    expect(s1 === s2).is.false;

    // 即便为 `Symbol` 加上描述, 其也是匿名 `Symbol` 对象
    const s3 = Symbol('symbol_one');
    const s4 = Symbol('symbol_one');
    expect(s3 === s4).is.false;

    // 通过 `Symbol.for` 函数可以通过一个字符串 (名称) 创建 `Symbol` 实例, 称为 '命名' `Symbol` 对象
    // 通过同一个字符串 (名称) 创建的 '命名' `Symbol` 对象, 是同一个对象
    // 注意: '命名' `Symbol` 的名称登记时全局的, 不受任何作用域范围影响
    const s5 = Symbol.for('symbol_two');
    const s6 = Symbol.for('symbol_two');
    expect(s5 === s6).is.true;

    // 如果通过 `Symbol.keyFor` 方法获取一个 '匿名' `Symbol` 实例的名称, 将返回 `undefined`
    let key = Symbol.keyFor(s3);
    expect(key).is.undefined;

    // 对于已经创建的 '命名' `Symbol` 实例, 可以通过 `Symbol.keyFor` 方法获取其名称
    key = Symbol.keyFor(s5);
    expect(key).to.eq('symbol_two');

    key = Symbol.keyFor(s6);
    expect(key).to.eq('symbol_two');
  });

  /**
   * 测试将 `Symbol` 作为类的属性或方法定义
   *
   * 正常情况下, 无法通过 `Object.keys` 返回一个对象中通过 `Symbol` 定义的属性或方法,
   * 需要通过 `Object.getOwnPropertySymbols` 方法进行获取
   */
  it("should define 'class' properties or methods by 'Symbol'", () => {
    const sName = Symbol('name');
    const sAge = Symbol('age');
    const sFormat = Symbol('format');

    /**
     * 定义类
     */
    class User {
      // 通过 `Symbol` 定义类属性
      [sName];
      [sAge];

      constructor(name, age) {
        // 通过 `Symbol` 为类属性复制
        this[sName] = name;
        this[sAge] = age;
      }

      /**
       * 通过 `Symbol` 定义类方法
       * @returns 对象格式化结果
       */
      [sFormat]() {
        return `Name: ${this[sName]}, Age: ${this[sAge]}`;
      }
    }

    // 实例化 `User` 对象, 并确认通过 `Symbol` 访问属性值和方法
    const user = new User('Alvin', 42);
    expect(user[sName]).to.eq('Alvin');
    expect(user[sAge]).to.eq(42);
    expect(user[sFormat]()).to.eq('Name: Alvin, Age: 42');

    // 遍历对象中通过 `Symbol` 定义的属性和方法
    Object.getOwnPropertySymbols(user).forEach((key) => {
      switch (key) {
        case sName:
          expect(user[key]).to.eq('Alvin');
          break;
        case sAge:
          expect(user[key]).to.eq(42);
          break;
        case sFormat:
          expect(user[key]()).to.eq('Name: Alvin, Age: 42');
          break;
        default:
          expect.fail();
      }
    });
  });
});

/**
 * 测试系统内置的 `Symbol` 实例
 *
 * 系统内置的 `Symbol` 实例都集合在 `Symbol` 类型中, 通过静态属性访问
 *
 * @see https://www.bookstack.cn/read/es6-3rd/spilt.8.docs-symbol.md
 */
describe("test built-in 'Symbol' instances", () => {
  /**
   * 改变对象的类型比较行为
   *
   * 默认情况下, 通过 `instanceof` 操作符进行类型比较时, 会比较对象的 `[[Prototype]]` 属性
   * 通过 `Symbol.hasInstance` 方法可以改变对象的类型比较行为, 使其比较指定的其它类型
   */
  it("'Symbol.hasInstance'", () => {
    /**
     * 定义测试类型, 改变其 `instanceof` 比较行为
     */
    class A {
      /**
       * 静态方法, 用于 `obj instanceof A` 的比较行为
       *
       * @param {Object} obj 待比较的任意对象类型
       * @returns `obj` 参数和 `Array` 类型比较结果
       */
      static [Symbol.hasInstance](obj) {
        return obj instanceof Array;
      }

      /**
       * 用于 `obj instanceof new A()` 的比较行为
       *
       * @param {Object} obj 待比较的任意对象类型
       * @returns `obj` 参数和 `Date` 类型比较结果
       */
      [Symbol.hasInstance](obj) {
        return obj instanceof Date;
      }
    }

    // 确认数组实例和 `A` 类型的 `instanceof` 结果为 `true`
    expect([1, 2, 3] instanceof A).is.true;

    // 确认日期对象和 `new A()` 对象的 `instanceof` 结果为 `true`
    const a = new A();
    expect(new Date() instanceof a).is.true;
  });
});
