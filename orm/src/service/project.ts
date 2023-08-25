import { CreationAttributes } from "sequelize";
import { model, sequelize } from "../db";

async function createProject(project: CreationAttributes<model.ProjectModel>): Promise<void> {
  await sequelize.transaction(async () => {
    await model.ProjectModel.create(project);
  });
}

async function findAllProjects(limit: number = 100): Promise<Array<model.ProjectModel>> {
  return await model.ProjectModel.findAll({
    limit
  });
}

export {
  createProject,
  findAllProjects
};

