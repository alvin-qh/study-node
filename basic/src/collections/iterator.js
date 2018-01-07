/**
 * function* 表示这是一个'生成器函数'.
 *
 * 生成器函数的特殊在于：它可以在'yield'关键字处退出，并保留之前的调用上下文，当函数再次被调用时，会恢复上次调用的
 * 上下文，并从上次调用的位置继续执行
 */
export function* xrange(min, max, step = 1) {
    while (min < max) {
        yield min;
        min += step;
    }
}

/**
 * yield* 表示返回一个生成器函数
 */
export function* double_xrange(min, max, step = 1) {
    yield* xrange(min, max, step);
    yield* xrange(min, max, step);
}

/**
 * 从数组中获取一个迭代器对象
 *
 * [...iter] 表示展开一个迭代器为数组，例如：
 *      const a = [1, 2, 3, 4];
 * 则   [...a] === [1, 2, 3, 4]
 */
export function array_iter(array) {
    return [...array][Symbol.iterator]();
}

/**
 * 标准迭代器语法
 */
export class RangeWithIter {

    constructor(min, max, step = 1) {
        this._min = min;
        this._max = max;
        this._step = step;
        this._breaked = false;
    }

    get isBreak() {
        return this._breaked;
    }

    [Symbol.iterator]() {
        const self = this;

        let cur = this._min;
        // 返回迭代器对象
        return {
            next: () => {
                if (cur < this._max) {
                    const val = cur;
                    cur += this._step;
                    return {done: false, value: val};
                } else {
                    return {done: true};
                }
            },
            return() {  // 迭代器在遍历过程中被打断
                self._breaked = true;
                return {done: true};
            },
            throw() {   // 迭代器在遍历过程中被打断
                self._breaked = true;
                return {done: true};
            }
        };
    }
}

/**
 * 利用'生成器函数产生迭代器'的语法
 */
export class Range {
    constructor(min, max, step = 1) {
        this._min = min;
        this._max = max;
        this._step = step;
    }

    /**
     * function* 在类中的写法
     */
    * [Symbol.iterator]() {
        let cur = this._min;
        while (cur < this._max) {
            yield cur;
            cur += this._step;
        }
    }
}

export function get_iterator(array) {
    const obj = {};
    obj[Symbol.iterator] = array[Symbol.iterator].bind(array);
    return obj;
}
