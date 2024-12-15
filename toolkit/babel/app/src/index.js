import { version } from '@toolkit/babel-lib';

/**
 * 主函数
 */
export default async function main() {
  const ver = await version();
  console.log(`Hello Babel, the repo version is: ${ver}`);
}
