import { describe, expect, it } from 'bun:test';

import * as cheerio from 'cheerio';
import supertest from 'supertest';

import { app } from '../index';

const request = supertest(app.callback());

describe('test `home` module', () => {
  it('`GET /` should get response', async () => {
    const resp = await request.get('/');

    const $ = cheerio.load(resp.text);
    expect($('#wrapper div.main > p').text().trim()).toEqual('Hello Koa');
  });
});
