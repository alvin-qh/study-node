const { describe, it } = require("mocha");
const { add, Person } = require("./modules");
const { expect } = require("chai");

/**
 * 测试导入模块
 */
describe("test module", () => {
  /**
   * 从模块中导入函数
   */
  it("should import function from module", () => {
    const r = add(10, 20);
    expect(r).to.eq(30);
  });

  /**
   * 从模块中导入类
   */
  it("should import type from module", () => {
    const p = new Person("Alvin", 40, "M");
    expect(`${p}`).to.eq("name: Alvin, age: 40, gender: M");
  });

  /**
   * 动态导入模块
   */
  it("should import from module dynamically", () => {
    const p = new (require("./modules").Person)("Alvin", 40, "M");
    expect(`${p}`).to.eq("name: Alvin, age: 40, gender: M");
  });
});
