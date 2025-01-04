import { expect } from 'chai';

/**
 * 测试数组类型
 */
describe("test 'Array'", () => {
  /**
   * 测试 `Array` 类型
   */
  it("should check object is 'Array'", () => {
    // `[]` 值是数组
    let b = Array.isArray([]);
    expect(b).is.true;

    // 嵌套数组仍是数组
    b = Array.isArray([[], []]);
    expect(b).is.true;

    // `null` 值不是数组
    b = Array.isArray(null);
    expect(b).is.false;

    // `{}` 值不是数组
    b = Array.isArray({});
    expect(b).is.false;
  });

  /**
   * 生成 `Array` 数组
   */
  it("should create 'Array' object", () => {
    // 通过一组元素值生成数组, 相当于 `[1, 2, 3]`
    let a = Array.of(1, 2, 3);
    expect(a).to.deep.eq([1, 2, 3]);

    // 相当于 `[[1], [2, 3]]`
    a = Array.of([1], [2, 3]);
    expect(a).to.deep.eq([[1], [2, 3]]);

    // 通过 `...` 运算符对数组 (可迭代对象) 进行平铺, 相当于 `[1, ...[2, 3]]`
    a = Array.of(1, ...[2, 3]);
    expect(a).to.deep.eq([1, ...[2, 3]]);
    expect(a).to.deep.eq([1, 2, 3]);
  });

  /**
   * 对数组元素进行 mapping 操作, 生成新的数组
   */
  it("should mapping 'Array'", () => {
    // 通过数组和 mapping 函数生成新数组
    let a = Array.from([1, 2, 3, 4], x => x + 100);
    expect(a).to.deep.eq([101, 102, 103, 104]);

    // 定义返回可迭代对象的函数

    const xrange = function* (min, max, step = 1) {
      while (min < max) {
        yield min;
        min += step;
      }
    };

    // 通过可迭代对象和 mapping 函数生成新数组
    a = Array.from(xrange(1, 10), x => x + 100);
    expect(a).to.deep.eq([101, 102, 103, 104, 105, 106, 107, 108, 109]);
  });

  /**
   * 获取数组中符合条件的第一个元素值
   */
  it("should find first element or index in 'Array'", () => {
    // 定义数组
    const arr = [1, 2, 3, 4, 5];

    // 查找符合条件的第一个元素值
    const v = arr.find(x => x % 2 === 0 && x > 2);
    expect(v).to.eq(4);

    // 查找符合条件的第一个元素索引
    const i = arr.findIndex(x => x % 2 === 0 && x > 2);
    expect(i).to.eq(3);
  });

  /**
   * 过滤数组元素, 结果形成新的数组
   */
  it("should filter from 'Array'", () => {
    // 定义数组
    const arr = [1, 2, 3, 4, 5];

    // 查找符合条件的第一个元素值
    const filtered = arr.filter(x => x % 2 === 0);
    expect(filtered).to.deep.eq([2, 4]);
  });

  /**
   * 根据索引下标, 从数组分离指定个数的元素
   */
  it("should splice element by index from 'Array'", () => {
    // 定义数组
    const arr = [1, 2, 3, 4, 5];

    // 从数组下标为 2 的位置开始分离一个元素, 返回分离的元素数组
    let sp = arr.splice(2, 1);
    // 分离出了数组 [3]
    expect(sp).to.deep.eq([3]);
    // 原数组剩余 [1, 2, 4, 5]
    expect(arr).to.deep.eq([1, 2, 4, 5]);

    // 继续从数组下标为 2 的位置开始分离两个元素, 返回分离的元素数组
    sp = arr.splice(2, 2);
    // 分离出了数组 [4, 5]
    expect(sp).to.deep.eq([4, 5]);
    // 原数组剩余 [1, 2]
    expect(arr).to.deep.eq([1, 2]);
  });

  /**
   * 对数组进行切片
   */
  it("should slice elements from 'Array'", () => {
    // 定义数组
    const arr = [1, 2, 3, 4, 5];

    // 对数组进行切片, 获取下标范围 [2, 5) 之间的元素
    const s = arr.slice(2, 5);
    expect(s).is.deep.eq([3, 4, 5]);
  });

  /**
   * 对数组进行插入操作
   */
  it("should insert elements into 'Array'", () => {
    // 定义数组
    const arr = [1, 2, 3, 4, 5];

    // 从数组下标 2 的位置删除 0 个元素, 并插入 3 个元素 (相当于删除)
    let sp = arr.splice(2, 0, 100, 200, 300);
    expect(sp).is.empty;
    expect(arr).is.deep.eq([1, 2, 100, 200, 300, 3, 4, 5]);

    // 继续从数组下标 2 的位置删除 3 个元素, 并插入 2 个元素 (相当于替换)
    sp = arr.splice(2, 3, -1, -2);
    expect(sp).is.deep.eq([100, 200, 300]);
    expect(arr).is.deep.eq([1, 2, -1, -2, 3, 4, 5]);
  });

  /**
   * 对数组元素进行 Mapping/Reduce 操作
   */
  it("should map and reduce elements from 'Array'", () => {
    // 定义数组
    const arr = [1, 2, 3, 4, 5];

    // 对数组元素进行映射操作, 将每一个元素值映射为另一个值, 返回新数组
    let r = arr.map(x => x + 100);
    expect(r).is.deep.eq([101, 102, 103, 104, 105]);

    // 对数组元素进行合并运算, 其中合并运算回调的参数为
    //  - sum: 上个迭代的运算结果
    //  - n: 本迭代对应数组元素
    //  - i: 本迭代对应数组下标
    //  - array: 数组对象引用
    r = r.reduce(
      (sum, n, i) => sum + ((i + 1) / 10 + n), // 合并运输回调
      0, // 初始值, 作为第一个 sum 参数送入运算回调函数中
    );
    expect(r).to.eq(516.5);
  });
});

