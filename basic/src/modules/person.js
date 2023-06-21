/**
 * 定义一个用于导出的简单函数
 * 
 * @param {number} a 被加数
 * @param {number} b 加数
 * @returns 返回 `a`, `b` 两个参数相加的结果
 */
function add(a, b) {
  return a + b;
}

/**
 * 定义一个用于导出的类
 */
class Person {
  /**
   * 
   * @param {string} name 表示姓名
   * @param {number} age 表示年龄
   * @param {"M"|"F"} gender 表示性别
   */
  constructor(name, age, gender) {
    this.name = name;
    this.age = age;
    this.gender = gender;
  }

  /**
   * 将当前对象转为字符串返回
   * 
   * @returns 当前对象转为的字符串
   */
  toString() {
    return `name: ${this.name}, age: ${this.age}, gender: ${this.gender}`;
  }
}

// 导出函数和类
module.exports = {
  add, Person
}
