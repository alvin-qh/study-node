import { loadEnvVariables } from './lib/loader';

loadEnvVariables();

/**
 * 入口函数
 */
function main(): void {
  console.log(`process.env['APP_USER'] = ${process.env['APP_USER']}`);
  console.log(`process.env['APP_VARIABLE'] = ${process.env['APP_VARIABLE']}`);
}

main();
