'use strict';

function makeFunction(thisObj, strFn, ...argNames) {
    if (argNames.length) {
        argNames.push(strFn);
        return Function.prototype.constructor.apply(null, argNames).bind(thisObj);
    }
    return new Function(strFn).bind(thisObj);
}

export default makeFunction;