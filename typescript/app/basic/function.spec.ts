import { describe, it } from "mocha";
import { f1, f2, f3, f4, f5, f6, F6Type } from "./function";
import { expect } from "chai";

describe("test 'function' module", () => {
  it("should 'f1' function working", () => {
    const r = f1(1, "Alvin");
    expect(r).eq("1: Alvin");
  });

  it("should 'f2' function working", () => {
    const r = f2(1, "Alvin");
    expect(r).eq("1: Alvin");
  });

  it("should 'f3' function working", () => {
    let r = f3(1, "Alvin");
    expect(r).eq("1: Alvin");

    r = f3(1);
    expect(r).eq("1");
  });

  it("should 'f4' function working", () => {
    let r = f4(1, "Alvin");
    expect(r).eq("1: Alvin");

    r = f4(1);
    expect(r).eq("1: Alvin");
  });

  it("should 'f5' function working", () => {
    let r = f5(1);
    expect(r).eq("1");

    r = f5(1, "Alvin");
    expect(r).eq("1: Alvin");

    r = f5(1, "Alvin", "Emma");
    expect(r).eq("1: Alvin, Emma");
  });

  it("should 'f6' function working", () => {
    const obj = {
      a: 1, 
      fn: f6
    } as F6Type;

    const r = obj.fn("Alvin");
    expect(r).eq("1: Alvin");
  });
});
