import { expect } from "chai";
import { createTables, truncateTables } from "../util/util";
import { createProject, findAllProjects } from "./project";

describe("Test \"service/project module\"", () => {
  before(async () => {
    await createTables();
    await truncateTables("project", "user");
  });

  it("should \"createProject\" function working", async () => {
    await createProject({
      name: "ROOMIS",
      type: "DEV"
    });

    const projects = await findAllProjects();
    expect(projects).has.length(1);
    expect(projects[0].name).is.eq("ROOMIS");
  });
});
