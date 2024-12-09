import { version as lVersion } from 'pnpm-lib';
import { version as wVersion } from 'pnpm-app-lib';

/**
 * 程序入口函数
 */
export async function main(): Promise<void> {
  const lVer = await lVersion();
  const wVer = await wVersion();
  console.log(`Hello PNPM!, repo lib version is: ${lVer}, workspace lib version is: ${wVer}`);
}
