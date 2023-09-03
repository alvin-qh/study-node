import { expect } from "chai";
import supertest from "supertest";
import { app } from "../index";
import * as cheerio from "cheerio";

const request = supertest(app.callback());

describe("Test `home` module", () => {
  it("`GET /` should get response", async () => {
    const resp = await request.get("/");

    const $ = cheerio.load(resp.text);
    expect($("#wrapper div.main > p").text().trim()).is.eq("Hello Koa");
  });
});
