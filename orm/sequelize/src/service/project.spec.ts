import { expect } from "chai";
import "../root.spec";
import {
  create,
  findAll,
  findByName,
} from "./project";

/**
 * 测试 `project` 模块
 */
describe("Test `service/project` module", () => {
  /**
   * 测试实体创建
   */
  it("should `create` function created `UserModel`", async () => {
    // 创建 `Project` 实体对象
    const project = await create({
      name: "ROOMIS",
      type: "DEV"
    });
    expect(project.id).is.not.null;
    expect(project.name).is.eq("ROOMIS");
    expect(project.type).is.eq("DEV");

    // 确认实体对象可以被查询
    const projects = await findAll();
    expect(projects).has.length(1);
    expect(projects[0].id).is.eq(project.id);
  });

  /**
   * 测试实体查询
   */
  it("should `findByName` function returned `UserModel`", async () => {
    // 创建 `Project` 实体对象
    await create({
      name: "ROOMIS",
      type: "DEV"
    });

    const project = await findByName("ROOMIS");
    expect(project).is.not.null;
    expect(project?.name).is.eq("ROOMIS");
  });
});
