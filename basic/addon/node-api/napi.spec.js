import { expect } from '@jest/globals';

import { Value } from './object.js';
import { argumentsFunc } from './arguments.js';
import { callbackFunc } from './callback.js';
import { createFunction } from './function.js';
import { createUserObject } from './builder.js';
import { simpleFunc } from './simple.js';

/**
 * 测试 Node 插件系统
 */
describe("test addon for node with 'napi' interface", () => {
  /**
   * 测试从 C 模块导出简单函数
   */
  it('should export function from C module', () => {
    // 调用 C 模块导出函数
    const result = simpleFunc();
    expect(result).toEqual('Hello NAPI');
  });

  /**
   * 测试从 C 模块导出具备参数和返回值的函数
   */
  it('should pass arguments to exported C function', () => {
    // 调用 C 模块导出函数
    const result = argumentsFunc(100, 200);
    expect(result).toEqual(300);
  });

  /**
   * 测试从 C 模块导出函数, 该函数接受一个 Node 回调函数, 并在 C 中调用该回调函数并返回结果
   */
  it('should callback js function in C module', () => {
    // 保存 C 调用 Node 回调函数时传入的参数
    const args = [];

    // 调用 C 模块导出函数, 传入一个 Node 回调函数作为参数
    const result = callbackFunc((text) => {
      // 保存 C 进行回调时传入的参数
      args.push(text);
      // 返回结果给 C 模块
      return `function invoked with arguments [${text}]`;
    });

    // 确认 C 函数调用 Node 函数传递的参数
    expect(args).toEqual(['Hello NAPI']);

    // 确认 C 函数返回了 Node 回调函数返回的值
    expect(result).toEqual('function invoked with arguments [Hello NAPI]');
  });

  /**
   * 测试从 C 模块导出函数, 该函数接收三个参数, 返回一个 Node 对象
   */
  it("should create 'object' by C function", () => {
    // 调用 C 函数, 返回 Node 对象
    const user = createUserObject('Alvin', 42, 'M');

    // 确认对象的属性值
    expect(user.name).toEqual('Alvin');
    expect(user.age).toEqual(42);
    expect(user.gender).toEqual('M');

    // 确认对象的 `toString` 方法返回值
    expect(user.toString()).toEqual('name: Alvin, age: 42, gender: M');
  });

  /**
   * 测试从 C 模块导出函数, 该函数可以返回另一个函数
   */
  it("should create 'function' by C function", () => {
    // 调用 C 函数, 返回 Node 函数
    const func = createFunction();

    // 调用返回的 Node 函数, 得到返回值
    const result = func();
    expect(result).toEqual('Hello NAPI');
  });

  /**
   * 测试从 C 模块中导出的 Node 类, 并将其实例化为对象, 调用其中包含的方法
   */
  it("should create object 'instance' by C defined class", () => {
    // 实例化 `Value` 类型对象
    const obj = new Value(100);
    expect(obj.value).toEqual(100);

    // 测试 `Value` 类型的 y`plusOne` 方法, 返回 `value` 属性值加 `1` 的结果, 结果为 `number` 类型值
    let result = obj.plusOne();
    expect(typeof result).toEqual('number');
    expect(result).toEqual(101);

    // 测试 `Value` 类型的 `multiply` 方法, 返回 `value` 属性值乘以 `2` 的结果, 结果为 `Value` 类型对象
    result = obj.multiply(2);
    expect(typeof result).toEqual('object');
    expect(result).toBeInstanceOf(Value);
    expect(result.value).toEqual(202);

    // 测试 `value` 属性的 `get` 和 `set` 方法
    obj.value = 123.321;
    expect(obj.value).toEqual(123.321);

    // 测试不通过 `new` 关键字, 而是通过直接调用 `Value` 构造器函数实例化对象
    const obj2 = Value(200);
    expect(obj2.value).toEqual(200);
  });
});
