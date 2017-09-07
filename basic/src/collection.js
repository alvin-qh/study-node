#!/usr/bin/env node

'use strict';

let assert = require('assert');

/**
 * 测试Array集合对象
 */
(function () {
    assert.ok(Array.isArray([1, 2, 3, 4, 5]));  // 判断对象是否数组对象
    assert.equal([1, 2, 3, 4, 5].length, 5);    // 获取长度

    // 数组迭代器
    let iter = [1, 2, 3, 4, 5][Symbol.iterator]();
    for (let next = iter.next(), index = 0; !next.done; next = iter.next()) {
        assert.equal(next.value, [1, 2, 3, 4, 5][index++]);
    }

    // 迭代器简化写法
    let index = 0;
    for (let n of [1, 2, 3, 4, 5]) {
        assert.equal(n, [1, 2, 3, 4, 5][index++]);
    }

    // forEach方法
    [1, 2, 3, 4, 5].forEach((value, key) => assert.equal(value, [1, 2, 3, 4, 5][key]));

    // 产生数组
    assert.deepEqual(Array.of(1, 2, 3, 4), [1, 2, 3, 4]);
    assert.deepEqual(Array.of(1, [1, 2, 3, 4, 5], 4), [1, [1, 2, 3, 4, 5], 4]);
    assert.deepEqual(Array.of(1, ...[1, 2, 3, 4, 5], 4), [1, 1, 2, 3, 4, 5, 4]);

    // 通过数组产生新数组
    assert.deepEqual(Array.from([1, 2, 3, 4]), [1, 2, 3, 4]);
    assert.deepEqual(Array.from('Hello'), ['H', 'e', 'l', 'l', 'o']);

    function* range(min, max) {
        for (let i = min; i < max; i++) {
            yield i;
        }
    }

    // 通过迭代器产生新数组
    assert.deepEqual(Array.from(range(1, 4)), [1, 2, 3]);
    // 通过迭代器和转换函数产生新数组
    assert.deepEqual(Array.from([1, 2, 3, 4, 5], n => n + 1), [2, 3, 4, 5, 6]);

    /**
     * 定义一个响应数组变化的回调函数, changes参数为结果数组，记录了每次目标数组改变的记录
     */
    let changeFunc = function (changes) {
        // 第一次操作，在数组末尾（index=5）的位置添加元素
        assert.equal(changes[0].type, 'splice');    // 变化方式
        assert.deepEqual(changes[0].object, [2, 3, 4, 5]);   // 被改变的数组对象
        assert.equal(changes[0].index, 5);      // 被改变元素在数组中的索引
        assert.equal(changes[0].addedCount, 1); // 数组中增加元素的个数
        assert.deepEqual(changes[0].removed, []);   // 数组中被删除的元素集合

        if (changes.length > 1) {
            // 第二次操作，在数组末尾（index=5）删除元素[6]
            assert.equal(changes[1].type, 'splice');
            assert.deepEqual(changes[1].object, [2, 3, 4, 5]);
            assert.equal(changes[1].index, 5);
            assert.equal(changes[1].addedCount, 0);
            assert.deepEqual(changes[1].removed, [6]);
        }

        if (changes.length > 2) {
            // 第二次操作，在数组开头（index=0）删除元素[0]
            assert.equal(changes[2].type, 'splice');
            assert.deepEqual(changes[2].object, [2, 3, 4, 5]);
            assert.equal(changes[2].index, 0);
            assert.equal(changes[2].addedCount, 0);
            assert.deepEqual(changes[2].removed, [1]);
        }
    };
    // 产生一个数组集合
    let lst = [1, 2, 3, 4, 5];  // means lst = new Array(1, 2, 3, 4, 5)

    // 设置监视器，监视数组的变化
    Array.observe(lst, changeFunc);

    // 第一次操作，在数组末尾（index=5）的位置添加元素
    lst.push(6);
    assert.equal(lst.length, 6);
    // 第二次操作，在数组末尾（index=5）删除元素[6]
    assert.equal(lst.pop(), 6);
    assert.equal(lst.length, 5);
    // 第二次操作，在数组开头（index=0）删除元素[0]
    assert.equal(lst.shift(), 1);
    assert.equal(lst.length, 4);

    // 删除监视器，停止监控数组变化
    Array.unobserve(lst, changeFunc);

    assert.ok([1, 2, 3, 4, 5].indexOf(5) === 4);     // 从数组开头查找指定元素
    assert.ok([1, 2, 3, 4, 5].lastIndexOf(0) === -1);    // 从数组的末尾开始查找元素

    // 遍历数组，为数组的每一个元素调用回调函数
    [1, 2, 3, 4, 5].forEach((value, key, array) => {    // 回调函数参数依次为 当前元素、下标、被遍历数组对象
        assert.deepEqual(array, [1, 2, 3, 4, 5]);
        assert.equal(array[key], value);
    });

    // 将指定元素连接在原数组之后，得到新数组，原数组内容不受影响
    assert.deepEqual([1, 2, 3, 4, 5].concat([6, 7, 8]), [1, 2, 3, 4, 5, 6, 7, 8]);
    // 将指定数组内的所有元素连接在原数组之后
    assert.deepEqual([1, 2, 3, 4, 5].concat([6, 7, 8]), [1, 2, 3, 4, 5, 6, 7, 8]);
    // 将指定元素和指定数组内的所有元素连接在原数组之后
    assert.deepEqual([1, 2, 3, 4, 5].concat(6, [7, 8]), [1, 2, 3, 4, 5, 6, 7, 8]);
    assert.deepEqual([1, 2, 3, 4, 5].concat(6, ...[7, 8]), [1, 2, 3, 4, 5, 6, 7, 8]);

    // 移动数组内元素，对于[...].copyWithin(a,b,c)表示，将数组下标从b到c之间的元素移动到a位置
    assert.deepEqual([1, 2, 3].copyWithin(0, 1, 3), [2, 3, 3]);

    // keys()方法返回每个数组元素的key迭代器
    assert.deepEqual([...[1, 2, 3, 4, 5].keys()], [0, 1, 2, 3, 4]);

    // entries()方法返回每个数组元素的键值对迭代器
    assert.deepEqual([...[1, 2, 3, 4, 5].entries()], [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5]]);

    // 数组的每个元素是否符合条件
    assert.ok([1, 2, 3, 4, 5].every(n => n > 0));

    // 数组是否有部分元素符合条件
    assert.ok([1, 2, 3, 4, 5].some(n => n % 2 === 0));

    // 查找第一个符合条件的元素
    assert.equal([1, 2, 3, 4, 5].find(n => {
        /**
         * 判断一个数字是否质数
         */
        let start = 2;
        while (start <= Math.sqrt(n)) {
            if (n % start++ < 1) {
                return false;
            }
        }
        return n > 1;
    }), 2);

    // 查找第一个符合条件元素的索引
    assert.equal([1, 2, 3, 4, 5].findIndex(n => n % 2 === 0), 1);

    // 过滤数组元素
    assert.deepEqual([1, 2, 3, 4, 5].filter(n => n > 2 && n < 5), [3, 4]);

    // 转换数组元素
    assert.deepEqual([1, 2, 3, 4, 5].map(n => 'S' + n), ['S1', 'S2', 'S3', 'S4', 'S5']);

    // 将数组计算为单一值, reduce(func, init) 将数组每个元素(从下标0开始)和前一个计算结果（一开始为init值）送入func函数，最终计算出一个最终结果
    index = 0;
    // noinspection JSUnusedLocalSymbols
    assert.deepEqual([1, 2, 3, 4, 5].reduce((prev, cur, i, array) => {
        /**
         * {prev} 前一个计算结果
         * {cur} 当前访问的数组元素值
         * {index} 当前访问的数组元素的下标值
         * {array} 当前访问的数组
         */
        assert.equal(index++, i);
        assert.deepEqual(array, [1, 2, 3, 4, 5]);
        return prev + cur;
    }, 10), 25);

    // 和reduce方法类似，从数组最后一个元素依次处理到第一个
    index = 4;
    // noinspection JSUnusedLocalSymbols
    assert.deepEqual([1, 2, 3, 4, 5].reduceRight((prev, cur, i, array) => {
        /**
         * {prev} 前一个计算结果
         * {cur} 当前访问的数组元素值
         * {index} 当前访问的数组元素的下标值
         * {array} 当前访问的数组
         */
        assert.equal(index--, i);
        assert.deepEqual(array, [1, 2, 3, 4, 5]);
        return prev + cur;
    }, 10), 25);

    // 连接数组为字符串
    assert.equal(['H', 'e', 'l', 'l', 'o'].join(','), 'H,e,l,l,o');

    // 翻转数组
    assert.deepEqual([1, 2, 3, 4].reverse(), [4, 3, 2, 1]);

    // 截取数组
    assert.deepEqual([1, 2, 3, 4].slice(1, 4), [2, 3, 4]);

    // 删除数组中间的元素
    lst = [1, 2, 3, 4, 5];
    assert.deepEqual(lst.splice(1, 2), [2, 3]);
    assert.deepEqual(lst, [1, 4, 5]);

    // 插入数组元素
    lst = [1, 2, 3, 4, 5];
    lst.splice(1, 0, 100, 200);
    assert.deepEqual(lst, [1, 100, 200, 2, 3, 4, 5]);

    // 替换数组元素
    lst = [1, 2, 3, 4, 5];
    lst.splice(1, 3, 100, 200);
    assert.deepEqual(lst, [1, 100, 200, 5]);
})();


