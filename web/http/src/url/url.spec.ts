import { expect } from 'chai';
import { describe, it } from 'mocha';
import qs from 'querystring';
import url from 'url';


// 从 url 中导出 URL 类
const { URL } = url;

/**
 * 测试 `url` 模块
 */
describe('Test `url` module', () => {
  /**
   * 解析 URL
   */
  it('should parse url', () => {
    const uri = new URL('https://alvin@www.baidu.com:80/s?wd=%E6%B5%8B%E8%AF%95#top');

    expect(uri.href).to.eq('https://alvin@www.baidu.com:80/s?wd=%E6%B5%8B%E8%AF%95#top');
    expect(uri.protocol).to.eq('https:');
    expect(uri.username).to.eq('alvin');
    expect(uri.hostname).to.eq('www.baidu.com');
    expect(uri.port).to.eq('80');
    expect(uri.host).to.eq('www.baidu.com:80');
    expect(uri.hash).to.eq('#top');
    expect(uri.search).to.eq('?wd=%E6%B5%8B%E8%AF%95');
    expect([...uri.searchParams]).to.deep.eq([['wd', '测试']]);
    expect(uri.searchParams.get('wd')).to.eq('测试');
    expect(uri.pathname).to.eq('/s');
  });

  /**
   * 测试生成 URL
   */
  it('should generate url', () => {
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

    expect(r).to.eq('https://alvin@www.baidu.com:80/s?wd=%E6%B5%8B%E8%AF%95#top');
  });

  /**
   * 测试拼装 URL
   */
  it('should resolve url path', () => {
    let uri = new URL('/s/a/b', 'http://www.baidu.com');
    expect(uri.toString()).to.eq('http://www.baidu.com/s/a/b');

    uri = new URL('/b', 'http://www.baidu.com/s/a');
    expect(uri.toString()).to.eq('http://www.baidu.com/b');

    uri = new URL('b/c', 'http://www.baidu.com/s/a');
    expect(uri.toString()).to.eq('http://www.baidu.com/s/b/c');
  });
});

/**
 * 测试 `querystring` 模块
 */
describe('Test `querystring` module', () => {
  /**
   * 测试生成 query string
   */
  it('should generate a query string', () => {
    const params = {
      name: 'alvin',
      code: ['1001', '1002'],
      level: 'L3',
    };

    const r = qs.stringify(params, '&', '=');
    expect(r).to.eq('name=alvin&code=1001&code=1002&level=L3');
  });

  /**
   * 测试编码 query string (和 `stringify` 方法结果一致)
   */
  it('should encode a query string', () => {
    const params = {
      name: 'alvin',
      code: ['1001', '1002'],
      level: 'L3',
    };

    const r = qs.encode(params, '&', '=');
    expect(r).to.eq('name=alvin&code=1001&code=1002&level=L3');
  });

  /**
   * 测试解析 query string
   */
  it('should parse a query string', () => {
    const querystring = 'name=alvin&code=1001&code=1002&level=%E4%B8%89%E5%B9%B4%E7%BA%A7';

    const r = qs.parse(querystring, '&', '=', { maxKeys: 100 });
    expect(r).to.deep.eq({
      name: 'alvin', code: ['1001', '1002'], level: '三年级',
    });
  });

  /**
   * 测试解码 query string
   */
  it('should decode a query string', () => {
    const querystring = 'name=alvin&code=1001&code=1002&level=%E4%B8%89%E5%B9%B4%E7%BA%A7';

    const r = qs.decode(querystring, '&', '=', { maxKeys: 100 });
    expect(r).to.deep.eq({
      name: 'alvin', code: ['1001', '1002'], level: '三年级',
    });
  });

  /**
   * 测试对字符串进行 URL 编码
   */
  it('should escape string', () => {
    const s = '<html>';

    const r = qs.escape(s);
    expect(r).to.eq('%3Chtml%3E');
  });

  /**
   * 测试对字符串进行 URL 解码
   */
  it('should unescape string', () => {
    const s = '%3Chtml%3E';

    const r = qs.unescape(s);
    expect(r).to.eq('<html>');
  });
});
