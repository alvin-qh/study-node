import { expect } from 'chai';

/**
 * 当延时时间到达后执行指定的回调函数
 *
 * @param ms 延时时间
 * @param callback 延时时间到达后的回调函数
 */
function delay(ms: number, callback: (arg: boolean) => void): void {
  setTimeout(() => { callback(true); }, ms);
}

/**
 * 异步函数, 执行函数并到达延时时间后, 异步返回
 *
 * @param ms 延时时间
 * @returns 到达延时时间后返回
 */
async function promise(ms: number): Promise<boolean> {
  const result = await new Promise<boolean>(resolve => {
    setTimeout(() => { resolve(true); }, ms);
  });
  return result;
}

/**
 * 测试异步方法调用
 */
describe('Test `async` function call', () => {
  /**
   * 通过回调 `done` 参数表示测试已完成
   */
  it('should "async callback function" can complete test', done => {
    delay(500, result => {
      expect(result).is.true;
      done();
    });
  });

  it('should `promise` function callback by `then` call', done => {
    promise(500)
      .then(result => {
        expect(result).is.true;
        done();
      })
      .catch(err => { done(err); });
  });

  it('should `promise` returned by `await` keyword', async () => {
    const result = await promise(500);
    expect(result).is.true;
  });
});
