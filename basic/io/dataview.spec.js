describe("test 'DataView' class", () => {
  it("create 'DataView' object from 'Buffer' object", () => {
    const buf = Buffer.allocUnsafe(24);

    const view = new DataView(buf);
  });
});
