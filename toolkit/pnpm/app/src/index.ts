import { add } from 'pnpm-lib';
import { sub } from 'pnpm-app-misc';

function main(): void {
  console.log(`Hello PNPM, the add(1, 2) is: ${add(1, 2)}, the sub(1, 2) is: ${sub(1, 2)}`);
}

main();
