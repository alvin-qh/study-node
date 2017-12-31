export function* xrange(min, max, step) {
    step = step || 1;
    while (min < max) {
        yield min;
        min += step;
    }
}

export function* double_xrange(min, max, step) {
    yield* xrange(min, max, step);
    yield* xrange(min, max, step);
}

export function array_iter(array) {
    return [...array][Symbol.iterator]();
}

export class Range {
    constructor(min, max, step = 1) {
        this._min = min;
        this._max = max;
        this._step = step;
    }

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
