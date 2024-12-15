import { describe, expect, it } from 'bun:test';

import url, { URL } from 'node:url';
import qs from 'node:querystring';

/**
 * 测试 `url` 模块
 */
describe("test 'node:url' module", () => {
  /**
   * 解析 URL
   */
  it("should create 'URL' object", () => {
    const uri = new URL('https://alvin@www.baidu.com:80/s?wd=%E6%B5%8B%E8%AF%95#top');

    expect(uri.href).toEqual('https://alvin@www.baidu.com:80/s?wd=%E6%B5%8B%E8%AF%95#top');
    expect(uri.protocol).toEqual('https:');
    expect(uri.username).toEqual('alvin');
    expect(uri.hostname).toEqual('www.baidu.com');
    expect(uri.port).toEqual('80');
    expect(uri.host).toEqual('www.baidu.com:80');
    expect(uri.hash).toEqual('#top');
    expect(uri.search).toEqual('?wd=%E6%B5%8B%E8%AF%95');
    expect([...uri.searchParams]).toEqual([['wd', '测试']]);
    expect(uri.searchParams.get('wd')).toEqual('测试');
    expect(uri.pathname).toEqual('/s');
  });

  /**
   * 测试拼装 URL
   */
  it("should create 'URL' object based given url", () => {
    let uri = new URL('/s/a/b', 'http://www.baidu.com');
    expect(uri.toString()).toEqual('http://www.baidu.com/s/a/b');

    uri = new URL('/b', 'http://www.baidu.com/s/a');
    expect(uri.toString()).toEqual('http://www.baidu.com/b');

    uri = new URL('b/c', 'http://www.baidu.com/s/a');
    expect(uri.toString()).toEqual('http://www.baidu.com/s/b/c');
  });

  /**
   * 测试生成 URL
   */
  it("should 'format' json to url", () => {
    const json = {
      protocol: 'https',
      auth: 'alvin',
      hash: '#top',
      host: 'www.baidu.com:80',
      // "hostname": "www.baidu.com",  // can instead of "host" field
      // "port": 80,                   // can instead of "host" field
      pathname: 's',
      query: { wd: '测试' },
      search: '?wd=%E6%B5%8B%E8%AF%95', // can instead of "query" field
    };

    const r = url.format(json);
    expect(r).toEqual('https://alvin@www.baidu.com:80/s?wd=%E6%B5%8B%E8%AF%95#top');
  });
});

/**
 * 测试 `querystring` 模块
 */
describe("test 'node:querystring' module", () => {
  /**
   * 测试生成 query string
   */
  it("should 'stringify' json to querystring", () => {
    const params = {
      name: 'alvin',
      code: ['1001', '1002'],
      level: 'L3',
    };

    const r = qs.stringify(params, '&', '=');
    expect(r).toEqual('name=alvin&code=1001&code=1002&level=L3');
  });

  /**
   * 测试编码 query string (和 `stringify` 方法结果一致)
   */
  it("should 'encode' query string", () => {
    const params = {
      name: 'alvin',
      code: ['1001', '1002'],
      level: 'L3',
    };

    const r = qs.encode(params, '&', '=');
    expect(r).toEqual('name=alvin&code=1001&code=1002&level=L3');
  });

  /**
   * 测试解析 query string
   */
  it("should 'parse' query string", () => {
    const s = 'name=alvin&code=1001&code=1002&level=%E4%B8%89%E5%B9%B4%E7%BA%A7';

    const r = qs.parse(s, '&', '=', { maxKeys: 100 });
    expect(r).toEqual({
      name: 'alvin', code: ['1001', '1002'], level: '三年级',
    });
  });

  /**
   * 测试解码 query string
   */
  it("should 'decode' query string", () => {
    const querystring = 'name=alvin&code=1001&code=1002&level=%E4%B8%89%E5%B9%B4%E7%BA%A7';

    const r = qs.decode(querystring, '&', '=', { maxKeys: 100 });
    expect(r).toEqual({
      name: 'alvin', code: ['1001', '1002'], level: '三年级',
    });
  });

  /**
   * 测试对字符串进行 URL 编码
   */
  it("should 'escape' string", () => {
    const s = '<html>';

    const r = qs.escape(s);
    expect(r).toEqual('%3Chtml%3E');
  });

  /**
   * 测试对字符串进行 URL 解码
   */
  it("should 'unescape' string", () => {
    const s = '%3Chtml%3E';

    const r = qs.unescape(s);
    expect(r).toEqual('<html>');
  });
});
