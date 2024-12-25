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
    };

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
    };

    // 确认数组实例和 `A` 类型的 `instanceof` 结果为 `true`
    expect([1, 2, 3] instanceof A).is.true;

    // 确认日期对象和 `new A()` 对象的 `instanceof` 结果为 `true`
    const a = new A();
    expect(new Date() instanceof a).is.true;
  });

  /**
   * 测试数组连接 (`Array.concat`) 方法的展开特性
   *
   * 数组对象中通过 `Symbol.isConcatSpreadable` 符号定义的属性指定了当数组执行 `concat` 方法时,
   * 是否将被连接的数组进行展开
   */
  describe("'Symbol.isConcatSpreadable'", () => {
    /**
     * 设置数组对象的 `Symbol.isConcatSpreadable` 属性
     */
    it('for Array object', () => {
      // 定义数组
      const arr = ['c', 'd'];

      // 确认默认情况下, 被连接的数组会展开为元素
      let r = ['a', 'b'].concat(arr, 'e');
      expect(r).to.deep.eq(['a', 'b', 'c', 'd', 'e']);

      // 将数组中通过 `Symbol.isConcatSpreadable` 符号指定的属性设置为 `false`
      arr[Symbol.isConcatSpreadable] = false;

      // 确认被连接的数组不再被展开
      r = ['a', 'b'].concat(arr, 'e');
      expect(r).to.deep.eq(['a', 'b', ['c', 'd'], 'e']);
    });

    /**
     * 设置类的 `Symbol.isConcatSpreadable` 属性
     */
    it('for Array class', () => {
      /**
       * 定义一个数组类型
       */
      class NoConcatSpreadArray extends Array {
        constructor(...args) {
          super(...args);
          // 通过 `Symbol.isConcatSpreadable` 符号指定该类型的数组不会被展开
          // this[Symbol.isConcatSpreadable] = false;
        }

        // 通过 `Symbol.isConcatSpreadable` 符号指定该类型的数组不会被展开
        get [Symbol.isConcatSpreadable]() {
          return false;
        }
      };

      // 定义数组
      const arr = new NoConcatSpreadArray('c', 'd');

      // 确认默认情况下, 被连接的数组会展开为元素
      let r = ['a', 'b'].concat(arr, 'e');
      expect(r).to.deep.eq(['a', 'b', ['c', 'd'], 'e']);
    });
  });

  /**
   * 定义某类型对象的衍生对象的类型
   *
   * 对于一个类 `A`, 假设其具备方法 `a`, 仍返回一个 `A` 类型对象, 当一个类 `B` 从类 `A` 继承后,
   * 通过 `B` 类对象调用 `a` 方法, 则会返回一个 `B` 类型对象
   */
  it("'Symbol.species'", () => {
    /**
     * 定义 `Array` 类的子类 `Array1`
     */
    class Array1 extends Array {
      constructor(...args) {
        super(...args);
      }
    };

    // 实例化 `Array1` 类型对象, 该对象同时也是 `Array` 类型
    let a1 = new Array1(1, 2, 3);
    expect(a1).to.instanceof(Array);
    expect(a1).to.instanceof(Array1);

    // 调用 `Array1` 的 `map` 方法, 返回的对象类型为 `Array1` (同时也是 `Array` 类型)
    a1 = a1.map((item) => item * 2);
    expect(a1).to.instanceof(Array);
    expect(a1).to.instanceof(Array1);

    /**
     * 定义 `Array` 类的子类 `Array2`
     */
    class Array2 extends Array {
      constructor(...args) {
        super(...args);
      }

      /**
       * 设置 `Symbol.species` 属性, 令属性值为 `Array` 类型
       */
      static get [Symbol.species]() {
        return Array;
      }
    };

    // 实例化 `Array2` 类型对象, 该对象同时也是 `Array` 类型
    let a2 = new Array2(1, 2, 3);
    expect(a2).to.instanceof(Array);
    expect(a2).to.instanceof(Array2);

    // 调用 `Array2` 的 `map` 方法, 返回的对象类型为 `Array` 类型, 不再为 `Array2` 类型
    a2 = a2.map((item) => item * 2);
    expect(a2).to.instanceof(Array);
    expect(a2).not.to.instanceof(Array2);
  });

  /**
   * 定义一个类型对象如何作为 `String.match` 方法的参数
   *
   * 一般情况下, `String.match` 方法的参数为正则表达式对象, 如果为其它类型参数, 则需要为该参数类型 (或该参数对象)
   * 添加由 `Symbol.match` 符号定义的方法
   */
  describe("'Symbol.match'", () => {
    it('for Class', () => {
      /**
       * 定义类型, 具备使用 `Symbol.match` 符号定义的方法
       */
      class A {
        /**
         * 仅当参数为 `hello` 时, 返回 `true`
         *
         * @param {String} s 待匹配的字符串
         * @returns {Boolean} 是否匹配
         */
        [Symbol.match](s) {
          return s === 'hello';
        }
      }

      // 定义对象
      const a = new A();

      // 将对象用于 `String.match` 方法的参数
      let r = 'hello'.match(a);
      expect(r).is.true;

      r = 'world'.match(a);
      expect(r).is.false;
    });

    /**
     * 定义对象, 具备使用 `Symbol.match` 符号定义的方法
     */
    it('for object', () => {
      // 定义一个具备 `Symbol.match` 符号方法的对象
      const obj = {
        /**
         * 仅当参数为 `hello` 时, 返回 `true`
         *
         * @param {String} s 待匹配的字符串
         * @returns {Boolean} 是否匹配
         */
        [Symbol.match](s) {
          return s === 'hello';
        },
      };

      // 将对象用于 `String.match` 方法的参数
      let r = 'hello'.match(obj);
      expect(r).is.true;

      r = 'world'.match(obj);
      expect(r).is.false;
    });
  });

  /**
   * 定义一个类型对象如何作为 `String.replace` 方法的参数
   *
   * 一般情况下, `String.replace` 方法的参数为正则表达式对象, 如果为其它类型参数, 则需要为该参数类型 (或该参数对象)
   * 添加由 `Symbol.replace` 符号定义的方法
   */
  describe("'Symbol.replace'", () => {
    /**
     * 定义类型, 具备使用 `Symbol.replace` 符号定义的方法
     */
    it('for Class', () => {
      /**
       * 定义一个具备使用 `Symbol.replace` 符号方法的类型
       */
      class A {
        /**
         * 返回两个参数连接后的字符串
         *
         * @param {String} src 原字符串
         * @param {String} dest 待替换的字符串
         * @returns {String} 两个字符串连接的结果 (并未进行所需的替换操作)
         */
        [Symbol.replace](src, dest) {
          return `${src}-${dest}`;
        }
      }

      // 定义对象
      const a = new A();

      // 将对象用于 `String.replace` 方法的参数
      let r = 'hello'.replace(a, 'world');
      expect(r).to.eq('hello-world');
    });

    /**
     * 定义对象, 具备使用 `Symbol.match` 符号定义的方法
     */
    it('for object', () => {
      // 定义一个具备 `Symbol.match` 符号方法的对象
      const obj = {
        /**
         * 返回两个参数连接后的字符串
         *
         * @param {String} src 原字符串
         * @param {String} dest 待替换的字符串
         * @returns {String} 两个字符串连接的结果 (并未进行所需的替换操作)
         */
        [Symbol.replace](src, dest) {
          return `${src}-${dest}`;
        },
      };

      // 将对象用于 `String.replace` 方法的参数
      let r = 'hello'.replace(obj, 'world');
      expect(r).to.eq('hello-world');
    });
  });

  /**
   * 定义一个类型对象如何作为 `String.search` 方法的参数
   *
   * 一般情况下, `String.search` 方法的参数为正则表达式对象, 如果为其它类型参数, 则需要为该参数类型 (或该参数对象)
   * 添加由 `Symbol.search` 符号定义的方法
   */
  describe("'Symbol.search'", () => {
    /**
     * 定义类型, 具备使用 `Symbol.search` 符号定义的方法
     */
    it('for Class', () => {
      /**
       * 定义一个具备使用 `Symbol.search` 符号方法的类型
       */
      class A {
        /**
         * 返回待查找字符串是否为 `'hello'`
         *
         * @param {String} s 待查找的字符串
         * @returns {String} 返回查找结果, 这里为 `s` 参数是否为 `hello`
         */
        [Symbol.search](s) {
          return s === 'hello';
        }
      }

      // 定义对象
      const a = new A();

      // 将对象用于 `String.search` 方法的参数
      let r = 'hello'.search(a);
      expect(r).is.true;
    });

    /**
     * 定义对象, 具备使用 `Symbol.search` 符号定义的方法
     */
    it('for object', () => {
      // 定义一个具备 `Symbol.search` 符号方法的对象
      const obj = {
        /**
         * 返回待查找字符串是否为 `'hello'`
         *
         * @param {String} s 待查找的字符串
         * @returns {String} 返回查找结果, 这里为 `s` 参数是否为 `hello`
         */
        [Symbol.search](s) {
          return s === 'hello';
        },
      };

      // 将对象用于 `String.search` 方法的参数
      let r = 'hello'.search(obj);
      expect(r).is.true;
    });
  });

  /**
   * 定义一个类型对象如何作为 `String.split` 方法的参数
   *
   * 一般情况下, `String.split` 方法的参数为正则表达式对象, 如果为其它类型参数, 则需要为该参数类型 (或该参数对象)
   * 添加由 `Symbol.search` 符号定义的方法
   */
  describe("'Symbol.split'", () => {
    /**
     * 定义类型, 具备使用 `Symbol.split` 符号定义的方法
     */
    it('for Class', () => {
      /**
       * 定义一个具备使用 `Symbol.split` 符号方法的类型
       */
      class A {
        /**
         * 返回字符串各字符通过 `,` 连接的结果
         *
         * @param {String} s 待分割字符串
         * @returns {String} 字符串各字符通过 `,` 连接的结果
         */
        [Symbol.split](s) {
          return [...s].join(',');
        }
      }

      // 定义对象
      const a = new A();

      // 将对象用于 `String.split` 方法的参数
      let r = 'hello'.split(a);
      expect(r).to.eq('h,e,l,l,o');
    });

    /**
     * 定义对象, 具备使用 `Symbol.split` 符号定义的方法
     */
    it('for object', () => {
      // 定义一个具备 `Symbol.split` 符号方法的对象
      const obj = {
        /**
         * 返回字符串各字符通过 `,` 连接的结果
         *
         * @param {String} s 待分割字符串
         * @returns {String} 字符串各字符通过 `,` 连接的结果
         */
        [Symbol.split](s) {
          return [...s].join(',');
        },
      };

      // 将对象用于 `String.split` 方法的参数
      let r = 'hello'.split(obj);
      expect(r).to.eq('h,e,l,l,o');
    });
  });

  /**
   * 为类型或对象定义迭代器
   *
   * ES6 的迭代器通过 `Symbol.iterator` 符号方法定义, 该方法返回一个包含 `next` 方法的对象, 用于进行迭代,
   * 参见 './iter.spec.js'
   */
  describe("'Symbol.iterator'", () => {
    /**
     * 为类定义迭代器方法
     */
    it('for Class', () => {
      class A {
        constructor(value) {
          this.value = value;
        }

        /**
         * 定义迭代器方法
         *
         * @returns {Iterator<String>} 迭代器对象
         */
        [Symbol.iterator]() {
          const self = this;
          let index = 0;

          // 返回迭代器对象, 包含 next(), return() 以及 throw() 三个方法
          // 注意, 返回为一个新对象, 其内部 this 会发生变化, 需要通过 self 变量桥接或者使用箭头函数避免产生 this
          return {
            next() {
              if (index < self.value.length) {
                return { value: self.value[index++], done: false };
              } else {
                return { value: undefined, done: true };
              }
            },
            // return(value) {
            //   return { done: true, value };
            // },
            // throw(value) {
            //   return { done: true, value };
            // },
          };
        }
      }

      // 定义类型 `A` 实例, 并将其进行迭代
      const a = new A('hello');
      expect([...a]).to.deep.eq(['h', 'e', 'l', 'l', 'o']);
    });

    /**
     * 为对象定义迭代器方法
     */
    it('for object', () => {
      // 定义具备迭代器方法的对象
      const obj = {
        value: 'hello',

        /**
         * 定义迭代器方法
         *
         * @returns {Iterator<String>} 迭代器对象
         */
        [Symbol.iterator]() {
          const self = this;
          let index = 0;

          // 返回迭代器对象, 包含 next(), return() 以及 throw() 三个方法
          // 注意, 返回为一个新对象, 其内部 this 会发生变化, 需要通过 self 变量桥接或者使用箭头函数避免产生 this
          return {
            next() {
              if (index < self.value.length) {
                return { value: self.value[index++], done: false };
              } else {
                return { value: undefined, done: true };
              }
            },
            // return(value) {
            //   return { done: true, value };
            // },
            // throw(value) {
            //   return { done: true, value };
            // },
          };
        },
      };

      // 将对象进行迭代
      expect([...obj]).to.deep.eq(['h', 'e', 'l', 'l', 'o']);
    });
  });

  /**
   * 测试定义类型转换方法, 将对象转为基本类型值
   *
   * 通过对象的 `Symbol.toPrimitive` 符号方法, 可以将对象转为基本类型值
   */
  describe("'Symbol.toPrimitive'", () => {
    /**
     * 为类定义隐式转换方法
     */
    it('for Class', () => {
      class A {
        constructor(value) {
          this.value = value;
        }

        /**
         * 定义隐式转换方法, 将当前对象转为 `number` 或 `string` 类型
         *
         * @param {string} hint 类型说明字符串, 可以为 `number`, `string` 或 `default`
         * @returns {string|number} 转换后的值
         */
        [Symbol.toPrimitive](hint) {
          switch (hint) {
            case 'string':
              return this.value;
            case 'number':
              return parseFloat(this.value);
            case 'default':
              return `${this.value}-default`;
            default:
              throw new Error(`hint: ${hint} is not supported`);
          }
        }
      }

      // 定义类型 `A` 实例, 并对其进行隐式转换
      const a = new A('456');

      expect(+a).to.eq(456);  // 隐式转为 `number` 类型
      expect(`${a}`).to.eq('456'); // 隐式转为 `string` 类型
      expect(a + '').to.eq('456-default'); // 隐式转为 `default` 类型
    });

    /**
     * 为对象定义隐式转换
     */
    it('for object', () => {
      // 定义具备迭代器方法的对象
      const obj = {
        value: '456',

        /**
         * 定义隐式转换方法, 将当前对象转为 `number` 或 `string` 类型
         *
         * @param {string} hint 类型说明字符串, 可以为 `number`, `string` 或 `default`
         * @returns {string|number} 转换后的值
         */
        [Symbol.toPrimitive](hint) {
          switch (hint) {
            case 'string':
              return this.value;
            case 'number':
              return parseFloat(this.value);
            case 'default':
              return `${this.value}-default`;
            default:
              throw new Error(`hint: ${hint} is not supported`);
          }
        },
      };

      // 将对象类型进行隐式转换
      expect(+obj).to.eq(456);  // 隐式转为 `number` 类型
      expect(`${obj}`).to.eq('456'); // 隐式转为 `string` 类型
      expect(obj + '').to.eq('456-default'); // 隐式转为 `default` 类型
    });
  });

  /**
   * 测试定义对象转为字符串的 `toString` 方法结果
   *
   * 一般情况下, 通过对象的 `toString` 方法得到的结果为 `[object Object]`,
   * 可以通过对象的 `Symbol.toStringTag` 符号方法, 将 `toString` 结果的第二个 `Object` 进行修改,
   * 例如 `[object Hello]` 之类
   */
  describe("'Symbol.toStringTag'", () => {
    /**
     * 为类定义字符串转换方法
     */
    it('for Class', () => {
      class A {
        constructor(value) {
          this.value = value;
        }

        /**
         * 定义对象转字符串的方法
         *
         * @returns {string} 转换后的字符串
         */
        get [Symbol.toStringTag]() {
          return `${this.value}`;
        }
      }

      // 定义类型 `A` 实例, 并对其进行隐式转换
      const a = new A(123);
      expect(a.toString()).to.eq('[object 123]');
    });

    /**
     * 为对象定义字符串转换方法
     */
    it('for object', () => {
      // 定义具备迭代器方法的对象
      const obj = {
        value: 123,

        /**
         * 定义对象转字符串的方法
         *
         * @returns {string} 转换后的字符串
         */
        get [Symbol.toStringexitTag]() {
          return `${this.value}`;
        },
      };

      // 将对象类型进行隐式转换
      expect(obj.toString()).to.eq('[object 123]');
    });
  });
});
