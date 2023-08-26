import should from "should";

/**
 * 测试 `should` 模块
 */
describe("Test `should` module", () => {
  // 定义测试用例
  const user = {
    name: "Alvin"
  };

  /**
   * 断言对象属性值
   */
  it("assert by objects", () => {
    user.should.have.property("name", "Alvin");
    user.should.not.have.property("age", 22);
  });

  /**
   * 断言所给值
   */
  it("assert values", () => {
    should(false).not.be.ok();
    should("").not.be.ok();
    should(null).not.be.ok();
    should(undefined).not.be.ok();
    should(NaN).not.be.ok();

    should(true).be.ok();
    should("Hello").be.ok();
    should([]).be.ok();
    should(100).be.ok();
  });
});
