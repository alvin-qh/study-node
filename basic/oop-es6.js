#!/usr/bin/env node

'use strict';

let assert = require('assert');

/**
 * 定义一个Person类
 */
class Person {

    /**
     * 定义构造器
     */
    constructor(name, age, gender) {
        this.name = name;
        this.age = age;
        this.gender = gender;
    }

    /**
     * 定义getter方法
     */
    get information() {
        return 'name: ' + this.name + ', age: ' + this.age + ' and gender: ' + this.getGender();
    }

    /**
     * 定义方法
     */
    getGender() {
        return this.gender === 'F' ? '女' : '男';
    }
}

/**
 * 定义一个类，继承自Person类
 */
// let Worker = class extends Person {
class Worker extends Person {
    /**
     * 构造器
     */
    constructor(name, age, gender, work) {
        // 调用超类构造器
        super(name, age, gender);
        this.work = work;
    }

    /**
     * 定义类方法
     */
    toString() {
        return this.information + ' and working with: ' + this.work;
    }

    /**
     * 定义getter/setter
     */
    get myWork() {
        return this.work;
    }

    set myWork(val) {
        this.work = val;
    }

    static copy(other) {
        return new Worker(other.name, other.age, other.gender, other.work);
    }
}

let worker = new Worker('Alvin', 34, 'M', 'Programming');
assert.equal(worker.information, 'name: Alvin, age: 34 and gender: 男');
assert.equal(worker.toString(), 'name: Alvin, age: 34 and gender: 男 and working with: Programming');
assert.equal(worker.myWork, 'Programming');

worker.myWork = 'Manager';
assert.equal(worker.myWork, 'Manager');

let otherWorker = Worker.copy(worker);
assert.notEqual(otherWorker, worker);
assert.deepEqual(otherWorker, worker);

