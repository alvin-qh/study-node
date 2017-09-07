'use strict';

function* xrange(min, max, step) {
    step = step || 1;
    while (min < max) {
        yield min;
        min += step;
    }
}

function* double_xrange(min, max, step) {
    yield* xrange(min, max, step);
    yield* xrange(min, max, step);
}

class Range {
    constructor(min, max, step = 1) {
        this._min = min;
        this._max = max;
        this._step = step;
    }

    [Symbol.iterator]() {
        const self = this;
        let cur = this._min;

        return {
            next() {
                let res;
                if (cur < self._max) {
                    res = {done: false, value: cur};
                    cur += self._step;
                } else {
                    res = {done: true};
                }
                return res;
            }
        }
    }
}


export {xrange, double_xrange, Range};

//
// let assert = require('assert');
//
// /**
//  * 测试基本的generator
//  */
// (function () {
//     /**
//      * 定义range函数
//      * @param min 最小值
//      * @param max 最大值
//      * @param step 步进值
//      */
//     function* range(min, max, step) {
//         step = step || 1;
//         for (let i = min; i < max; i += step) {
//             yield i;
//         }
//     }
//
//     // 定义range，取值范围1~9，步进值2
//     let r = range(1, 10, 2);
//     let a = [];
//     // 返回对象中done为false时，表示迭代未完成，此时value表示当前迭代值；
//     // 如果返回对象中done为true，表示迭代结束
//     for (let n = r.next(); !n.done; n = r.next()) {
//         a.push(n.value);
//     }
//     assert.deepEqual(a, [1, 3, 5, 7, 9]);
// })();
//
// /**
//  * 数组操作
//  */
// (function () {
//     // [...iterator]用于将一个迭代器对象的每一项转为一个Array，该语法由ES6支持
//     // 需要打开node.js的‘--harmony’开关
//     let array = [1, 2, 3, 4, 5];
//
//     let otherArray = [...array];
//     assert.deepEqual(otherArray, array);
//
//     function add(a, b, c) {
//         return a + b + c;
//     }
//
//     assert.equal(add(...array), 6); // 调用函数，传递数组的前3个参数
//
//     array = [1, 2];
//     assert.equal(add(...array, 3), 6); // 调用函数，传递数组作为前两个参数，在传入第三个参数
//
//     array = ['b', 'c'];
//     assert.deepEqual(['a', ...array, 'd'], ['a', 'b', 'c', 'd']);   // 组合两个数组
//
//     let a1 = [1, 2, 3];
//     let a2 = [4, 5, 6];
//     a1.push(...a2);
//     assert.deepEqual(a1, [1, 2, 3, 4, 5, 6]); // 将一个数组增加在另一个数组之后
// })();
//
// /**
//  * 测试对generator的调用
//  */
// (function () {
//     /**
//      * 定义range函数，每次调用时依次返回 n+1, n+2 和 n+3
//      */
//     function* gen1(n) {
//         yield n + 1;
//         yield n + 2;
//         yield n + 3;
//     }
//
//     /**
//      * 定义range函数，通过yield*在函数内调用gen1函数
//      */
//     function* gen2(n) {
//         yield n;
//         yield* gen1(n); // 调用gen1函数
//         yield n + 10;
//     }
//
//     let r = gen2(1);
//     assert.deepEqual(Array.from(r), [1, 2, 3, 4, 11]);  // Array.from 可以将迭代对象转为数组
// })();
//
//
// /**
//  * 测试为对象添加迭代属性
//  */
// (function () {
//
//     /**
//      * 为类定义迭代器
//      */
//     function Range(min, max, step) {
//         this.min = min;
//         this.max = max;
//         this.step = step || 1;
//
//         /**
//          * 定义在类构造器中的迭代器方法，利用this引用
//          var self = this;
//          this[Symbol.iterator] = function () {
//                 var cur = self.min;
//                 return {
//                     next: function () {
//                         var res;
//                         if (cur < self.max) {
//                             res = {done: false, value: cur};
//                             cur += self.step;
//                         } else {
//                             res = {done: true};
//                         }
//                         return res;
//                     }
//                 }
//             };
//          */
//     }
//
//     /**
//      * 定义在类原型中的迭代器方法
//      */
//     Range.prototype[Symbol.iterator] = function () {
//         var cur = this.min, self = this;
//         return {
//             // 返回一个包含next方法的对象
//             next: function () {
//                 var res;
//                 if (cur < self.max) {
//                     res = {done: false, value: cur};    // 返回done为false，value为当前迭代值的对象，表示可以继续迭代
//                     cur += self.step;
//                 } else {
//                     res = {done: true}; // 返回done为true的对象，表示迭代结束
//                 }
//                 return res;
//             }
//         }
//     };
//
//     let r = new Range(1, 10, 2);
//     assert.deepEqual([...r], [1, 3, 5, 7, 9]);  // [...r]，将迭代对象转为数组
// })();
