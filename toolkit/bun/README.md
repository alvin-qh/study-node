# Bun

Bun 是一个类似于 Node 的开发平台和运行时环境, 和 Node 的主要区别为: 1. 执行效率要高于 Node; 2. Typescript 语言作为第一公民, 无需借助其它外部工具链即可直接执行 `.ts` 文件, 且无需进行额外的编译工作

所以, 如果一个软件的所有模块都通过 Bun 开发, 则可以全程使用 Typescript, 无需将任何 `.ts` 编译为 `.js` 文件, Typescript 在 Bun 执行中就好似 JavaScript 在 Node 中执行一样

## 1. 安装

参见: <https://bun.sh/docs/installation>

Bun 依赖于 Bun 工具链, 通过如下命令安装即可

1. macOS 下通过 Homebrew 安装

   ```bash
   brew install oven-sh/bun/bun
   ```

2. Linux 下通过脚本安装

   ```bash
   curl -fsSL https://bun.sh/install | bash
   ```

3. Windows 下通过 Scoop 或 Powershell 安装

   Scoop 安装

   ```powershell
   scoop install bun
   ```

   Powershell 安装

   ```powershell
   powershell -c "irm bun.sh/install.ps1|iex"
   ```

4. 通过 NPM 工具安装

   通过 NPM 安装是个较为通用的方法, 各平台均适用

   ```bash
   npm install -g bun
   ```

## 2. 工具链

Bun 的工具链主要是 `bun` 命令行工具, 其具备执行器, 包管理器, 测试框架及工具等多方面作用

### 2.1. 工程管理

通过 `bun init` 命令可以初始化工程, 类似于 `node init` 的功能
参考: <https://bun.sh/docs/cli/init>

```bash
bun init
```

也可以通过 `bun create` 命令, 借助工程模板创建新工程
参考: <https://bun.sh/docs/cli/bun-create>

```bash
bun create remix
```

### 2.2. 执行器

参考: <https://bun.sh/docs/cli/run>

通过 `bun` 命令可以直接执行 `.{ts,js,mjs,cjs}` 脚本, 同时起到 `node` 命令和 `tsx` (`ts-node`) 等命令的作用

```bash
bun ./demo.ts
```

可以直接监控源代码自动重新执行

```bash
bun --watch demo.tsx
```

### 2.3. 包管理器

通过 `bun` 命令可直接管理当前项目的依赖包, 可起到 `npm`, `yarn`, `pnpm` 等工具的作用

根据 `package.json` 安装依赖包
参见: <https://bun.sh/docs/cli/install>

```bash
bun install
```

添加依赖包
参见: <https://bun.sh/docs/cli/add>, <https://bun.sh/docs/cli/remove>

```bash
# 安装依赖包
bun add lodash
bun add -D eslint
```

```bash
# 删除依赖包
bun remove lodash
```

### 2.4. 测试框架及工具

参见: <https://bun.sh/docs/cli/test>

通过 `bun test` 命令可执行测试, 起到 `mocha`, `jest` 等测试框架及工具的作用, 且 Bun 自带断言依赖包, 无需额外安装 `chai`, `assert` 等依赖

```bash
bun test ./*.spec.ts --timeout 1000
```

### 2.5. 模块执行器

参见: <https://bun.sh/docs/cli/bunx>

通过 `bunx` 命令可以执行一个依赖模块 (通常位于 `node_modules` 目录下), 和 `npx` 命令的作用类似

```bash
bunx eslint ./**/*.ts --fix
```

## 3. 模块导出

和 Node 平台类似, Bun 也是通过 `package.json` 文件声明当前模块的导出方式, 但由于 Bun 原生支持 Typescript, 故可以直接将当前模块导出, 而无需将 `.ts` 文件编译为 `.js` 文件

当然, 如果希望导出的模块可以被其它 Node 项目引入, 也可以借助 `typescript` 依赖的 `tsc` 命令将 `.ts` 文件编译为 `.js` 文件, 这就和使用 Node 平台无区别了

下面的 `package.json` 文件将当前项目直接导出

```json
{
  "name": "bun-lib",
  "version": "1.0.0",
  "type": "module",
  "exports": {
    ".": {
      "import": "./index.ts"
    }
  },
  "main": "src/index.ts",
  "module": "src/index.ts",
  ...
}
```

注意如果使用 `tsc` 编译 `.ts` 文件, 编译结果可能不符合 ESM 标准, 需要通过 `tsc-alias` 工具进行处理, 参考: [Typescript EMS 支持](../../lang/ts/README.md#1-关于-esm-支持)

## 4. Lockfile

作为包管理器, Bun 也具备自定义的依赖包锁定文件, 名称叫 `bun.lockb`, 和其它 Node 的包管理器不同, Bun 的依赖包锁定文件采用的是二进制文件格式存储

采用二进制文件的好处是读取速度很快, 但也失去了可读性, 要读取 `bun.lockb` 文件, 必须通过 `bun` 命令

```bash
bun bun.lockb
```

如果额外需要一份具备可读性的锁定文件, 则可以另外生成一份 `yarn.lock` 文本格式文件

```bash
bun install --yarn
```

或者通过设置全局配置文件 `~/.bunfig.toml`, 为每个工程默认生产 `yarn` 格式的依赖包锁定文件

```toml
[install.lockfile]
print = "yarn"
```

如果使用了 GIT 工具, 则需要在 `.gitattributes` 文件中设置 `lockb` 文件为二进制文件, 防止在做代码比较时出错

```ini
*.lockb binary diff=lockb
```

接下来需要改变 GIT 对 `lockb` 文件的处理行为上

```bash
git config --global diff.lockb.textconv bun
git config --global diff.lockb.binary true
```
