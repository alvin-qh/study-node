var assert = require('assert');

// 导入./module目录作为模块
var module = require('./module/module');

// 调用模块内容
assert.equal(module.add(1, 2), 3);
assert.equal(module.sub(2, 1), 1);

// 实例化模块中的类
let person = new module.Person('Alvin', 34, 'M');
assert.equal(person.information, 'name: Alvin, age: 34 and gender: 男');

let worker = new module.Worker('Lucy', 'Secretary');
assert.equal(worker.toString(), 'name: Lucy and work: Secretary');
