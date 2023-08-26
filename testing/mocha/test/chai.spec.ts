import { expect } from "chai";

/**
 * Test should module
 */
describe("Test `chai` module", () => {
  /**
   * 测试对值进行断言
   */
  it("assert by values", () => {
    // be / not be
    expect(false).not.be.ok;
    expect(false).be.false;

    expect("").not.be.ok;
    expect(null).not.be.ok;
    expect(null).be.null;

    expect(undefined).not.be.ok;
    expect(undefined).be.undefined;

    expect(NaN).not.be.ok;
    expect(NaN).be.NaN;

    expect(true).be.ok;

    // eq / not eq
    expect("Hello").eq("Hello");
    expect("Hello").not.eq("hello");

    // oneOf
    expect(100).is.oneOf([100, 200]);
  });

  /**
   * 测试对对象进行断言
   */
  it("assert by objects", () => {
    const obj = { a: 100 };

    // eq / deep eq
    expect(obj).eq(obj);
    expect(obj).not.eq({ a: 100 });
    expect(obj).deep.eq({ a: 100 });
    expect(obj).eql({ a: 100 });   // equate to `be.deep.eq`

    // a / an
    expect(obj).is.an("object");
    expect(obj).not.is.a("string");

    // have / have any / have all
    expect(obj).to.have.property("a");
    expect(obj).not.to.have.property("b");

    expect(obj).to.have.any.keys("a", "b");
    expect(obj).not.to.have.all.keys("a", "b");

    // includes / contains
    expect(obj).includes.keys("a");
    expect(obj).contains.keys("a");

    // instanceof
    expect(obj).is.instanceof(Object);
  });

  /**
   * 测试对数组进行断言
   */
  it("assert by arrays", () => {
    const array = [1, 2, 3];

    // include / contains
    expect(array).include(2);
    expect("hello").include("llo");
    expect(array).includes(1);
    expect(array).contains(2);

    // instanceof
    expect(array).is.an.instanceof(Array);

    // within
    expect(12).is.within(10, 13);

    // length
    expect(array).has.length(3);
    expect(array).has.length.within(1, 4);
  });
});
