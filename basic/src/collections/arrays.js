export default {

	isArray(obj) {
		return Array.isArray(obj);
	},

	of(...args) {
		return Array.of(...args);
	},

	from(array, mapFn) {
		return Array.from(array, mapFn);
	},

	findFirst(array, equalFn) {
		return array.find(equalFn);
	},

	findAll(array, equalFn) {
		return array.filter(equalFn);
	},

	deleteByIndex(array, index) {
		const copy = Array.from(array);
		copy.splice(index, 1);
		return copy;
	},

	insert(array, index, ...items) {
		const copy = Array.from(array);
		copy.splice(index, 0, ...items);
		return copy;
	},

	replace(array, index, ...items) {
		const copy = Array.from(array);
		copy.splice(index, 1, ...items);
		return copy;
	},

	map(array, mapFn) {
		return array.map(mapFn);
	}
};