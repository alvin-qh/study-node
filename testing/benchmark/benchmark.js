const Benchmark = require("benchmark");
const suite = new Benchmark.Suite();

suite
  .add("Test regex", () => /o/.test("Hello World!"))
  .add("Test string indexOf", () => "Hello World!".indexOf("o") > -1)
  .on("cycle", event => console.log(String(event.target)))
  .on("complete", () => console.log("Fastest is " + this.filter("fastest").map("name")))
  .run({ "async": true });