/**
 * 测试 Set 集合
 */
describe("test 'Set'", () => {
  /**
   * 使用 `Set` 集合产生数组
   */
  it("should use 'Set' collection", () => {
    // 产生 Set 对象
    const set = new Set([1, 2, 3, 4, 3, 2, 1]);
    expect([...set]).is.deep.eq([1, 2, 3, 4]);

    // 测试集合中是否包含指定元素
    let b = set.has(2);
    expect(b).is.true;

    b = set.has(20);
    expect(b).is.false;

    // 删除指定元素
    set.delete(2);
    b = set.has(2);
    expect(b).is.false;

    // 获取集合下标和值的对应
    const pairs = [...set.entries()];
    expect(pairs).is.deep.eq([[1, 1], [3, 3], [4, 4]]);

    // 添加元素
    set.add(4);
    expect([...set]).is.deep.eq([1, 3, 4]);

    set.add(5);
    expect([...set]).is.deep.eq([1, 3, 4, 5]);

    // 清空集合
    set.clear();
    expect([...set]).is.empty;
  });
});

/**
 * 测试 Map 集合
 */
describe("test 'Map'", () => {
  /**
   * 使用 `Map` 集合产生数组
   */
  it("should use 'Map' collection", () => {
    // 产生 Map 集合对象
    const map = new Map([['a', 1], ['b', 2]]);

    // 将 Map 转为数组, 数组的每一项为一个包含键值对的数组
    expect([...map]).is.deep.eq([['a', 1], ['b', 2]]);

    // 根据 Key 获取 Value
    const v = map.get('b');
    expect(v).to.eq(2);

    // 添加新的键值对
    map.set('c', 3);
    expect([...map]).is.deep.eq([['a', 1], ['b', 2], ['c', 3]]);

    // 删除键值对
    map.delete('b');
    expect([...map]).is.deep.eq([['a', 1], ['c', 3]]);

    const es = [...map.entries()];
    expect(es).is.deep.eq([['a', 1], ['c', 3]]);

    // 清空集合
    map.clear();
    expect([...map]).is.empty;
  });
});
