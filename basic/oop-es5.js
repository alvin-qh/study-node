#!/usr/bin/env node

var util = require('util');
var assert = require('assert');

/**
 * 定义一个类
 */
var Person = function (name, age, gender) {
    this.name = name;
    this.age = age;
    this.gender = gender;

    // 私有内容
    var _private = {
        job: null
    };

    // 定义getter/setter属性
    this.__defineSetter__('job', function (val) {
        _private.job = val;
    });
    this.__defineGetter__('job', function () {
        return _private.job;
    });
};

// 生成类的对象
var person = new Person('Alvin', 22);
assert.equal(person.name, 'Alvin');
assert.equal(person.age, 22);

// 访问类的getter/setter属性
person.job = 'Programming';
assert.equal(person.job, 'Programming');

// 定义类的原型
Person.prototype.getGender = function () {
    return this.gender === 'F' ? '女' : '男';
};

// 在原型上设置getter
Person.prototype.__defineGetter__('information', function () {
    return 'name: ' + this.name + ', age: ' + this.age + ' and gender: ' + this.getGender();
});

person = new Person('Lucy', 22, 'F');
assert.equal(person.information, 'name: Lucy, age: 22 and gender: 女');


/**
 * Man类继承Person类
 */
function Man(name, age) {
    // 继承this内容
    Person.call(this, name, age, 'M');
}

// 继承prototype内容
util.inherits(Man, Person);

var man = new Man('Alvin', 34);
assert.equal(man.information, 'name: Alvin, age: 34 and gender: 男');
