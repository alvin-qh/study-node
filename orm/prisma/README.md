# Prisma

参考文档 <https://www.prisma.io/docs> (官方) 以及 <https://prisma.nodejs.cn> (中文版)

## 1. 安装配置

### 1.1. 安装依赖包

执行如下命令

```bash
pnpm add prisma
```

### 1.2. 初始化

执行如下命令进行初始化

```bash
npx prisma init --datasource-provider mysql
```

此时会生成配置文件 [prisma/schema.prisma](./prisma/schema.prisma), 在此文件中来定义数据库连接, 例如:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
```

- `provider` 表示数据库提供类, 这里使用 mysql 数据库
- `env("DATABASE_URL")` 表示会从环境变量中获取数据库连接, 参见 [.env](.env) 文件

### 1.3. 生成客户端

要使用 Prisma, 需要先为其生成客户端代码, 客户端代码中包含了数据库连接以及数据模型的定义

Prisma 使用模型定义语言 (而非 Javascript) 定义数据模型, 数据模型可以同时生成 Migration 文件和客户端代码, 前者用于在数据库中产生对应的数据表, 后者用于 Javascript 代码对数据库的访问

在 [prisma/schema.prisma](./prisma/schema.prisma) 文件中定义客户端生成配置

```prisma
generator client {
  provider = "prisma-client-js"
  output   = "../prisma-client"
}
```

表示通过 `prisma-client-js` 模板生成客户端代码, 代码生成位置为 `../prisma-client` (当前路径为 `./prisma`)

执行如下命令, 生成客户端代码

```bash
npx prisma generate
```

注意: 如果不定义 `output` 配置, 则默认会将客户端代码生成到 `node_modules` 目录下, 可以直接使用; 如果指定 `output` 配置, 则需要将生成代码的目录加入到 `package.json` 的 `dependencies` 配置项中, 作为项目的依赖

## 2. 数据模型

在 [prisma/schema.prisma](./prisma/schema.prisma) 文件中, 定义和数据表对应的数据模型

### 2.1. 定义数据模型

通过 `model` 关键字定义数据模型, 例如:

```prisma
model Project {
  id    Int    @id @default(autoincrement())
  name  String @unique @db.VarChar(50)
  type  String @db.VarChar(20)
  users User[] @relation("Users")

  @@map("project")
}

enum Gender {
  MALE
  FEMALE
}

model User {
  id        Int       @id @default(autoincrement())
  name      String    @db.VarChar(50)
  gender    Gender
  birthday  DateTime? @db.DateTime(0)
  phone     String?   @db.VarChar(50)
  projectId Int?      @map("project_id")
  project   Project?  @relation("Users", fields: [projectId], references: [id])

  @@index([name], map: "ix_user_name")
  @@index([projectId], map: "user_project_id_fkey")
  @@map("user")
}
```

### 2.2. 数据模型定义语法

- `model <name>` 用于定义数据模型, 可在模型定义内部通过 `@@map("<table-name>")` 设置模型对应的数据表名称;
- `@id` 用于在数据模型内标识主键字段;
- `@default` 用于为数据字段设置默认值, 支持的方式包括: `autoincrement()` (自增), `sequence()` (仅用于 CockroachDB), `dbgenerated()` (由数据库自动生成), `cuid()`, `uuid()`, `now()` (当前时间), `auto()` (用于为 MongoDB 生成 `ObjectId`);
- `@db.XXXX` 用于指定字段的数据表类型 (和长度), 包括 `@db.VarChar(<N>)`, `@db.ObjectId` (用于 MongoDB), `@db.LongText`, `@db.Decimal(p, s)`, `@db.Citext` (用于 PostgreSQL), `@db.JsonB`, `@db.Date`
- `@relation` 用于表示两个模型的关系, 包括 `@relation("关系名", fields: [关系字段], references: [引用字段])`

## 3. Migration

### 3.1. 创建 Migration 文件

在 [prisma/schema.prisma](./prisma/schema.prisma) 文件中定义模型后, 即可通过如下命令生成 Migration 文件

```bash
npx prisma migrate dev --name <migration-name> --create-only
```

- 该命令会在 `prisma/migrations/<migration-name>` 路径下创建 `migration.sql` 文件, 并在之后通过该文件对数据库进行 Migration 操作
- 命令中的 `--create-only` 的参数表示只生成 Migration 文件, 之后可以修改 Migration 文件, 再执行 Migration 操作; 取消此参数会同时执行 Migration 文件, 创建对应的数据表;
- Migration 初始化完成后, 所有对 [prisma/schema.prisma](./prisma/schema.prisma) 文件中数据模型的修改, 都可以通过上述命令生成下一个版本的 Migration 文件

### 3.2. 执行 Migration

通过执行如下命令, 即可对数据库进行 Migration 操作, 该操作用于开发环境

```bash
npx prisma migrate dev
```

可以标记指定的 Migration 文件为已应用, 再执行 Migration 时跳过该文件

```bash
npx prisma migrate resolve --applied <migrate-name>
```

对于生产环境, 可以执行如下命令进行 Migration

```bash
npx prisma migrate deploy
```

### 3.3. 取消 Migration

执行如下命令对数据库进行重置, 会回滚所有 Migration 操作

```bash
npx prisma migrate reset
```

也可以回滚到指定的 Migration 文件

```bash
npx prisma migrate resolve --rolled-back <migrate-name>
```

### 3.4. 进行版本对比

通过如下命令可以对指定范围的 Migration 文件进行对比, 以了解数据库的变化

```bash
npx prisma migrate diff --from-... <migrate-name-from> --to-... <migrate-name-to>
```

### 3.5. 查看 Migration 状态

执行如下命令, 可以查看当前 Migration 的状态

```bash
prisma prisma migrate status
```

## 4. 合并数据库

对于已有的数据库, 可以对其进行合并, 也可以将当前定义的 Migration 附加到指定的数据库上

### 4.1. 合并现有数据库

执行如下命令行, 根据已有数据库的内容生成 [prisma/schema.prisma](./prisma/schema.prisma) 文件中的模型定义

```bash
npx prisma db pull
```

执行此命令前, 需要在 [prisma/schema.prisma](./prisma/schema.prisma) 文件中定义数据库连接等信息

### 4.2. 附加到目标数据库

执行如下命令, 可以将当前 [prisma/schema.prisma](./prisma/schema.prisma) 文件中的数据模型生成到目标数据库中 (成为数据表), 注意, 这并不是 Migration 操作

```bash
prisma db push
```

## 5. 其它 Prisma 命令

其它 Prisma 可以参考 <https://www.prisma.io/docs/orm/reference/prisma-cli-reference> (官方) 以及 <https://prisma.nodejs.cn/reference/api-reference/command-reference> (中文版)

大部分 Prisma 命令都具备 `--schema` 参数, 用于指定 `schema.prisma` 文件的位置
