import {
  afterEach, beforeEach, describe, expect, it,
} from 'bun:test';

import { serve, stop } from './serve';

const TEST_PORT = 13000;

describe("test 'serve' module", () => {
  beforeEach(() => {
    serve({
      development: true,
      port: TEST_PORT,
    });
  });

  afterEach(() => {
    console.log('stop server');
    stop();
  });

  it("should GET '/' return text response", async () => {
    const resp = await fetch(`http://localhost:${TEST_PORT}`);

    expect(resp.status).toEqual(200);
    expect(resp.headers.get('Content-Type')).toStartWith('text/plain');
    expect(await resp.text()).toEqual('Home page');
  });

  it("should GET '/json' return json object response", async () => {
    const resp = await fetch(`http://localhost:${TEST_PORT}/json`);

    expect(resp.status).toEqual(200);
    expect(resp.headers.get('Content-Type')).toStartWith('application/json');
    expect(await resp.json()).toEqual({
      status: 'success',
      message: 'Hello node.js',
    });
  });

  it("should GET '/blog' return text response", async () => {
    const resp = await fetch(`http://localhost:${TEST_PORT}/blog`);

    expect(resp.status).toEqual(200);
    expect(resp.headers.get('Content-Type')).toStartWith('text/plain');
    expect(await resp.text()).toEqual('Blog');
  });
});
