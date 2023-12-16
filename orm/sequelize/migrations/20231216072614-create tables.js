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
    await queryInterface.createTable('project', {
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
    });

    await queryInterface.createTable('user', {
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
      }
    });

    queryInterface.addIndex('user', ['name']);
  },

  /**
   * Add reverting commands here.
   *
   * Example:
   * await queryInterface.dropTable('users');
   */
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('user');
    await queryInterface.dropTable('project');
  }
};
