import { expect } from 'chai';

import { promises } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import * as cheerio from 'cheerio';

if (!global.__dirname) {
  global.__dirname = path.dirname(fileURLToPath(import.meta.url));
}

/**
 * 测试 Cheerio 模块, 用于在服务端以类似 jQuery 的方式解析 HTML
 */
describe('Test `cheerio` module', () => {
  it('should select DOM from HTML by cheerio', async () => {
    // 从文件中读取 HTML 内容
    const html = await promises.readFile(path.join(__dirname, 'example.html'), 'utf-8');
    expect(html).is.ok;

    // 加载 HTML 字符串
    const $ = cheerio.load(html);

    expect($('html>head>title')[0].tagName).to.eq('title');
    expect($('html>head>title').text()).to.eq('Cheero Example');

    expect($('#main>.block')).has.length(4);

    $('#main>.block').each((n, elem) => {
      expect($(elem)[0].tagName).to.eq('section');
      expect($(elem).attr('class')).to.eq('block');
      expect($(elem).text()).to.eq(`Section${n + 1}`);
    });
  });
});
