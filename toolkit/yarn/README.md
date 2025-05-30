# YARN 工具链

YARN 是 Facebook 为 Node 开发的工具链, 具有比原生 NPM 更好的性能优势, 在 `node_modules` 文件夹管理上具备尺寸优势

## 1. 工程管理

通过 `init` 或 `create` 命令可以初始化工程, 创建 `package.json` 文件, 并通过模板创建工程基础结构

```bash
# 仅创建 package.json 文件
yarn init
```

```bash
# 通过模板创建工程
yarn create vite
yarn create react-app
```

## 2. 依赖管理

### 1.1. 安装全部依赖

用于将 `package.json` 文件中包含的全部依赖进行安装

```bash
yarn
# 或
yarn install
```

### 1.2. 添加指定依赖

通过 `add` 命令可以添加指定依赖

```bash
# 为当前工程添加依赖
yarn add typescript tsx
```

```bash
# 为当前工程添加依赖, 并保存在 package.json 文件的 devDependencies 中
yarn add --dev eslint globals typescript-eslint
# 或
yarn add -D eslint globals typescript-eslint
```

```bash
# 为当前工程添加依赖, 并保存在 package.json 文件的 optionalDependencies 中
yarn add --optional eslint globals typescript-eslint
# 或
yarn add -O eslint globals typescript-eslint
```

```bash
# 为当前工程添加依赖, 并保存在 package.json 文件的 peerDependencies 中
yarn add --peer eslint globals typescript-eslint
# 或
yarn add -P eslint globals typescript-eslint
```

### 1.3. 删除指定依赖

通过 `remove` 命令可以删除指定依赖

```bash
# 为当前工程删除依赖
yarn remove typescript tsx
```

## 3. 执行命令脚本

在 `package.json` 中可以定义命令脚本, 命令脚本位于 `scripts` 字段下, 例如:

```json
{
  ...,
  "scripts": {
    "lint": "eslint src/**/*.{ts,js,mjs,cjs} --fix",
    "test": "mocha src/**/*.spec.ts",
    "build": "tsc --project tsconfig.build.json && tsc-alias --project tsconfig.build.json",
    "clean": "rm -rf dist"
  },
  ...,
}
```

每个脚本实际上是一个 SHELL 命令行, 但包含了 `node_modules/.bin` 目录下的可执行 js 脚本 (例如可以将 `eslint` 作为命令直接运行, 其实际位置为 `node_modules/.bin/eslint`)

可以通过 `run` 命令通过脚本名称执行这些脚本, 例如:

```bash
yarn run lint
yarn run test
yarn run build
yarn run clean
```

如果命令和 `yarn` 的内置命令不冲突, 也可以省略 `run` 部分

```bash
yarn lint
yarn test
yarn build
yarn clean
```

## 4. 全局包管理

NPM 具备一个全局 `node_modules`, 其中包含的内容一般不作为某个工程的依赖, 而是操作系统全局可执行的工具包, 例如:

全局安装包

```bash
yarn add -g npm-check-updates
```

之后即可通过 `npx` (或直接) 执行相关命令

```bash
yarn dlx ncu -u
# 或
ncu -u
```

## 5. 命令执行器

### 5.1. `yarn exec` 命令

YARN 的 `exec` 命令用于执行一个命令, 该命令包含在 `node_modules` 下的某个包中, 由 `package.json` 中的 `bin` 字段定义

```bash
# 执行 node_modules 下 eslint@9.16.0 包中的 eslint 命令, <@版本号> 部分可省略
yarn eslint --fix
```

如果当前工程的 `package.json` 中包含 `bin` 字段, 则也可以通过 `yarn exec` 执行

```json
{
  ...,
  "bin": {
    "yarn-app": "./main.js"
  },
  ...
}
```

执行 `bin` 定义的命令如下

```bash
yarn exec yarn-app
```

### 5.2. `yarn dlx` 命令

通过 `yarn dlx` 命令可以执行 `node_modules` 下某个依赖包 `bin` 目录下的可执行脚本, 也可以执行 `yarn` 全局 `node_modules`, 例如:

```bash
# 全局安装包
yarn add -g npm-check-updates

# 执行 ncu 命令
yarn dlx ncu -u
# 或
ncu -u
```

```bash
# 工程中安装包
yarn add tsx

# 执行 tsx 命令
yarn dlx tsx ./index.ts
# 或
tsx ./index.ts
```

> 注意: 如果要执行命令对应的依赖包未包含在 `node_modules` 目录下, 则 `yarn dlx` 会自动下载该依赖包

## 6. 工作空间

### 6.1. 定义和使用子工程

工作空间 (Workspace) 是组织多个子工程的方法, 可以将不同目标的代码置于不同的子工程中, 子工程可以独立运行, 也可以被主工程作为依赖引用

工作空间需要在 `package.json` 文件中定义

```json
{
  ...,
  "workspaces": [
    "./packages/*"
  ],
  ...
}
```

表示将 `packages` 目录下的所有子目录作为子工程, 也可以逐个子工程独立指定

```json
{
  ...,
  "workspaces": [
    "packages/module-1",
    "packages/module-2"
  ],
  ...
}
```

每个子工程路径中也需要包含 `package.json` 文件, 用于定义子工程的配置, 其定义方式和主工程基本类似, 在主工程路径下, 执行如下命令, 可以安装所有子工程

```bash
yarn install
```

之后即可在主工程 (或其它子工程) 中, 通过子工程的名称 (即 `package.json` 文件中的 `name` 属性) 引用子工程中的模块

### 6.2. 在工程中引用工作空间

在工程 (主工程或其它子工程) 中, 可以引入工作空间内子工程的模块, 具体需要在 `package.json` 的 `dependencies` 字段下声明, 例如:

```json
{
  ...,
  "dependencies": {
    "yarn-app-misc": "workspace:*",
    "yarn-app-tool": "workspace:^1.0.0"
  },
  ...
}
```

表示从工作空间中引入名为 `yarn-app-misc` 和名为 `yarn-app-tool` 的子工程作为模块, 版本任意或大于 `1.0.0`; `yarn-app-misc` 是当前某个子工程 `package.json` 的 `name` 属性, 版本为 `package.json` 的 `version` 属性

声明过后, YARN 不再认为 `yarn-app-misc` 需要从网络下载安装, 而是必须从工作空间引入

### 6.2. 为指定子工程执行命令

命令 `workspace <name>` 表示该命令针对于指定子工程执行; 命令参数 `workspaces` 表示针对于所有子工程执行命令

```bash
# 为指定子工程执行命令

# 为 `yarn-app-lib` 子工程执行 `yarn install` 命令
yarn workspace yarn-app-lib install
# 为 `yarn-app-lib` 子工程执行 `yarn lint` 命令
yarn workspace yarn-app-lib lint
```

```bash
# 列举子工程

# 列出所有子工程
yarn workspaces list
# 递归列出所有子工程
yarn workspaces list --recursive

```bash
# 为子工程安装依赖

# 为所有子工程安装依赖
yarn workspaces focus -A
# 为所有子工程安装生产环境依赖
yarn workspaces focus -A --production
```

```bash
# 为所有子工程执行命令

# 执行所有子工程下 eslint 命令
yarn workspaces foreach -A run eslint --fix
# 并行执行所有工程下 eslint 命令
yarn workspaces foreach -A -pt run eslint --fix
```
