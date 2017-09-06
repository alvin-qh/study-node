#!/usr/bin/env node
'use strict';

let assert = require('assert');
let util = require('util');

/**
 * 测试Function类，产生一个函数对象
 */
(function () {

    // 生成函数对象，前若干参数为形参，最后一个参数为函数体
    let func = new Function('a', 'b', 'return a + b');
    assert.equal(func(10, 20), 30);
})();


/**
 * 测试arguments对象，包含传递给函数的所有实参
 */
(function () {

    /**
     * 测试函数，具备三个形参
     * @returns {Arguments} 返回函数的arguments对象，表示形参集合
     */
    function foo(a, b, c) {
        return arguments;
    }

    let arg = foo(10, 20, 30);
    assert.equal(arg[0], 10);
    assert.equal(arg[1], 20);
    assert.equal(arg[2], 30);

    arg = foo(1, 2);
    assert.equal(arg[0], 1);
    assert.equal(arg[1], 2);

    arg = foo(1, 2, 3, 4);
    assert.equal(arg[0], 1);
    assert.equal(arg[1], 2);
    assert.equal(arg[2], 3);
    assert.equal(arg[3], 4);
})();


/**
 *  测试caller对象，表示函数的调用者
 */
(function () {

    //noinspection JSUnusedLocalSymbols
    /**
     * 返回函数的length对象，表示形参的数量
     */
    function foo(a, b, c) {
        return foo.length;
    }

    let len = foo(1, 2, 3);
    assert.equal(len, 3);

    len = foo(1, 2, 3, 4);  // 传递了4个实参，但形参仍为3个
    assert.equal(len, 3);
})();


/**
 *  测试length属性，表示函数的形参个数
 */
(function () {

    //noinspection JSUnusedLocalSymbols
    /**
     * 返回函数的length对象，表示形参的数量
     */
    function foo(a, b, c) {
        return foo.length;
    }

    var len = foo(1, 2, 3);
    assert.equal(len, 3);

    len = foo(1, 2, 3, 4);  // 传递了4个实参，但形参仍为3个
    assert.equal(len, 3);
})();


/**
 *  测试name属性，表示当前函数的名称
 */
(function () {

    /**
     * 返回函数的length对象，表示形参的数量
     */
    function foo() {
        return foo.name;
    }

    assert.equal(foo(), 'foo');
})();


/**
 *  测试call(), apply()方法
 */
(function () {

    /**
     * 定义函数
     */
    function foo(a, b, c) {
        return a + b + c;
    }

    // Function.call(this, arg1, arg2, ...)用于调用指定函数，并传入this对象
    assert.equal(foo.call(null, 1, 2, 3), 6);
    // Function.apply(this, [arg1, arg2, ...])用于调用指定函数，并传入this对象
    assert.equal(foo.apply(null, [1, 2, 3]), 6);


    /**
     * 定义类A构造函数
     */
    function A(a) {
        this.a = a;
    }

    /**
     * 为类A定义add方法
     */
    A.prototype.add = function (b) {
        return this.a + b;
    };

    // 产生A对象
    let a = new A(10);
    // 调用A.prototype.add方法
    assert.equal(a.add(20), 30);
    // 调用 A.prototype.add 方法并传入指定的对象作为this对象
    assert.equal(A.prototype.add.call({a: 20}, 20), 40);
    // 调用 A.prototype.add 方法并传入指定的对象作为this对象
    assert.equal(A.prototype.add.apply({a: 20}, [20]), 40);

    /**
     * 定义类B
     */
    function B() {
    }

    // 类B继承类A的prototype
    B.prototype = new A();

    // 定义b对象
    let b = new B();
    // 呼叫A的构造函数，传入b对象作为this对象
    A.call(b, 10);
    assert.equal(b.add(20), 30);
})();


/**
 * Object.constructor表示当前对象的构造函数
 */
(function () {
    function A(a) {
        this.a = a;
    }

    let a = new A(10);
    assert.equal(a.constructor, A);
})();


/**
 * Function.bind() 用于将对象和函数进行绑定
 */
(function () {

    /**
     * 定义类A
     */
    function A(a) {
        this.a = a;
    }

    /**
     * 定义函数add
     */
    function add(b) {
        return this.a + b;
    }

    // 实例化A对象
    let a = new A(10);

    // 将add函数和a对象进行绑定，相当于add函数成为a对象的一个方法
    let binder = add.bind(a);
    // 执行绑定的方法，进行传参
    assert.equal(binder(20), 30);

    // 重新绑定a对象和add方法，并设置add方法形参的实参
    binder = add.bind(a, 30);
    // 执行绑定的方法，可以无需传参
    assert.equal(binder(), 40);

})();
