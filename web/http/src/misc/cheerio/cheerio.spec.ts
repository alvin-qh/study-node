import { describe, expect, it } from 'bun:test';

import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { promises } from 'node:fs';

import * as cheerio from 'cheerio';

if (!global.__dirname) {
  global.__dirname = path.dirname(fileURLToPath(import.meta.url));
}

/**
 * 测试 `cheerio` 模块
 *
 * 该模块用于在服务端以类似 jQuery 的方式解析 HTML
 */
describe("test 'cheerio' module", () => {
  /**
   * 测试创建 `cheerio` 对象并解析 DOM 树
   */
  it("should create 'cheerio' object", async () => {
    // 从文件中读取 HTML 内容
    const html = await promises.readFile(path.join(__dirname, 'example.html'), 'utf-8');
    expect(html).not.toBeNull();

    // 加载 HTML 字符串
    const $ = cheerio.load(html);

    expect($('html>head>title')[0].tagName).toEqual('title');
    expect($('html>head>title').text()).toEqual('Cheero Example');

    expect($('#main>.block')).toHaveLength(4);

    $('#main>.block').each((n, elem) => {
      expect($(elem)[0].tagName).toEqual('section');
      expect($(elem).attr('class')).toEqual('block');
      expect($(elem).text()).toEqual(`Section${n + 1}`);
    });
  });
});
