import { add } from 'pnpm-lib';
import { sub } from 'pnpm-app-misc';

export function main(): void {
  console.log(`Hello PNPM, the add(1, 2) is: ${add(1, 2)}, the sub(1, 2) is: ${sub(1, 2)}`);
}
