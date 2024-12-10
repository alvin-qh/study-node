import { version as lVersion } from 'bun-lib';
import { version as wVersion } from 'bun-app-lib';

/**
 * 入口函数
 */
export async function main(): Promise<void> {
  const wVer = await wVersion();
  const lVer = await lVersion();
  console.log(`Hell Bun: repo lib version is: ${lVer}, workspace lib version is: ${wVer}`);
}

// 启动程序
main().catch(e => console.error(e));
