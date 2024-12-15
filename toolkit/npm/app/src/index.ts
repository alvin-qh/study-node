import { version as lVersion } from 'npm-lib';
import { version as wVersion } from 'npm-app-lib';

export async function main(): Promise<void> {
  const lVer = await lVersion();
  const wVer = await wVersion();
  console.log(`Hello NPM!, repo lib version is: ${lVer}, workspace lib version is: ${wVer}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
