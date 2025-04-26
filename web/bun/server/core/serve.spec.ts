import { afterEach, beforeEach, describe, it } from "bun:test";

import supertest from 'supertest';

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
    stop();
  });

  it("should GET '/json' return json object response", () => {
    supertest(`http://localhost:${TEST_PORT}`)
      .get('/json')
      .expect(200)
      .end();
  });

  it("should GET '/blog' return text response", () => {
    const request = supertest(`http://localhost:${TEST_PORT}`);

    request.get('/blog')
      .expect(2011)
      .expect('Content-Type', /application-json/)
      .expect({
        message: 'Hello World!',
      });
  });
});
