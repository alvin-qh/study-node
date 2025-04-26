import { URL } from 'node:url';

/**
 * 定义上下文类型
 */
export class Context {
  // 客户端请求对象
  readonly request: Request;

  // 客户端请求地址
  readonly url: URL;

  /**
   * 构造函数
   *
   * @param {Request} request 客户端请求对象
   */
  constructor(request: Request) {
    this.request = request;
    this.url = new URL(request.url);
  }

  /**
   * 获取客户端请求方法
   *
   * @returns {string} 客户端请求方法
   */
  get method(): string {
    return this.request.method;
  }
}
