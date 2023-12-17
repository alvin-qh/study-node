# Prisma

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

此时会生成配置文件 [prisma/schema.prisma](./prisma/schema.prisma), 在此文件中来定义数据库连接和
