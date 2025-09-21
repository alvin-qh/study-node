import { version as lVersion } from '@toolkit/npm-lib';
import { version as wVersion } from '@toolkit/npm-app-lib';

/**
 * 入口函数
 */
export async function main(): Promise<void> {
  const lVer = await lVersion();
  const wVer = await wVersion();
  console.log(`Hello NPM!, repo lib version is: ${lVer}, workspace lib version is: ${wVer}`);
}

