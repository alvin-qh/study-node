let cls = require('./class.js');

function add(a, b) {
	return a + b;
}

function sub(a, b) {
	return a - b;
}

let Person = function (name, age, gender) {
	this.name = name;
	this.age = age;
	this.gender = gender;
};

Person.prototype.getGender = function () {
	return this.gender === 'M' ? '男' : '女';
};

Person.prototype.__defineGetter__('information', function () {
	return 'name: ' + this.name + ', age: ' + this.age + ' and gender: ' + this.getGender();
});

var Worker = cls.Class.extend({
	init: function (name, work) {
		this.name = name;
		this.work = work;
	},
	toString: function () {
		return 'name: ' + this.name + ' and work: ' + this.work;
	}
});

//if (typeof module !== 'undefined' && module.exports) {
if (typeof exports !== 'undefined') {
    exports.add = add;
    exports.Person = Person;
    exports.Worker = Worker;
    exports.sub = sub;
} else {
	this.alvin = this.alvin || {};
	this.alvin.add = add;
	this.alvin.Person = Person;
	this.alvin.Worker = Worker;
}
