import { version as lVersion } from 'yarn-lib';
import { version as wVersion } from 'yarn-app-lib';

export async function main(): Promise<void> {
  const lVer = await lVersion();
  const wVer = await wVersion();
  console.log(`Hello YARN!, repo lib version is: ${lVer}, workspace lib version is: ${wVer}`);
}
