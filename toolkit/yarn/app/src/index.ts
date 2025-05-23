import { version as lVersion } from '@toolkit/yarn-lib';
import { version as wVersion } from '@toolkit/yarn-app-lib';

export async function main(): Promise<void> {
  const lVer = await lVersion();
  const wVer = await wVersion();
  console.log(`Hello YARN!, repo lib version is: ${lVer}, workspace lib version is: ${wVer}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
