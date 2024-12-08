# NPM 工具链

NPM 是 Node 自带的工具链, 具有最好的兼容性, 但在性能和 `node_modules` 文件夹的管理上不具备优势, 已经逐步被 `cnpm`, `yarn`, `pnpm` 等工具取代

## 1. 工程管理

通过 `init` 或 `create` 命令可以初始化工程, 创建 `package.json` 文件, 并通过模板创建工程基础结构

```bash
# 仅创建 package.json 文件
npm init
```

```bash
# 通过模板创建工程
npm create vite
npm create react-app
```

## 2. 依赖管理

### 1.1. 安装全部依赖

用于将 `package.json` 文件中包含的全部依赖进行安装

```bash
npm install
```

### 1.2. 添加指定依赖

通过 `add` 命令可以添加指定依赖

```bash
# 为当前工程添加依赖
npm add typescript tsx
```

```bash
# 为当前工程添加依赖, 并保存在 package.json 文件的 dependencies 中
npm add --save typescript tsx
# 或
npm add -S typescript tsx
```

```bash
# 为当前工程添加依赖, 并保存在 package.json 文件的 devDependencies 中
npm add --save-dev eslint globals typescript-eslint
# 或
npm add -D eslint globals typescript-eslint
```

> npm 的命令具备很多别名, 其中 `add` 命令就是 `install` 命令的别名, 所以如下命令是等价的:
>
> ```bash
> npm add -S typescript
> ```
>
> ```bash
> npm install -S typescript
> ```
>
> 也可以使用 `install` 的另一个别名 `i`
>
> ```bash
> npm i -S typescript
> ```
>
> 可以参考 `npm help install` 命令查看全部别名

### 1.3. 删除指定依赖

通过 `remove` 命令可以删除指定依赖

```bash
# 为当前工程删除依赖
npm remove typescript tsx
```

> 这里的 `remove` 命令实际上是 `uninstall` 命令的别名, 所以如下命令是等价的:
>
> ```bash
> npm remove typescript
> ```
>
> ```bash
> npm uninstall typescript
> ```
>
> 也可以使用 `uninstall` 的另一个别名 `rm`
>
> ```bash
> npm rm typescript
> ```
>
> 可以参考 `npm help uninstall` 命令查看全部别名

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
npm run lint
npm run test
npm run build
npm run clean
```

## 4. 全局包管理

NPM 具备一个全局 `node_modules`, 其中包含的内容一般不作为某个工程的依赖, 而是操作系统全局可执行的工具包, 例如:

全局安装包

```bash
npm i -g npm-check-updates
```

之后即可通过 `npx` (或直接) 执行相关命令

```bash
npx ncu -u
# 或
ncu -u
```

## 5. 执行器

通过 `npx` 命令可以执行 `node_modules` 下某个依赖包 `bin` 目录下的可执行脚本, 也可以执行 `npm` 全局 `node_modules`, 例如:

全局安装包

```bash
npm i -g npm-check-updates
```

之后即可通过 `npx` (或直接) 执行相关命令

```bash
npx ncu -u
# 或
ncu -u
```

工程中安装包

```bash
npm i tsx
```

之后即可通过 `npx` (或直接) 执行相关命令

```bash
npx tsx ./index.ts
# 或
tsx ./index.ts
```
