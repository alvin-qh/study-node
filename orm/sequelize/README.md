# Sequelize

## 1. 数据库版本管理

### 1.1 安装 Sequelize-CLI

执行如下命令

```bash
pnpm add sequelize-cli
```

### 1.2. Migration 操作

### 1.2.1. 初始化 Migration

执行如下命令

```bash
npx sequelize-cli init
```

会生成 [config/config.json](./config/config.json) 文件, 包含了三个数据库的连接配置, 分别对应"开发", "测试" 以及 "生产"

#### 1.2.2. 生成 Migration 文件

执行如下命令

```bash
npx sequelize-cli migration:generate --name <migration-file-name>
```

此时会在 `migrations` 路径下生成 Migration 文件, 内容如下:

```js
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
```

其中 `up` 函数用于升级数据库; `down` 函数用于降级数据库; 函数参数中传递的 `queryInterface` 参数可以用来修改数据库; `Sequelize` 对象存储了可用的数据类型

#### 1.2.3. 执行或撤销

执行 Migration, 将数据库升级到最新版本

```bash
npx sequelize-cli db:migrate
```

此命令将执行这些步骤

- 将在数据库中确保一个名为 `SequelizeMeta` 的表, 此表用于记录在当前数据库上运行的迁移;
- 开始寻找尚未运行的任何迁移文件. 这可以通过检查 `SequelizeMeta` 表;
- 执行 Migration 文件;

取消最后一次 Migration 操作

```bash
npx sequelize-cli db:migrate:undo
```

也可以取消所有的 Migration 操作

```bash
npx sequelize-cli db:migrate:undo:all
```

或撤销到指定的 Migration 文件

```bash
npx sequelize-cli db:migrate:undo:all --to XXXXXXXXXXXXXX-some-migration.js
```

### 1.3. Seed 操作

Seed 操作用于以版本化方式管理数据库的初始数据

#### 1.3.1. 生成 Seed 文件

```bash
npx sequelize-cli seed:generate --name user
```

此时会在 `seeders` 路径下创建 `XXXXXXXXXXXXXX-user.js` 文件, 表示用于初始化 `user` 表的数据, 文件内容和 Migration 文件类似

```js
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
```

#### 1.3.2. 运行种子

执行如下命令, 运行所有种子文件

```bash
npx sequelize-cli db:seed:all
```

#### 1.3.3. 撤销种子

执行如下命令, 撤销最近的种子执行

```bash
npx sequelize-cli db:seed:undo
```

撤销所有种子执行

```bash
npx sequelize-cli db:seed:undo:all
```

撤销特定种子执行

```bash
npx sequelize-cli db:seed:undo --seed <name-of-seed-as-in-data>
```
