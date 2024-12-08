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

每个脚本实际上是一个 SHELL 命令行, 但包含了 `node_modules/.bin` 目录下的可执行 js 脚本 (例如可以将 `eslint` 作为命令直接运行, 其实际位置为 `node_modules/.bin/eslint`)

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

## 5. 命令执行器

### 5.1. `npm exec` 命令

NPM 的 `exec` 命令用于执行一个命令, 该命令包含在 `node_modules` 下的某个包中, 由 `package.json` 中的 `bin` 字段定义

```bash
# 执行 node_modules 下 eslint@9.16.0 包中的 eslint 命令, <@版本号> 部分可省略
npm exec --package=eslint@9.16.0 -c "eslint --fix"

# 上面命令的简化写法, -- 后表示 -c 参数内容, 注意 -- 后有一个空格
npm exec --package=eslint@9.16.0 -- eslint --fix

# 执行 node_modules 下 .bin 目录中 eslint 命令
npm exec -- eslint --fix
```

如果当前项目的 `package.json` 中包含 `bin` 字段, 则也可以通过 `npm exec` 执行

```bash
npm exec -- npm-app
```

### 5.2. `npx` 命令

通过 `npx` 命令可以执行 `node_modules` 下某个依赖包 `bin` 目录下的可执行脚本, 也可以执行 `npm` 全局 `node_modules`, 例如:

```bash
# 全局安装包
npm i -g npm-check-updates

# 执行 ncu 命令
npx ncu -u
# 或
ncu -u
```

之后即可通过 `npx` (或直接) 执行相关命令

```bash
# 工程中安装包
npm i -S tsx

# 执行 tsx 命令
npx tsx ./index.ts
# 或
tsx ./index.ts
```

如果当前项目的 `package.json` 中包含 `bin` 字段, 则也可以通过 `npx` 执行

```bash
npx npm-app
```

## 6. 工作空间

### 6.1. 定义和使用子项目

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

表示将 `packages` 目录下的所有子目录作为子项目, 也可以逐个子项目独立指定

```json
{
  ...,
  "workspaces": [
    "./packages/module-1",
    "./packages/module-2"
  ],
  ...
}
```

每个子项目路径中也许要包含 `package.json` 文件, 用于定义子项目的配置, 其定义方式和主项目基本类似, 在主项目路径下, 执行如下命令, 可以安装所有子项目

```bash
npm install
```

之后即可在主项目 (或其它子项目) 中, 通过子项目的名称 (即 `package.json` 文件中的 `name` 属性) 引用子项目中的模块

### 6.2. 为指定子项目执行命令

命令参数 `-w <子项目名称>` 表示该命令针对于指定子项目执行; 命令参数 `-ws` 表示针对于所有子项目执行命令

```bash
# 执行名为 npm-app-misc 子项目下的 lint 脚本
npm run lint -w npm-app-misc

# 执行所有子项目下的 lint 脚本
npm run lint -ws
```

```bash
# 执行名为 npm-app-misc 子项目下 eslint 命令
npm exec -w npm-app-misc -- eslint --fix

# 执行所有子项目下的 eslint 命令
npm exec -ws -- eslint --fix
```

```bash
# 执行名为 npm-app-misc 子项目下 eslint 命令
npx -w npm-app-misc eslint --fix

# 执行所有子项目下的 eslint 命令
npx -ws eslint --fix
```
