import { add } from './module/misc';

// 在 esModule 模式下, 如果需要通过 `tsc` 命令将 `ts` 脚本编译为 `js` 脚本, 则在 `import` 是需要加上 `.js` 扩展名, 否则编译后的结果无法正确执行 `import`
// import { add } from './module/misc.js';

function main(): void {
  const r = add(100, 200);
  console.log(`Hello Node.js, the result is: ${r}`);
}

main();
