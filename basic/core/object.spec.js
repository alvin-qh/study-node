import { expect } from '@jest/globals';

/**
 * 测试 `Object` 类型
 */
describe("test 'Object' class", () => {
  /**
   * 测试为对象或类原型定义属性
   */
  describe("'Object.defineProperty'", () => {
    /**
     * 测试为对象定义可读写属性
     */
    it('should define read/write property for exist object', () => {
      class A { };
      const a = new A();

      // 为 `a` 对象定义 `value` 属性, 初始值为 `10`, 且属性值可修改
      Object.defineProperty(a, 'value', {
        value: 10,
        writable: true,
        configurable: true,
      });

      // 确认对象上具备 `value` 属性, 且初始值为 `10`
      expect(a.value).toEqual(10);

      // 修改 `value` 属性值为 `20`
      a.value = 20;
      expect(a.value).toEqual(20);
    });

    /**
     * 测试为类定义只读属性
     */
    it('should define readonly property for exist object', () => {
      class A { };
      const a = new A();

      // 为 `a` 对象定义 `name` 属性, 初始值为 `Alvin`, 且属性值只读
      Object.defineProperty(a, 'name', {
        value: 'Alvin',
        writable: false,
        configurable: true,
      });

      // 确认对象的 `name` 属性值
      expect(a.name).toEqual('Alvin');

      // 确认修改对象的 `name` 属性值会导致异常抛出
      expect(() => a.name = 'Emma').toThrow(TypeError);
    });

    /**
     * 测试为对象定义只读属性
     */
    it('should define get/set methods as property for exist object', () => {
      class A { };
      const a = new A();

      // 为 `a` 对象定义 `age` 属性, 并通过 `get` 和 `set` 方法访问属性值
      Object.defineProperty(a, 'age', {
        /**
         * 获取 `age` 属性的值
         *
         * @returns {string} `age` 属性值
         */
        get() {
          return `${this._age} years old`;
        },

        /**
         * 设置 `age` 属性的值
         *
         * @param {number|string} value `age` 属性值
         */
        set(value) {
          this._age = parseInt(value);
        },
        configurable: true,
      });

      // 调用 `set` 方法设置 `age` 属性值
      a.age = '20';

      // 调用 `get` 方法获取 `age` 属性值
      expect(a.age).toEqual('20 years old');
    });

    /**
     * 测试为 `a` 对象定义不可配置属性
     *
     * 不可配置属性表示: 该属性一旦被定义, 则无法删除和修改
     */
    it('should define unconfigurable property to exist object', () => {
      class A { };
      const a = new A();

      // 为类型定义属性, 该属性可配置
      Object.defineProperty(a, 'name', {
        value: 'Alvin',
        writable: true,
        configurable: true,
      });
      expect(a.name).toEqual('Alvin');

      // 可删除可配置属性
      delete a.name;
      expect(a.name).toBeUndefined();

      // 修改已定义属性为非可配置属性
      Object.defineProperty(a, 'name', {
        value: 'Alvin',
        writable: true,
        configurable: false,
      });
      expect(a.name).toEqual('Alvin');

      // 此时该属性无法删除
      expect(() => delete a.name).toThrow(TypeError);

      // 此时该属性无法再次定义 (被修改)
      expect(() => {
        Object.defineProperty(a, 'name', {
          value: 'Emma',
          writable: true,
          configurable: true,
        });
      }).toThrow(TypeError);
    });

    /**
     * 测试为对象定义不可枚举属性
     */
    it('should define unenumerable property to exist object', () => {
      class A { };
      const a = new A();

      // 为 `a` 对象定义属性, 该属性可枚举
      Object.defineProperty(a, 'name', {
        value: 'Alvin',
        enumerable: true,
        configurable: true,
      });

      // 确认 `name` 属性可枚举
      expect(a.name).toEqual('Alvin');
      expect(Object.keys(a)).toEqual(['name']);

      // 将属性修改为不可枚举
      Object.defineProperty(a, 'name', {
        value: 'Alvin',
        enumerable: false,
        configurable: true,
      });

      // 确认 `name` 属性不可枚举
      expect(a.name).toEqual('Alvin');
      expect(Object.keys(a)).toEqual([]);
    });

    /**
     * 测试为类的原型链定义属性
     */
    it('should define property for prototype of class', () => {
      class A { };
      const a = new A();

      // 为不存在的对象定义属性
      Object.defineProperty(A.prototype, 'name', {
        value: 'Alvin',
        writable: true,
        enumerable: true,
        configurable: true,
      });

      expect(a.name).toEqual('Alvin');

      a.name = 'Emma';
      expect(a.name).toEqual('Emma');
    });
  });

  /**
   * 测试 `Object.defineProperties` 方法
   *
   * `Object.defineProperties` 方法用于为对象定义多个属性, 每个属性的定义方式和通过 `Object.defineProperty` 定义单个属性的方式一致
   */
  it("'Object.defineProperties'", () => {
    const obj = {};

    // 为 `obj` 对象定义一系列属性
    Object.defineProperties(obj, {
      // 定义 `name` 属性
      name: {
        value: 'Alvin',
        writable: true,
        enumerable: true,
        configurable: true,
      },

      // 定义 `age` 属性
      age: {
        /**
         * 获取 `age` 属性的值
         *
         * @returns {string} `age` 属性值
         */
        get() {
          return `${this._age} years old`;
        },
        /**
         * 设置 `age` 属性的值
         * @param {string|number} value `age` 属性值
         */
        set(value) {
          this._age = parseInt(value);
        },
        enumerable: true,
        configurable: true,
      },
    });

    expect(obj.name).toEqual('Alvin');

    obj.age = '20';
    expect(obj.age).toEqual('20 years old');
  });

  /**
   * 测试 `Object.getOwnPropertyDescriptor` 方法
   *
   * `Object.getOwnPropertyDescriptor` 方法用于获取对象属性的定义, 和通过 `Object.defineProperty` 方法进行属性定义的属性一致
   */
  it("'Object.getOwnPropertyDescriptor'", () => {
    // 定义对象
    const obj = {
      name: 'Alvin',
      get age() {
        return `${this._age} years old`;
      },
      set age(value) {
        this._age = parseInt(value);
      },
    };

    // 获取对象的 `name` 属性定义, 确认属性定义
    const nameDescriptor = Object.getOwnPropertyDescriptor(obj, 'name');
    expect(nameDescriptor).toEqual({
      value: 'Alvin',
      writable: true,
      enumerable: true,
      configurable: true,
    });

    // 获取对象的 `age` 属性定义, 确认属性定义
    const ageDescriptor = Object.getOwnPropertyDescriptor(obj, 'age');
    expect(ageDescriptor.get).toBeInstanceOf(Function);
    expect(ageDescriptor.set).toBeInstanceOf(Function);
    expect(ageDescriptor.enumerable).toBeTruthy();
    expect(ageDescriptor.configurable).toBeTruthy();
  });

  /**
   * 测试 `Object.getOwnPropertyDescriptors` 方法
   *
   * `Object.getOwnPropertyDescriptors` 方法用于获取对象属性的定义, 和通过 `Object.defineProperties` 方法进行属性定义的属性一致
   */
  it("'Object.getOwnPropertyDescriptors'", () => {
    // 定义对象
    const obj = {
      name: 'Alvin',
      get age() {
        return `${this._age} years old`;
      },
      set age(value) {
        this._age = parseInt(value);
      },
    };

    // 获取对象的属性定义
    const descriptors = Object.getOwnPropertyDescriptors(obj);

    // 确认属性定义
    expect(descriptors.name).toEqual({
      value: 'Alvin',
      writable: true,
      enumerable: true,
      configurable: true,
    });

    // 确认 `get/set` 属性定义
    expect(descriptors.age.get).toBeInstanceOf(Function);
    expect(descriptors.age.set).toBeInstanceOf(Function);
    expect(descriptors.age.enumerable).toBeTruthy();
    expect(descriptors.age.configurable).toBeTruthy();
  });

  /**
   * 测试 `Object.is` 方法
   *
   * `Object.is` 方法用于比较两个值是否 "严格" 相等, 类似于 `===` 运算符的作用
   */
  it("'Object.is'", () => {
    expect(Object.is(100, 100)).toBeTruthy();
    expect(Object.is(NaN, NaN)).toBeTruthy();

    expect(Object.is(+0, -0)).toBeFalsy();
    expect(Object.is({}, {})).toBeFalsy();
    expect(Object.is(100, '100')).toBeFalsy();
    expect(Object.is({ a: 100, b: true }, { b: true, a: 100 })).toBeFalsy();
  });

  /**
   * 测试 `Object.freeze` 方法
   *
   * 该方法用于将对象进行 "冻结", 即对象的所有属性都不能进行修改
   *
   * 可通过 `Object.isFrozen` 方法判断一个对象是否被 "冻结"
   */
  it("'Object.freeze'", () => {
    // 定义对象
    const obj = {
      name: '',
      get age() {
        return `${this._age} years old`;
      },
      set age(value) {
        this._age = parseInt(value);
      },
    };

    // 设置对象属性值
    obj.name = 'Emma';
    obj.age = '20';

    // 将对象进行 "冻结"
    // 注意, `Object.freeze` 方法会将作为其参数的 `obj` 进行冻结, 该方法的返回值和参数指向同一个被冻结的对象
    const frozenObj = Object.freeze(obj);

    // 确认被冻结的对象可以正常读取属性值
    expect(obj.name).toEqual('Emma');
    expect(obj.age).toEqual('20 years old');

    // 确认被冻结的对象无法修改属性值
    expect(() => obj.name = 'Alvin').toThrow(TypeError);
    expect(() => obj.age = '21').toThrow(TypeError);

    // 通过 `Object.isFrozen` 方法判断一个对象是否被 "冻结"
    expect(Object.isFrozen(obj)).toBeTruthy();
    expect(Object.isFrozen(frozenObj)).toBeTruthy();
  });

  /**
   * 测试 `Object.seal` 方法
   *
   * 该方法用于将对象进行 "密封", 密封后的对象无法添加和修改属性定义
   *
   * 可通过 `Object.isSeal` 方法判断一个对象是否被 "密封"
   */
  it("'Object.seal'", () => {
    // 定义对象
    const obj = {
      name: '',
      _age: 0,
      get age() {
        return `${this._age} years old`;
      },
      set age(value) {
        this._age = parseInt(value);
      },
    };

    // 将对象进行 "密封"
    // 注意, `Object.seal` 方法会将作为其参数的 `obj` 进行密封, 该方法的返回值和参数指向同一个被密封的对象
    const sealedObj = Object.seal(obj);

    // 确认被密封的对象可以正常读写属性值
    obj.name = 'Emma';
    expect(obj.name).toEqual('Emma');

    obj.age = '20';
    expect(obj.age).toEqual('20 years old');

    // 确认无法为密封对象添加或删除属性
    expect(() => obj.gender = 'M').toThrow(TypeError);
    expect(() => delete obj.name).toThrow(TypeError);

    // 确认无法重新定义密封对象的属性值
    expect(() => {
      Object.defineProperty(obj, 'name', {
        value: 'Alvin',
        writable: true,
        enumerable: false,
        configurable: true,
      });
    }).toThrow(TypeError);

    // 通过 `Object.isSealed` 方法判断一个对象是否被 "冻结"
    expect(Object.isSealed(obj)).toBeTruthy();
    expect(Object.isSealed(sealedObj)).toBeTruthy();
  });

  /**
   * 测试 `Object.hasOwn` 方法
   *
   * 如果一个对象具备指定的属性 (或方法), 则 `Object.hasOwn` 方法返回 `true`;
   * 如果一个对象不具备指定的属性 (或方法), 或指定的属性 (或方法) 为继承而来, 则返回 `false`
   */
  it("'Object.hasOwn'", () => {
    // 定义对象
    const obj = {
      name: '',
      _age: 0,
      get age() {
        return `${this._age} years old`;
      },
      set age(value) {
        this._age = parseInt(value);
      },
    };

    // 确认对象是否具备指定的属性
    expect(Object.hasOwn(obj, 'name')).toBeTruthy();
    expect(Object.hasOwn(obj, 'age')).toBeTruthy();
    expect(Object.hasOwn(obj, 'gender')).toBeFalsy();

    // 定义对象, 该对象本身不具备直接属性, 所有属性均通过原型继承获得
    const objExt = {
      __proto__: {
        name: 'Alvin',
        _age: 20,
        get age() {
          return `${this._age} years old`;
        },
        set age(value) {
          this._age = parseInt(value);
        },
      },
    };

    // 可以访问对象原型中的属性
    expect(objExt.name).toEqual('Alvin');
    expect(objExt.age).toEqual('20 years old');

    // 确认对象原型中的属性并不作为对象的直接属性
    expect(Object.hasOwn(objExt, 'name')).toBeFalsy();
    expect(Object.hasOwn(objExt, 'age')).toBeFalsy();
  });

  /**
   * 测试 `Object.create` 方法
   *
   * `Object.create` 方法用于创建一个新对象, 并将其原型指向指定的对象
   */
  it("'Object.create'", () => {
    // 定义对象
    const obj = {
      name: '',
      _age: 0,
      get age() {
        return `${this._age} years old`;
      },
      set age(value) {
        this._age = parseInt(value);
      },
    };

    // 创建一个新对象, 并将其原型指向 `obj`
    const newObj = Object.create(obj);

    // 确认新对象的原型指向 `obj`
    expect(Object.getPrototypeOf(newObj)).toEqual(obj);

    // 确认新对象可以正常读取属性值
    newObj.name = 'Emma';
    expect(newObj.name).toEqual('Emma');

    newObj.age = '20';
    expect(newObj.age).toEqual('20 years old');
  });

  /**
   * 测试 `Object.setPrototypeOf`/`Object.getPrototypeOf` 方法
   *
   * 这两个方法中, 前者用于设置对象的原型信息, 后者用于获取对象的原型信息, 即对象的 `__proto__` 属性所指向的对象
   */
  it("'Object.getPrototypeOf'/'Object.setPrototypeOf'", () => {
    // 定义对象
    const obj = {
      name: 'Alvin',
      _age: 20,
      get age() {
        return `${this._age} years old`;
      },
      set age(value) {
        this._age = parseInt(value);
      },
    };

    // 定义一个新对象
    const newObj = {};

    // 为新对象设置原型
    Object.setPrototypeOf(newObj, obj);

    // 确认新对象从原型继承了属性
    expect(newObj.name).toEqual('Alvin');
    expect(newObj.age).toEqual('20 years old');

    // 确认新对象的原型指向
    expect(Object.getPrototypeOf(newObj)).toEqual(obj);
  });

  /**
   * 测试 `Object.assign` 方法
   *
   * `Object.assign` 方法用于将多个对象的属性合并到一个对象中
   */
  it("'Object.assign'", () => {
    // 定义对象
    const o1 = {
      a: 'a',
      b: 'b',
    };

    const o2 = {
      c: 'c',
      d: 'd',
    };

    const o3 = {
      a: 'A',
      d: 'D',
    };

    // 定义一个新对象
    const obj = {};

    // 合并对象属性, 将后续对象的属性合并到第一个参数传入的对象中
    // 如果属性相同, 则后面对象的属性会覆盖前面对象的属性
    // 返回结果和第一个参数相同
    const result = Object.assign(obj, o1, o2, o3);
    expect(result).toEqual(obj);

    // 确认对象属性进行合并
    expect(obj.a).toEqual('A');
    expect(obj.b).toEqual('b');
    expect(obj.c).toEqual('c');
    expect(obj.d).toEqual('D');
  });

  /**
   * 测试 `Object.keys`/`Object.values`/`Object.entries` 方法
   *
   * 该方法用于获取对象的属性名, 属性值以及属性键值对
   */
  it("'Object.keys'/'Object.values'/'Object.entries'", () => {
    // 定义对象
    const obj = {
      a: 'A',
      b: 'B',
      c: 'C',
      d: 'D',
    };

    // 获取对象的属性名
    expect(Object.keys(obj)).toEqual(['a', 'b', 'c', 'd']);

    // 获取对象的属性值
    expect(Object.values(obj)).toEqual(['A', 'B', 'C', 'D']);

    // 获取对象的属性键值对
    expect(Object.entries(obj)).toEqual([
      ['a', 'A'],
      ['b', 'B'],
      ['c', 'C'],
      ['d', 'D'],
    ]);
  });

  /**
   * 测试 `Object.fromEntries` 方法
   *
   * 该方法可通过键值对创建具备对应属性的对象
   */
  it("'Object.fromEntries'", () => {
    // 定义键值对
    const entries = [
      ['a', 'A'],
      ['b', 'B'],
      ['c', 'C'],
      ['d', 'D'],
    ];

    // 通过键值对创建对象
    const obj = Object.fromEntries(entries);

    // 确认对象属性
    expect(obj.a).toEqual('A');
    expect(obj.b).toEqual('B');
    expect(obj.c).toEqual('C');
    expect(obj.d).toEqual('D');
  });

  /**
   * 测试 `Object.groupBy` 方法
   *
   * 该方法可通过指定的回调函数对对象的属性进行分组
   */
  it("'Object.groupBy'", () => {
    // 定义对象
    const obj = [
      { name: 'asparagus', type: 'vegetables', quantity: 5 },
      { name: 'bananas', type: 'fruit', quantity: 0 },
      { name: 'goat', type: 'meat', quantity: 23 },
      { name: 'cherries', type: 'fruit', quantity: 5 },
      { name: 'fish', type: 'meat', quantity: 22 },
    ];

    // 通过回调函数对对象的属性进行分组
    const group = Object.groupBy(obj, ({ type, quantity }) => {
      if (quantity > 0) {
        return type;
      }
      return 'unknown';
    });

    // 确认分组结果
    expect(group.vegetables).toEqual([
      {
        name: 'asparagus',
        type: 'vegetables',
        quantity: 5,
      },
    ]);

    expect(group.fruit).toEqual([
      {
        name: 'cherries',
        type: 'fruit',
        quantity: 5,
      },
    ]);

    expect(group.meat).toEqual([
      {
        name: 'goat',
        type: 'meat',
        quantity: 23,
      },
      {
        name: 'fish',
        type: 'meat',
        quantity: 22,
      },
    ]);

    expect(group.unknown).toEqual([
      {
        name: 'bananas',
        type: 'fruit',
        quantity: 0,
      },
    ]);
  });
});
