export function call(fn, thisObj, ...args) {
	if (typeof fn !== 'function') {
		return null;
	}
	if (args.length) {
		return fn.apply(thisObj, args);
	}
	return fn.call(thisObj);
}