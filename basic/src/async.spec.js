const { expect } = require("chai");
const { describe, it } = require("mocha");
const { EventEmitter } = require("events");

/**
 * 测试异步调用
 */
describe("test async call", () => {
  /**
   * 等待一个条件为真后调用指定函数
   */
  function wait(condition, finish) {
    const timer = setInterval(() => {
      if (condition()) {
        clearInterval(timer);
        finish();
      }
    }, 50);
  }

  /**
   * 回调方式进行异步调用
   */
  it("should call callback functions", done => {
    /**
     * 定义异步调用函数
     */
    const after = (ok, timeout, success, error = null) => {
      setTimeout(() => {
        if (ok) {
          success("OK");
        } else if (error) {
          error("Error");
        }
      }, timeout);
    }

    // 记录调用次数
    let count = 0;

    // 异步调用, 回调 success 函数
    after(true, 50,
      m => {
        expect(m).be.eq("OK");
        count++;
      },
      e => done(e));

    // 异步调用, 回调 error 函数
    after(false, 50,
      m => done(m),
      e => {
        expect(e).be.eq("Error");
        count++;
      });

    // 等待调用结束
    wait(() => count === 2, () => done());
  });

  /**
   * 以事件作为异步函数的回调
   */
  it("should emit event", done => {
    // 定义事件对象
    const emitter = new EventEmitter();

    // 定义异步函数, 发出事件
    const after = (ok, timeout) => {
      setTimeout(() => {
        if (ok) {
          // 发出 success 事件
          emitter.emit("success", "OK");
        } else {
          // 发出 error 事件
          emitter.emit("error", "Error");
        }
      }, timeout);
    }

    // 记录调用次数
    let count = 0;

    // 定义 success 事件监听函数
    emitter.on("success", m => {
      expect(m).be.eq("OK");
      count++;
    });

    // 定义 error 事件监听函数
    emitter.on("error", e => {
      expect(e).be.eq("Error");
      count++;
    });

    // 调用异步函数, 发出 success 事件
    after(true, 50);

    // 调用异步函数, 发出 error 事件
    after(false, 50);

    // 等待调用结束
    wait(() => count === 2, () => done());
  });

  it("should callback by 'Promise'", done => {
    // 定义异步函数, 返回 Promise 对象
    const after = (ok, timeout) => {
      // 返回 Promise 对象
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (ok) {
            // 表示成功时调用的函数
            resolve("OK");
          } else {
            // 表示失败时调用的函数
            reject("Error");
          }
        }, timeout);
      });
    }

    // 记录调用次数
    let count = 0;

    // 调用异步函数, 并最终回调 Promise 对象的 then 函数
    after(true, 50)
      .then(m => {
        expect(m).be.eq("OK");
        count++;
      })
      .catch(e => done(e));

    // 调用异步函数, 并最终回调 Promise 对象的 catch 函数
    after(false, 50)
      .then(m => done(m))
      .catch(e => {
        expect(e).be.eq("Error");
        count++;
      });

    // 等待调用结束
    wait(() => count === 2, () => done());
  });

  /**
   * 通过 await 等待异步 Promise 返回结果
   * 注意: 包含 await 调用的函数必须声明为 async 函数
   */
  it("use 'await' for 'Promise'", async () => {
    // 定义异步函数, 返回 Promise 对象
    const after = (ok, timeout) => {
      // 返回 Promise 对象
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (ok) {
            // 表示成功时调用的函数
            resolve("OK");
          } else {
            // 表示失败时调用的函数
            reject("Error");
          }
        }, timeout);
      });
    }

    // 等待异步函数调用完毕并返回正确结果
    let m = await after(true, 50);
    expect(m).to.eq("OK");

    // 等待异步函数调用完毕并返回错误结果 (以异常形式抛出)
    try {
      await after(false, 50);
    } catch (e) {
      expect(e).to.eq("Error");
    }
  });

  /**
   * 合并多个 Promise 对象并行调用
   */
  it("merge all 'Promise' object together", done => {
    // 定义异步函数, 返回 Promise 对象
    const after = (ok, timeout) => {
      // 返回 Promise 对象
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (ok) {
            // 表示成功时调用的函数
            resolve("OK");
          } else {
            // 表示失败时调用的函数
            reject("Error");
          }
        }, timeout);
      });
    }

    // 合并多个 Promise 对象
    const promise = Promise.all([
      after(true, 50), // 2 个正确调用
      after(true, 50),
      after(false, 50), // 1 个错误调用
    ]);

    // 查看所有 Promise 对象执行结果
    promise
      .then(rs => { // 2 个正确结果
        expect(rs).to.have.length(2);
        expect(rs.every(m => m === "OK")).to.be.true;
      })
      .catch(es => { // 1 个错误结果
        expect(es).to.have.length(1);
        expect(rs.every(e => e === "Error")).to.be.true;
      })
      .finally(() => done());
  });

  /**
   * 合并多个 Promise 对象并行调用
   * 注意: 包含 await 调用的函数必须声明为 async 函数
   */
  it("await all 'Promise' object", async () => {
    // 定义异步函数, 返回 Promise 对象
    const after = (ok, timeout) => {
      // 返回 Promise 对象
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (ok) {
            // 表示成功时调用的函数
            resolve("OK");
          } else {
            // 表示失败时调用的函数
            reject("Error");
          }
        }, timeout);
      });
    }

    // 合并多个 Promise 对象并等待全部的返回结果
    const rs = await Promise.all([
      after(true, 50), // 3 个正确调用
      after(true, 50),
      after(true, 50),
    ]);

    expect(rs).to.have.length(3);

    // 如果任意调用失败, 则整体失败
    try {
      await Promise.all([
        after(true, 50), // 包含一个错误调用
        after(true, 50),
        after(false, 50),
      ]);
    } catch (e) {
      // 任意返回错误的 Promise 都会导致异常, 造成整个调用全部失败
      expect(e).to.eq("Error");
    }
  });
});