/**
 * 测试Set集合对象, Set中不会存放重复对象
 */
(function () {
    // 实例化Set对象
    let lst = new Set([1, 2, 3, 4, 5, 1, 2, 3, 4, 5]);
    // 获取集合元素个数
    assert.equal(lst.size, 5);

    // 添加元素
    lst.add(6);
    lst.add(6);
    assert.equal(lst.size, 6);

    // 判断元素是否存在
    assert.ok(lst.has(6));
    assert.ifError(lst.has(0));

    // 删除元素
    lst.delete(6);
    assert.ifError(lst.has(6));

    // 遍历集合元素
    lst.forEach(function (value, key, collection) {
        /**
         * {value} 元素值
         * {key} 元素键（对于Set集合，和元素值相同）
         * {collection} Set集合本身
         */
        assert.equal(collection, lst);
        assert.equal(key, value);
        assert.ok(collection.has(key));
        assert.ok(collection.has(value));
    });

    // 获取集合中所有的value值
    assert.deepEqual([...lst.values()], [1, 2, 3, 4, 5]);

    // 获取集合中所有的key值
    assert.deepEqual([...lst.keys()], [1, 2, 3, 4, 5]);

    // 获取集合中所有的[key, value]键值对
    assert.deepEqual([...lst.entries()], [[1, 1], [2, 2], [3, 3], [4, 4], [5, 5]]);

    // 清空集合
    lst.clear();
    assert.equal(lst.size, 0);

})();


