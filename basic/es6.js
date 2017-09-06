#!/usr/bin/env node

// 启用ES6规范
// 需要打开node.js的‘--harmony’开关
'use strict';

let assert = require('assert');

/**
 * let关键字，用于更好的变量作用域范围
 */
(function () {

    // test let key word
    // 使用let修饰的变量居有严格的作用域范围，而var声明的变量则可以是全局变量
    if (1) {
        let name = 'Lily';
        assert.equal(name, 'Lily');
    }
    // 在作用域外访问变量会抛出异常
    assert.throws(function () {
        assert.equal(name, 'Lily');
    }, function (e) {
        assert.ok(e instanceof ReferenceError);
        return true;
    });

    if (1) {
        var nickname = 'Lily';
        assert.equal(nickname, 'Lily');
    }

    // 在作用域外可以正常访问变量
    assert.equal(nickname, 'Lily');
})();


/**
 * const关键字，用于修饰不变模式的变量
 */
(function () {
    // 使用const修饰的变量，在生命周期内，值不能被改变
    const age = 22;
    assert.throws(function () {
        //noinspection JSAnnotator
        age = 23;
    }, function (e) {
        assert.ok(e instanceof TypeError);
        return true;
    });
})();


/**
 * String template
 */
(function () {
    let a = 10, b = 20;
    // 定义字符串模板，返回一个字符串，模板中的占位符自动被变量替换
    let s = `${a} + ${b} = ${a + b}`;
    assert.equal(s, '10 + 20 = 30');

    /**
     * 定义tag函数，用于获取字符串模板中的字符串和变量值
     */
    function tag(strings, ...values) {
        return {
            strings: strings,
            values: values
        }
    }

    let result = tag `Hello ${a + b}\nworld ${a * b}`;
    assert.deepEqual(result.strings, ['Hello ', '\nworld ', '']);
    assert.deepEqual(result.strings.raw, ['Hello ', '\\nworld ', '']);
    assert.deepEqual(result.values, [a + b, a * b]);
})();


/**
 * 集合操作与lambda表达式
 */
(function () {
    let array = [1, 2, 3, 4, 5];
    let index = 1;
    for (let n of array) {
        assert.equal(index++, n);
    }

    array.forEach(function (n, i) {
        assert.equal(array[i], n);
    });

    array.forEach((n, i) => {
        assert.equal(array[i], n);
    });

    let otherArray = array.map(function (n) {
        return n * 2
    });
    assert.deepEqual(otherArray, [2, 4, 6, 8, 10]);

    otherArray = array.map(n => n % 2);
    assert.deepEqual(otherArray, [1, 0, 1, 0, 1]);

    otherArray = array.filter(n => n % 2 == 0);
    assert.deepEqual(otherArray, [2, 4]);

    otherArray = array.filter(n => n % 2 == 0).map(n => n % 4 ? 'OK' : 'ERR');
    assert.deepEqual(otherArray, ['OK', 'ERR']);
})();


/**
 * Symbol用于产生“标识符”，产生的标识符居有不重复和唯一性，可以作为对象的属性索引
 */
(function () {
    let symbol = Symbol('a');
    let otherSymbol = Symbol('a');
    assert.notEqual(symbol, otherSymbol);   // 产生的两个同名符号对象不相同

    symbol = Symbol.for('a');   // 产生一个符号对象
    otherSymbol = Symbol.for('a');  // 引用同名的符号对对象
    assert.equal(symbol, otherSymbol);  // 两个符号对象相同
    assert.equal(Symbol.keyFor(symbol), 'a');   // 符号对象的key为'a'

    Symbol.b = Symbol('b'); // 产生一个符号对象
    let o = {};
    o['a'] = 100;
    o[Symbol.b] = 200;  // 将符号对象作为对象属性索引
    assert.equal(o.a, 100);
    assert.equal(o.b, undefined);
    assert.equal(o[Symbol.b], 200);


    class Iter {
        constructor(from, to) {
            this.form = from;
            this.to = to;
        }

        /**
         * 为类添加迭代器方法
         */
        [Symbol.iterator]() {
            let cur = this.form;
            return {
                next: () => {
                    if (cur < this.to) {
                        return {done: false, value: cur++};
                    } else {
                        return {done: true};
                    }
                }
            };
        }
    }
    let iter = new Iter(1, 6);
    assert.deepEqual([...iter], [1, 2, 3, 4, 5]);  // 可以将类对象作为迭代


    /**
     * 子类覆盖超类默认构造器
     */
    class Range extends Iter {
        static get [Symbol.species]() { // 用超类默认构造器取代子类默认构造器
            return Iter;
        }
    }
    let array = new Range(1, 6);
    assert.deepEqual(Array.from(array), [1, 2, 3, 4, 5]);
})();
