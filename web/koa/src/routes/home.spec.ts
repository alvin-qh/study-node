import { expect } from "chai";
import supertest from "supertest";
import { app } from "../index";

const request = supertest(app.callback());

describe("Test `demo` module", () => {
  it("`GET /` should get response", async () => {
    const resp = await request.get("/");
    expect(resp.text).is.eq("Hello World");
  });
});
