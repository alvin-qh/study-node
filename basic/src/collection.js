#!/usr/bin/env node

'use strict';

let assert = require('assert');


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

