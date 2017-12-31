/**
 * 通过 Function 类的原型，调用构造器函数，可以通过字符串，实时编译出一个函数对象
 * @param thisObj 指定函数内部的 this 引用
 * @param strFn 表示函数的字符串
 * @param argNames 形参名称
 * @returns {*} 函数对象
 *
 * 例如:
 * const fn = makeFunction(null, 'return a + b;', 'a', 'b');
 * console.log(fn(1, 2));     // 输出为3
 */
export function makeFunction(thisObj, strFn, ...argNames) {
    if (argNames.length) {
        argNames.push(strFn);
        return Function.prototype.constructor.apply(null, argNames).bind(thisObj);
    }
    return new Function(strFn).bind(thisObj);
}
