const should = require("should");
const { tryCoverage } = require("../app");

describe("Test coverage report generating", () => {
  it("should \"converge report can generate success\"", () => {
    should(tryCoverage(10, 20)).is.equal(30);
  });
});
