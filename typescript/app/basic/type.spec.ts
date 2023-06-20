import { describe, it } from "mocha";
import { expect } from "chai";
import { Name } from "./type";

describe("test 'type' module", () => {
  it("should const type 'Name' working", () => {
    let name: Name = "Alvin";
    expect(name).eq("Alvin");

    // error TS2322: Type '"Emma"' is not assignable to type '"Alvin"'
    // name = "Emma";
  });
});
