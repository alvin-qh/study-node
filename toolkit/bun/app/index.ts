#!/usr/bin/env bun

import { version as lVersion } from '@toolkit/bun-lib';
import { version as wVersion } from '@toolkit/bun-app-lib';

/**
 * 入口函数
 */
export async function main(): Promise<void> {
  const wVer = await wVersion();
  const lVer = await lVersion();
  console.log(`Hello Bun: repo lib version is: ${lVer}, workspace lib version is: ${wVer}`);
}

// 启动程序
main().catch(e => console.error(e));
