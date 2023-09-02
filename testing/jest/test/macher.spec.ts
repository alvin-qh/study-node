/**
 * Test should module
 */
describe("Test `assertion` of jest", () => {
  /**
   * 测试对值进行断言
   */
  it("assert by values", () => {
    expect(false).not.toBeTruthy;
    expect(false).toBeFalsy;

    expect("").toBeFalsy;
    expect(null).toBeFalsy;
    expect(null).toBeNull;

    expect(undefined).toBeFalsy;
    expect(undefined).toBeUndefined;

    expect(NaN).toBeFalsy;
    expect(NaN).toBeNaN;

    expect(true).toBeTruthy;

    expect("Hello").toBe("Hello");
    expect("Hello").not.toBe("hello");

    expect([100, 200]).toContain(100);
  });

  /**
   * 测试对对象进行断言
   */
  it("assert by objects", () => {
    const obj = { a: 100 };

    expect(obj).toBe(obj);
    expect(obj).not.toBe({ a: 100 });
    expect(obj).toEqual({ a: 100 });
    expect(obj).toStrictEqual({ a: 100 });   // deep compare

    expect(typeof obj).toBe("object");
    expect(typeof obj).not.toBe("string");

    expect(obj).toHaveProperty("a");
    expect(obj).not.toHaveProperty("b");
    expect(obj).toHaveProperty("a", 100);

    expect(obj).toBeInstanceOf(Object);
  });

  /**
   * 测试对数组进行断言
   */
  it("assert by arrays", () => {
    const array = [1, 2, 3];

    expect(array).toContain(2);
    expect("hello").toContain("llo");

    expect(array).toBeInstanceOf(Array);

    expect(array).toHaveLength(3);
  });

  /**
   * 测试 Mock 函数并断言其是否被调用
   */
  it("should mocked function and assert if called it", () => {
    // Mock 一个函数
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fn = jest.fn((a: any, b: any, c: any) => [a, b, c].join(","));

    // 确认此时函数尚未被调用
    expect(fn).not.toHaveBeenCalled();

    // 调用一次函数
    fn(1, 2, 3);

    // 确认此时函数被调用
    expect(fn).toBeCalled();
    // 确认最后一次函数被调用的参数
    expect(fn).toHaveBeenCalledWith(1, 2, 3);

    // 确认函数返回及其返回值
    expect(fn).toHaveReturned();
    expect(fn).toHaveReturnedWith("1,2,3");

    // 再次调用函数
    fn(2, 3, "OK");

    // 确认函数被调用 2 次
    expect(fn).toBeCalledTimes(2);

    // 确认最后一次函数调用传递的参数
    expect(fn).toHaveBeenLastCalledWith(2, 3, "OK");

    // 确认两次调用中第一次传递的参数
    expect(fn).toHaveBeenNthCalledWith(1, 1, 2, 3);
    // 确认两次调用中第二次传递的参数
    expect(fn).toHaveBeenNthCalledWith(2, 2, 3, "OK");
  });
});
