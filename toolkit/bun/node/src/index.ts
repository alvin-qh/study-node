import { User } from 'bun-node-model/foo';

export class A {
  private readonly a: string = 'hello';
}

const user = new User('Alvin');
console.log(user.name);
