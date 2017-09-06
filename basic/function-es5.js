#!/usr/bin/env node

/**
 * 测试'use strict'无法支持的'arguments.callee'对象和'Function.caller'对象
 */
var assert = require('assert');

/**
 *  测试callee对象，表示被调用函数本身
 */
(function () {
    /**
     * 返回函数的length对象，表示形参的数量
     */
    function foo() {
        return arguments.callee;
    }

    assert.equal(foo(), foo);
})();


/**
 *  测试caller对象，表示函数的调用者
 *  caller对象无法在'use strict'模式下使用
 */
(function () {

    function foo() {
        return foo.caller;
    }

    function testCaller() {
        return foo();
    }

    var t = testCaller();
    assert.equal(t, testCaller);
})();
