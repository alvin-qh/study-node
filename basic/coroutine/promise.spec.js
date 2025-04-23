import { expect } from '@jest/globals';

import { fail } from 'jest-extended';
import { wait } from './waiting.js';

/**
 * 测试异步调用
 */
describe("test 'Promise' object", () => {
  /**
   * 返回 `Promise` 对象
   *
   * @param {'OK' | 'Error'} status 状态, 如果为 'OK' 则调用 `resolve` 回调, 否则调用 `reject` 回调
   * @param {number} timeout 超时时间
   * @returns {Promise<string>} 返回 `Promise` 对象
   */
  function after(status, timeout = 50) {
    // 返回 Promise 对象
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // 根据 `status` 的值, 调用 `resolve` 或 `reject` 回调函数
        if (status === 'OK') {
          resolve(status);
        }
        else {
          reject(new Error(status));
        }
      }, timeout);
    });
  }

  /**
   * 测试创建 `Promise` 对象
   */
  it("should create 'Promise' object", (done) => {
    // 记录 `Promise` 被调用的次数
    let count = 0;

    // 调用异步函数, 并最终回调 Promise 对象的 then 函数
    after('OK')
      .then((m) => {
        expect(m).toEqual('OK');
        count++;
      })
      .catch(() => fail());

    // 调用异步函数, 并最终回调 Promise 对象的 catch 函数
    after('Error')
      .then(() => fail())
      .catch((e) => {
        expect(e.message).toEqual('Error');
        count++;
      });

    // 等待调用结束
    wait(() => count === 2, () => done());
  });

  /**
   * 测试通过 `await` 调用 `Promise` 对象
   *
   * 注意: 包含 `await` 调用的函数必须声明为 `async` 函数
   */
  it("use 'await' for 'Promise'", async () => {
    // 等待异步函数调用完毕并返回正确结果
    const status = await after('OK');
    expect(status).toEqual('OK');

    // 等待异步函数调用完毕并返回错误结果 (以异常形式抛出)
    try {
      await after('Error');
    }
    catch (e) {
      expect(e.message).toEqual('Error');
    }
  });

  /**
 * 合并多个 Promise 对象并行调用
 */
  it("merge all 'Promise' object together", (done) => {
    // 定义异步函数, 返回 Promise 对象
    const after = (ok, timeout) =>
      // 返回 Promise 对象
      new Promise((resolve, reject) => {
        setTimeout(() => {
          if (ok) {
            // 表示成功时调用的函数
            resolve('OK');
          }
          else {
            // 表示失败时调用的函数
            reject(new Error('Error'));
          }
        }, timeout);
      });
    // 合并多个 Promise 对象
    const promise = Promise.all([
      after(true, 50), // 2 个正确调用
      after(true, 50),
      after(false, 50), // 1 个错误调用
    ]);

    // 查看所有 Promise 对象执行结果
    promise
      .then((rs) => {
        // 2 个正确结果
        expect(rs).toHaveLength(2);
        expect(rs.every(m => m === 'OK')).toBeTruthy();
      })
      .catch((es) => {
        // 1 个错误结果
        expect(es.message).toEqual('Error');
      })
      .finally(() => done());
  });

  /**
 * 合并多个 Promise 对象并行调用
 * 注意: 包含 await 调用的函数必须声明为 async 函数
 */
  it("await all 'Promise' object", async () => {
    // 定义异步函数, 返回 Promise 对象
    const after = (ok, timeout) =>
      // 返回 Promise 对象
      new Promise((resolve, reject) => {
        setTimeout(() => {
          if (ok) {
            // 表示成功时调用的函数
            resolve('OK');
          }
          else {
            // 表示失败时调用的函数
            reject(new Error('Error'));
          }
        }, timeout);
      });
    // 合并多个 Promise 对象并等待全部的返回结果
    const rs = await Promise.all([
      after(true, 50), // 3 个正确调用
      after(true, 50),
      after(true, 50),
    ]);

    expect(rs).toHaveLength(3);

    // 如果任意调用失败, 则整体失败
    try {
      await Promise.all([
        after(true, 50), // 包含一个错误调用
        after(true, 50),
        after(false, 50),
      ]);
    }
    catch (e) {
      // 任意返回错误的 Promise 都会导致异常, 造成整个调用全部失败
      expect(e.message).toEqual('Error');
    }
  });
});
