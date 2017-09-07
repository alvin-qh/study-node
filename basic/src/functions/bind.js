'use strict';

function bind(fn, thisObj, ...args) {
    if (typeof fn !== 'function') {
        return null;
    }
    if (args.length) {
        return fn.bind(thisObj, args);
    }
    return fn.bind(thisObj);
}

export default bind;