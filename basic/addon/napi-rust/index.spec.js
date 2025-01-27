import { expect } from 'chai';

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
    expect(HELLO).to.eq('Hello NAPI for Rust!');
  });
});

describe('test export functions from rust module', () => {
  it("should 'helloWorld' function worked", () => {
    const r = helloWorld();
    expect(r).to.eq('Hello NAPI for Rust!');
  });

  it("should 'sum' function worked", () => {
    expect(sum(1, 2)).to.equal(3);
  });

  it("should 'createUser' and `userToString` function worked", () => {
    const user = createUser('001', 'Alvin', Gender.Male);
    expect(user).to.deep.eq(new User('001', 'Alvin', Gender.Male));

    const s = userToString(user);
    expect(s).to.eq('001 Alvin Male');
  });
});

describe('test export class from rust module', () => {
  it("should 'DemoWithDefaultConstructor' class worked", () => {
    const obj = new DemoWithDefaultConstructor('Alvin', 42, 'M');
    expect(obj.name).to.eq('Alvin');
    expect(obj.age).to.eq(42);
    expect(obj.gender).to.eq('M');

    obj.change('Emma', 38, 'F');
    expect(obj.name).to.eq('Emma');
    expect(obj.age).to.eq(38);
    expect(obj.gender).to.eq('F');

    expect(obj.toString()).to.eq('name: Emma, age: 38, gender: F');

    expect(obj.json).to.eq('{"name":"Emma","age":38,"gender":"F"}');

    obj.json = '{"name":"Alvin", "age":42, "gender":"M"}';
    expect(obj.name).to.eq('Alvin');
    expect(obj.age).to.eq(42);
    expect(obj.gender).to.eq('M');
  });

  it("should 'DemoWithCustomConstructor' class worked", () => {
    const obj = new DemoWithCustomConstructor('Alvin', 42, 'M');
    expect(obj.name).to.eq('Alvin');
    expect(obj.age).to.eq(42);
    expect(obj.gender).to.eq('M');
  });

  it("should 'DemoWithFactory' class worked", () => {
    const obj = DemoWithFactory.build('Alvin', 42, 'M');
    expect(obj.name).to.eq('Alvin');
    expect(obj.age).to.eq(42);
    expect(obj.gender).to.eq('M');
  });
});
