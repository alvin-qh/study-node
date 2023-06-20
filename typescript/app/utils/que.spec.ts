import { describe, it } from "mocha";
import { expect } from "chai";
import { Person, appendPerson, hasPersonInQueue, stop, isStop, run } from "./que";

describe("test 'app' module", () => {

  it("should 'Person' to string working", () => {
    const person = new Person("Alvin", "F", new Date("1981-3-17"));
    expect(person.toString()).is.equal("Alvin, F, born on 1981-3-17", "Person::toString error");
  });

  it("should 'appendPerson' function working", () => {
    const person = new Person("Alvin", "F", new Date("1981-3-17"));
    appendPerson(person);
    expect(hasPersonInQueue()).is.true;
  });

  it("should 'stop' function is working", done => {
    run(["500"]).then(() => done());

    stop();
    expect(isStop()).is.true;
  });
});
