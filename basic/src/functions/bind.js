/**
 * 可以将一个函数和指定对象绑定在一起，使得函数内部的 this 引用指向该指定对象
 * 还可以将一个函数和指定的参数绑定在一起，相当于在调函数用时自动传参
 * @param fn 要绑定的函数
 * @param thisObj 和函数绑定的对象，相当于函数内部的 this 引用
 * @param args 和函数绑定的参数
 * @returns {*} 绑定好的函数
 *
 * 例如:
 * 有函数
 * function add(...val) {
 *      let res = val[0];
 *      for (let i = 1; i < val.length; i++) {
 *          res += val[i];
 *      }
 *      return this.value + res;
 * }
 *
 * 以及对象:
 * const obj = {value: 'Hello'};
 *
 * 则绑定为:
 * const fn = bind(add, obj, ' World');
 *
 * fn 相当于被绑定的特殊 add(...val) 函数，其内部 this 引用到 obj 对象，第一个参数自动为 ' World'
 */
export function bind(fn, thisObj, ...args) {
    if (typeof fn !== 'function') {
        return null;
    }
    if (args.length) {
        return fn.bind(thisObj, args);
    }
    return fn.bind(thisObj);
}
