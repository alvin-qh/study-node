'use strict';

/*
 * Use 'npm install mocha -g' to install mocha, the framework for node.js testing
 * Run mocha to start test cases
 */

import assert from "assert";
import {describe, it} from "mocha";

/**
 * Test "node.js assert" module
 */
describe('Test "node.js assert" module', () => {

    /**
     * 用于断定value的值是否表示true
     */
    it('test "assert.ok(value[, message])"', () => {
        assert.ok(true, 'This is true value');
        assert(true, 'This is true value');
    });

    /**
     * 用于断定actual和expected是否相等（通过==运算符）
     */
    it('test "assert.equal(actual, expected[, message])"', () => {
        let expected = 100;
        assert.equal(100, expected);
    });

    /**
     * 用于断定actual和expected是否不相等（通过!=判断）
     */
    it('test "assert.notEqual(actual, expected[, message])"', () => {
        let expected = 100;
        assert.notEqual(99, expected);
    });

    /**
     * 用于断定actual和expected是否相等（逐一比较对象属性）
     */
    it('test "assert.notDeepEqual(actual, expected[, message])"', () => {
        let expected = {a: 100, b: 200};
        assert.deepEqual({a: 100, b: 200}, expected);
    });

    /**
     * 用于断定actual和expected是否不相等（逐一比较对象属性）
     */
    it('test "assert.deepEqual(actual, expected[, message])"', () => {
        let expected = {a: 200, b: 200};
        assert.notDeepEqual({a: 100, b: 200}, expected);
    });

    /**
     * 用于断定actual和expected是否相等（通过===运算符比较）
     */
    it('test "assert.strictEqual(actual, expected[, message])"', () => {
        let excepted = 100;
        assert.strictEqual(excepted, 100);
    });

    /**
     * 用于断定actual和expected是否不相等（通过!==运算符比较）
     */
    it('test "assert.notStrictEqual(actual, expected[, message])"', () => {
        let excepted = '100';
        assert.notStrictEqual(excepted, 100);
    });

    /**
     * 用于断定是否有指定的异常抛出
     */
    it('test "assert.throws(block[, error][, message])"', function () {
        assert.throws(function () {
            throw new Error("testing error message");
        });	// pass test if any exception was raised

        assert.throws(function () {
            throw new Error("testing error message");
        }, Error);	// pass test if exception as 'Error' was raised

        assert.throws(function () {
            throw new Error("testing error message");
        }, function (e) {
            if (e instanceof Error) {
                console.log(e);
                return true;	// cannot pass test if return false
            }
        });
    });

    /**
     * 用于断定是否有指定的异常抛出
     */
    it('test "assert.doesNotThrow(block[, error][, message])"', function () {
        assert.doesNotThrow(function () {
        });	// pass test if any exception was raised

        assert.doesNotThrow(function () {
        }, Error);	// pass test if exception as 'Error' was raised

        assert.doesNotThrow(function () {
        }, function (e) {
            assert(e === null);
        });
    });

    /**
     * 用于断定value值是否为false
     */
    it('test "assert.ifError(value)"', function () {
        assert.ifError(false);
    });

    /**
     * 用于显示错误信息
     */
    it('test', function () {
        // assert.fail(100, 100, '', '=');
    });
});