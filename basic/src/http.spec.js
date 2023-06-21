const { describe, it } = require("mocha");
const { startServer } = require("./http");

describe("test 'http' module", () => {
  it("should create http server and can be visited by client", async () => {
    const server = await startServer(3000);
    server.shutdown();
  });
});
