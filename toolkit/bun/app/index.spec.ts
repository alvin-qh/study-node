import { describe, expect, it } from 'bun:test';

import { close, start } from 'bun-server';
import { welcome } from 'bun-lib';

/**
 * 测试 Bun 模块导入
 */
describe('test `bun-lib` module', () => {
  /**
   * 测试导入的函数是否正常工作
   */
  it('should `welcome` function worked', () => {
    const s = welcome();
    expect(s).toBe('Welcome to Bun script');
  });
});

/**
 * 测试 Bun 包导入
 */
describe('test `bun-server` package', () => {
  it('should startup http server', async () => {
    // 调用 `http-server` 包下的函数, 启动 http 服务器
    await start(5001, '0.0.0.0');

    // 发起 http 请求并确认相应内容
    const resp = await fetch('http://127.0.0.1:5001');
    const data = await resp.json();
    expect(data).toEqual({ status: 'success', message: 'Hello node.js' });

    // 关闭 http 服务器
    await close();
  });
});
