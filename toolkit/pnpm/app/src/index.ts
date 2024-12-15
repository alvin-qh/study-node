import { version as lVersion } from '@toolkit/pnpm-lib';
import { version as wVersion } from '@toolkit/pnpm-app-lib';

/**
 * 程序入口函数
 */
export async function main(): Promise<void> {
  const lVer = await lVersion();
  const wVer = await wVersion();
  console.log(`Hello PNPM!, repo lib version is: ${lVer}, workspace lib version is: ${wVer}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