/**
 * 测试Map集合
 */
(function () {
    // 实例化Map对象，使用[key, value]结构的集合
    let map = new Map([['a', 1], ['b', 2]]);
    // 获取集合元素个数
    assert.equal(map.size, 2);

    // 添加元素
    map.set('c', 3);
    assert.equal(map.size, 3);

    // 判断元素是否存在
    assert.ok(map.has('a'));
    assert.ifError(map.has('x'));

    // 删除元素
    map.delete(6);
    assert.ifError(map.has(6));

    // 遍历集合元素
    map.forEach(function (value, key, collection) {
        /**
         * {value} 元素值
         * {key} 元素键
         * {collection} Map集合本身
         */
        assert.equal(collection, map);
        assert.ok(collection.has(key));
        assert.equal(collection.get(key), value);
    });

    // 获取集合中所有的value值
    assert.deepEqual([...map.values()], [1, 2, 3]);

    // 获取集合中所有的key值
    assert.deepEqual([...map.keys()], ['a', 'b', 'c']);

    // 获取集合中所有的[key, value]键值对
    assert.deepEqual([...map.entries()], [['a', 1], ['b', 2], ['c', 3]]);

    // 清空集合
    map.clear();
    assert.equal(map.size, 0);
})();


/**
 * 测试WeakSet和WeakMap
 * WeakSet、WeakMap与Set和Map居有类似的功能，具体区别如下：
 * 1. Set可以存放任何类型元素，WeakSet则只能存放object类型元素；
 * 2. Map可以用任何类型元素为key，WeakMap的key则只能存放object类型元素；
 * 3. 当作为value或key的object对象被析构，则WeakSet或者WeakMap中的元素也会自行析构。
 */
(function () {
    let key = {}, value = 'Val1';

    let wSet = new WeakSet([key]);
    assert.ok(wSet.has(key));

    wSet.delete(key);
    assert.ifError(wSet.has(key));

    let wMap = new WeakMap([[key, value]]);
    assert.ok(wMap.has(key));
    assert.equal(wMap.get(key), value);
})();

