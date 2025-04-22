import { expect } from '@jest/globals';

import {
  DemoWithCustomConstructor,
  DemoWithDefaultConstructor,
  DemoWithFactory,
  Gender,
  HELLO,
  User,
  createUser,
  helloWorld,
  sum,
  userToString,
} from './index.cjs';

describe('test export const value from rust module', () => {
  it("should 'HELLO' const value exist", () => {
    expect(HELLO).toEqual('Hello NAPI for Rust!');
  });
});

describe('test export functions from rust module', () => {
  it("should 'helloWorld' function worked", () => {
    const r = helloWorld();
    expect(r).toEqual('Hello NAPI for Rust!');
  });

  it("should 'sum' function worked", () => {
    expect(sum(1, 2)).toEqual(3);
  });

  it("should 'createUser' and `userToString` function worked", () => {
    const user = createUser('001', 'Alvin', Gender.Male);
    expect(user).toEqual(new User('001', 'Alvin', Gender.Male));

    const s = userToString(user);
    expect(s).toEqual('001 Alvin Male');
  });
});

describe('test export class from rust module', () => {
  it("should 'DemoWithDefaultConstructor' class worked", () => {
    const obj = new DemoWithDefaultConstructor('Alvin', 42, 'M');
    expect(obj.name).toEqual('Alvin');
    expect(obj.age).toEqual(42);
    expect(obj.gender).toEqual('M');

    obj.change('Emma', 38, 'F');
    expect(obj.name).toEqual('Emma');
    expect(obj.age).toEqual(38);
    expect(obj.gender).toEqual('F');

    expect(obj.toString()).toEqual('name: Emma, age: 38, gender: F');

    expect(obj.json).toEqual('{"name":"Emma","age":38,"gender":"F"}');

    obj.json = '{"name":"Alvin", "age":42, "gender":"M"}';
    expect(obj.name).toEqual('Alvin');
    expect(obj.age).toEqual(42);
    expect(obj.gender).toEqual('M');
  });

  it("should 'DemoWithCustomConstructor' class worked", () => {
    const obj = new DemoWithCustomConstructor('Alvin', 42, 'M');
    expect(obj.name).toEqual('Alvin');
    expect(obj.age).toEqual(42);
    expect(obj.gender).toEqual('M');
  });

  it("should 'DemoWithFactory' class worked", () => {
    const obj = DemoWithFactory.build('Alvin', 42, 'M');
    expect(obj.name).toEqual('Alvin');
    expect(obj.age).toEqual(42);
    expect(obj.gender).toEqual('M');
  });
});
