import { add } from 'npm-lib';
import { sub } from 'npm-app-misc';

export function main(): void {
  console.log(`Hello Node.js, the add(1, 2) is: ${add(1, 2)}, the sub(1, 2) is ${sub(1, 2)}`);
}
