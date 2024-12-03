import Benchmark from 'benchmark';

// 配置 benchmark 参数
const suite = new Benchmark.Suite();

suite.add('Test regex', () => 'Hello World!'.includes('o'))
  .add('Test string indexOf', () => 'Hello World!'.includes('o'))
  .on('cycle', (e: Event) => { console.log(String(e.target)); })
  .on('complete', () => suite.filter('fastest').map('name'))
  .run({ async: true });
