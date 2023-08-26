import Benchmark from "benchmark";

// 配置 benchmark 参数
new Benchmark.Suite()
  .add("Test regex", () => /o/.test("Hello World!"))
  .add("Test string indexOf", () => "Hello World!".indexOf("o") > -1)
  .on("cycle", (e: Event) => console.log(String(e.target)))
  .on("complete", () => console.log("Fastest is " + (this as any).filter("fastest").map("name")))
  .run({
    "async": true
  });
