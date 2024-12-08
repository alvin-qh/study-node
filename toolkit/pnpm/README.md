# NPM 工具链

PNPM 是现代化 Node 包管理器及工具链, 使用方式和 NPM 及其类似, 但其通过文件 Link 的方式管理 `node_modules` 中的依赖, 故其执行速度以及 `node_modules` 文件夹大小都较 NPM 有较大优势

在一些特殊场合, PNPM 会遇到兼容性问题, 导致其产生的 `node_modules` 文件夹结构错误, 无法支持 node 运行, 但大部分时候, PNPM 工作良好

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

## 5. 执行器

通过 `pnpm exec` 命令可以执行 `node_modules` 下某个依赖包 `bin` 目录下的可执行脚本, 也可以执行 `pnpm` 全局 `node_modules`, 例如:

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

工程中安装包

```bash
pnpm add tsx
```

之后即可通过 `pnpm exec` (或直接) 执行相关命令

```bash
pnpm exec tsx ./index.ts
# 或
pnpm tsx ./index.ts
```
