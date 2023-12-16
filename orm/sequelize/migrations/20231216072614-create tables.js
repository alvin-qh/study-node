/**
 * @type {import('sequelize-cli').Migration}
 *
 * 可用的数据类型参考: https://sequelize.org/docs/v7/models/data-types/
 */
module.exports = {
  /**
   * Add altering commands here.
   *
   * ```sql
   * CREATE TABLE IF NOT EXISTS `project`(
   *   `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
   *   `name` VARCHAR(50) NOT NULL,
   *   `type` VARCHAR(20) NOT NULL,
   *    PRIMARY KEY(`id`)
   * );
   * ```
   */
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable(
        'project',
        {
          id: {
            type: Sequelize.INTEGER.UNSIGNED,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
          },
          name: {
            type: Sequelize.STRING(50),
            allowNull: false
          },
          type: {
            type: Sequelize.STRING(20),
            allowNull: false
          }
        },
        {
          transaction
        }
      );

      await queryInterface.addIndex(
        'project',
        ['name'],
        {
          fields: ['name'],
          name: 'ix_project_name', // 自定义索引名称, 默认使用`表名_字段名_unique`
          unique: false,
          transaction
        }
      );

      await queryInterface.createTable(
        'user',
        {
          id: {
            type: Sequelize.INTEGER.UNSIGNED,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
          },
          name: {
            type: Sequelize.STRING(50),
            allowNull: false
          },
          gender: {
            type: Sequelize.CHAR(1),
            allowNull: false
          },
          birthday: {
            type: Sequelize.DATE,
            allowNull: true
          },
          phone: {
            type: Sequelize.STRING(50),
            allowNull: true
          },
          project_id: {
            type: Sequelize.INTEGER.UNSIGNED,
            allowNull: true,
            references: {
              key: 'id',
              model: {
                name: 'pk_project_id',
                tableName: 'project'
                // schema: 'public' // 可选, 默认为`public`
              }
            }
          }
        },
        {
          transaction
        }
      );

      await queryInterface.addIndex(
        'user',
        ['name'],
        {
          fields: ['name'],
          name: 'ix_user_name', // 自定义索引名称, 默认使用`表名_字段名_unique`
          unique: false,
          transaction
        }
      );

      await transaction.commit();
    } catch (e) {
      await transaction.rollback();
      throw e;
    }
  },

  /**
   * Add reverting commands here.
   *
   * Example:
   * await queryInterface.dropTable('users');
   */
  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('user', 'ix_user_name');
    await queryInterface.dropTable('user');

    await queryInterface.removeIndex('project', 'ix_project_name');
    await queryInterface.dropTable('project');
  }
};
