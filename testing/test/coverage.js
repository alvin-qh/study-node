const should = require("should");
const { try_coverage } = require("../app/coverage");

describe("Test coverage report generating", () => {
  it("should \"converage report can generate succcess\"", () => {
    should(try_coverage(10, 20)).is.equal(30);
  });
});
