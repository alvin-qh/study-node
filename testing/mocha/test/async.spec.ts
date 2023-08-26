import { expect } from "chai";

function delay(ms: number, callback: (arg: boolean) => void): void {
  setTimeout(() => callback(true), ms);
}

function promise(ms: number): Promise<boolean> {
  return new Promise(resolve => {
    setTimeout(() => resolve(true), ms);
  });
}

describe("Test `async` function call", () => {
  it("should \"async callback function\" can complete test", done => {
    delay(500, result => {
      expect(result).is.true;
      done();
    });
  });

  it("should `promise` function callback by `then` call", done => {
    promise(500)
      .then(result => {
        expect(result).is.true;
        done();
      });
  });

  it("should `promise` returned by `await` keyword", async () => {
    const result = await promise(500);
    expect(result).is.true;
  });
});
