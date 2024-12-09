# PNPM 工具链

PNPM 是现代化 Node 包管理器及工具链, 使用方式和 NPM 及其类似, 但其通过文件 Link 的方式管理 `node_modules` 中的依赖, 故其执行速度以及 `node_modules` 文件夹大小都较 NPM 有较大优势

在一些特殊场合, PNPM 会遇到兼容性问题, 导致其产生的 `node_modules` 文件夹结构错误, 无法支持 node 运行, 但大部分时候 PNPM 都工作良好

## 1. 工程管理

通过 `init` 或 `create` 命令可以初始化工程, 创建 `package.json` 文件, 并通过模板创建工程基础结构

```bash
# 仅创建 package.json 文件
pnpm init
```

```bash
# 通过模板创建工程
pnpm create vite
pnpm create react-app
pnpm create @eslint/config
```

## 2. 依赖管理

### 1.1. 安装全部依赖

用于将 `package.json` 文件中包含的全部依赖进行安装

```bash
pnpm install
# 或
pnpm i
```

### 1.2. 添加指定依赖

通过 `add` 命令可以添加指定依赖

> PNPM 的 `add` 命令和 NPM 的 `install --save` 命令对应

```bash
# 为当前工程添加依赖
pnpm add typescript tsx
```

```bash
# 为当前工程添加依赖, 并保存在 package.json 文件的 devDependencies 中
pnpm add --save-dev eslint globals typescript-eslint
# 或
pnpm add -D eslint globals typescript-eslint
```

### 1.3. 删除指定依赖

通过 `remove` 命令可以删除指定依赖

> PNPM 的 `remove` 命令和 NPM 的 `uninstall` 命令对应

```bash
# 为当前工程删除依赖
pnpm remove typescript tsx
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

每个脚本实际上是一个 SHELL 命令行, 但包含了 `node_modules/<package>/bin` 目录下的可执行 js 脚本 (例如可以将 `eslint` 作为命令直接运行, 其实际位置为 `node_modules/eslint/bin/eslint.js`)

可以通过 `run` 命令通过脚本名称执行这些脚本, 例如:

```bash
pnpm run lint
pnpm run test
pnpm run build
pnpm run clean
```

> 在命令不冲突的情况下, 可以省略 `run` 命令, 上述命令可以写为:
>
> ```bash
> pnpm lint
> pnpm test
> pnpm build
> pnpm clean
> ```

## 4. 全局包管理

PNPM 具备一个全局 `node_modules`, 其中包含的内容一般不作为某个工程的依赖, 而是操作系统全局可执行的工具包, 例如:

全局安装包

```bash
pnpm add -g npm-check-updates
```

之后即可通过 `pnpm exec` (或 `pnpm` 命令) 执行相关命令

```bash
pnpm exec ncu -u
# 或
pnpm ncu -u
```

## 5. 命令执行器

### 5.1. `pnpm exec` 命令

PNPM 的 `exec` 命令用于执行一个命令, 该命令包含在 `node_modules` 下的某个包中, 由 `package.json` 中的 `bin` 字段定义

```bash
# 执行 node_modules 下 .bin 目录中 eslint 命令
pnpm exec eslint --fix
```

### 5.2. `pnpx` 命令

`pnpx` 命令是 `pnpm dlx` 命令的别名, 通过 `pnpx` 命令可以执行 `node_modules` 下某个依赖包 `bin` 目录下的可执行脚本, 也可以执行 `pnpm` 全局 `node_modules`, 例如:

```bash
# 全局安装包
pnpm i -g npm-check-updates

# 执行 ncu 命令
pnpx ncu -u
# 或
ncu -u
```

之后即可通过 `npx` (或直接) 执行相关命令

```bash
# 工程中安装包
pnpm add tsx

# 执行 tsx 命令
pnpx tsx ./index.ts
# 或
tsx ./index.ts
```

> 注意: 如果要执行命令对应的依赖包未包含在 `node_modules` 目录下, 则 `pnpx` 会自动下载该依赖包

## 6. 工作空间

### 6.1. 定义和使用子工程

工作空间 (Workspace) 是组织多个子工程的方法, 可以将不同目标的代码置于不同的子工程中, 子工程可以独立运行, 也可以被主工程作为依赖引用

工作空间需要在 `pnpm-workspace.yaml` 文件中定义

```yaml
packages:
  - "packages/*"
```

表示将 `packages` 目录下的所有子目录作为子工程, 也可以逐个子工程独立指定

```yaml
packages:
  - "packages/module-1"
  - "packages/module-2"
```

每个子工程路径中也需要包含 `package.json` 文件, 用于定义子工程的配置, 其定义方式和主工程基本类似, 在主工程路径下, 执行如下命令, 可以安装所有子工程

```bash
npm install
```

### 6.2. 在工程中引用工作空间

在工程 (主工程或其它子工程) 中, 可以引入工作空间内子工程的模块, 具体需要在 `package.json` 的 `dependencies` 字段下声明, 例如:

```json
{
  ...,
  "dependencies": {
    "pnpm-app-misc": "workspace:*",
    "pnpm-app-tool": "workspace:^1.0.0"
  },
  ...
}
```

表示从工作空间中引入名为 `pnpm-app-misc` 和名为 `pnpm-app-tool` 的子工程作为模块, 版本任意或大于 `1.0.0`; `pnpm-app-misc` 是当前某个子工程 `package.json` 的 `name` 属性, 版本为 `package.json` 的 `version` 属性

声明过后, PNPM 不再认为 `pnpm-app-misc` 需要从网络下载安装, 而是必须从工作空间引入

### 6.3. 为指定子工程执行命令

命令参数 `-w` (或 `--workspace-root`) 表示该命令针针对于主工程; 命令参数`-r` (`--recursive`) 表示该命令针对于所有子工程; 命令参数`-F` (或 `--filter`) 表示过滤指定的子工程

```bash
# 执行主工程下的 lint 脚本
pnpm run lint
# 或
pnpm -w run lint
```

```bash
# 执行名为 pnpm-app-misc 子工程下的 lint 脚本
pnpm -F run pnpm-app-misc lint

# 执行所有子工程下的 lint 脚本
pnpm -r run lint
```

```bash
# 执行名为 pnpm-app-misc 子工程下 eslint 命令
pnpm -F pnpm-app-misc exec eslint --fix

# 执行所有子工程下的 eslint 命令
npm -r exec eslint --fix
```
