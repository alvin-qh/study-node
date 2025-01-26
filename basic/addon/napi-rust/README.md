# NAPI for Rust

`napi-rust` 是 NAPI 的 Rust 实现, 从而支持通过 Rust 语言编写 Node 模块

和 C++ 版本的 `napi` 库相比, `napi-rust` 的配置自动化程度更高, 代码编写也更为简单

## 1. 项目配置

### 1.1. 脚手架

`napi-rust` 提供了命令行工具 `@napi-rs/cli`, 可以自动创建脚手架工程

首先, 需要安装 `@napi-rs/cli` 命令行工具

```bash
npm i -g @napi-rs/cli
```

该工具需全局安装, 安装完毕后即可运行 `napi` 命令行或 `npx napi` 命令行, 命令行参数如下:

```bash
npx napi --help

━━━ 2.18.4 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  $ napi <command>

━━━ General commands ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  napi artifacts [-d,--dir #0] [--dist #0] [-c,--config #0]
    Copy artifacts from Github Actions into specified dir

  napi build [--platform] [--release] [--config,-c #0] [--cargo-name #0] [--target #0] [--features #0] [--bin #0] [--dts #0] [--const-enum] [--no-dts-header] [-p #0] [--profile #0] [--cargo-flags #0] [--js #0] [--js-package-name #0] [--cargo-cwd #0] [--pipe #0] [--disable-windows-x32-optimize] [--zig] [--zig-abi-suffix #0] [--zig-link-only] [--strip] [destDir]
    Build and copy native module into specified dir

  napi create-npm-dir [-t,--target #0] [-c,--config #0]
    Create npm packages dir for platforms

  napi new [--targets,-t #0] [--dry-run] [--enable-github-actions] [-n,--name] [-d,--dirname]
    Create a new project from scratch

  napi prepublish [-p,--prefix #0] [--tagstyle,-t #0] [-c,--config #0] [--dry-run] [--skip-gh-release] [--gh-release-name #0] [--gh-release-id #0]
    Update package.json and copy addons into per platform packages

  napi universal [-d,--dir #0] [--dist #0] [-c,--config #0]
    Combine built binaries to universal binaries

  napi version [-p,--prefix #0] [-c,--config #0]
    Update versions in created npm dir
```

通过 `napi new` 命令即可创建 Rust 模块, 创建过程中会有交互式引导

```bash
napi new

? Package name: (The name filed in your package.json) napi-rust-demo
? Dir name: napi-rust-demo
? Choose targets you want to support (Press <space> to select, <a> to toggle all, <i> to invert selection, and <enter> to proceed)
 ◯ armv7-unknown-linux-musleabihf
 ◉ x86_64-apple-darwin
 ◉ x86_64-pc-windows-msvc
❯◉ x86_64-unknown-linux-gnu
 ◯ x86_64-unknown-linux-musl
 ◯ x86_64-unknown-freebsd
 ◯ i686-pc-windows-msvc
(Move up and down to reveal more choices)
? Enable github actions? (Y/n) No
```

上述第三步是选择要支持的编译目标, 可通过 "上下" 键进行移动, 通过 "空格" 键进行多选, "回车" 键进行确认; 当完成最后一步后按 "回车" 键, 即可开始项目脚手架生成, 等待其完成即可

```bash
Writing Cargo.toml
Writing .npmignore
Writing build.rs
Writing package.json
Writing src/lib.rs
Writing __test__/index.spec.mjs
Writing .cargo/config.toml
Writing rustfmt.toml
Writing .gitignore
Writing .yarnrc.yml
➤ YN0000: Downloading https://repo.yarnpkg.com/4.6.0/packages/yarnpkg-cli/bin/yarn.js
➤ YN0000: Saving the new release in .yarn/releases/yarn-4.6.0.cjs
➤ YN0000: Done in 4s 252ms
➤ YN0000: · Yarn 4.6.0
➤ YN0000: ┌ Resolution step
➤ YN0085: │ + @napi-rs/cli@npm:2.18.4, ava@npm:6.2.0, @isaacs/cliui@npm:8.0.2, @isaacs/fs-minipass@npm:4.0.1, @mapbox/node-pre-gyp@npm:2.0.0, and 170 more.
➤ YN0000: └ Completed in 1s 276ms
➤ YN0000: ┌ Fetch step
➤ YN0000: └ Completed
➤ YN0000: ┌ Link step
➤ YN0000: └ Completed in 0s 523ms
➤ YN0000: · Done in 1s 884ms
```

脚手架生成完毕后在指定目录下自动生成如下目录和文件内容

```plaintext
├── __test__
├── npm
│   ├── darwin-x64
│   │   └── package.json
│   ├── linux-x64-gnu
│   │   └── package.json
│   └── win32-x64-msvc
│       └── package.json
├── src
│   └── lib.rs
├── target
├── .gitignore
├── .npmignore
├── build.rs
├── Cargo.lock
├── Cargo.toml
├── index.cjs
├── index.d.ts
├── package.json
└── rustfmt.toml
```

其中:

- `__test__`: 该目录下存放用于测试的 `.js` 文件, `napi-rust` 脚手架默认通过 `AVA` 框架执行测试, 可以自行更换为其它测试框架 (如本例中使用的 Mocha 框架);
- `npm`: 该目录下存放不同目标系统的编译配置, 其数量和内容根据创建脚手架时的选择而定;
- `src`: 该目录下存放 Rust 源代码, 由于模块需编译为动态链接库, 故源代码的入口为 `lib.rs` 文件;
- `target`: 该目录下存放构建结果;
- `.gitignore`, `.npmignore`: 用于定义 GIT 和 NPM 忽略文件的配置文件;
- `build.rs`: 用于执行模块构建的 Rust 文件;
- `Cargo.toml`, `Cargo.lock`: Rust 包管理器 Cargo 产生的依赖包列表文件;
- `index.js`: Node 入口文件, Rust 模块将通过该文件进行导出; 该文件在每次构建后自动生成, 默认情况下, 该文件名为 `index.js`, 可通过修改构建命令行参数指定其它文件名 (本例中为 `index.cjs`, 因为本例的 Node 配置为 ESM 模式, 需要通过 `.cjs` 扩展名表明该文件时 CommonJS 模式);
- `index.d.ts`: Node 类型文件, 记录被导出的 Rust 模块中相关内容的类型, 该文件在执行构建时自动生成;
- `package.json`: Node 的包管理配置文件;
- `rustfmt.toml`: Rust 的代码风格控制文件;

### 2. 构建用命令行

创建脚手架过程中, 会在 `package.json` 文件中创建一组命令行, 用于构建和测试 Rust 模块, 其内容包括:

```json
{
  ...,
  "scripts": {
    "artifacts": "napi artifacts",
    "build": "napi build --platform --release",
    "build:debug": "napi build --platform",
    "prepublishOnly": "napi prepublish -t npm",
    "universal": "napi universal",
    "version": "napi version",
    "test": "mocha **/*.spec.js --timeout=1000"
  }
}
```

其中:

- `artifacts`: 用于从 Github Action 复制项目内容到本地
- `build`: 用于构建 Rust 模块, 执行过程中会生成: 1) 指定目标平台的 Rust 动态库; 2) `index.js` 文件; 3) `index.d.ts` 文件; 注意: 生成的 `index.js` 为 CommonJS 模式, 由于本例中 Node 使用 ESM 模式, 故需通过 `--js` 参数指定生成 `index.cjs` 以明确其为 CommonJS 模式, 即:

  ```json
  {
    ...,
    "scripts": {
      "build": "napi build --platform --release --js index.cjs",
      ...
    }
  }
  ```

- `build:debug`: 和 `build` 命令相同, 生成 Debug 模式的目标结果用于调试;
- `prepublishOnly`: 执行预发布, 将当前构建信息发布到 GitHub Release 中;
- `universal`: ??;
- `version`: 输出模块版本号
- `test`: 执行模块测试, 这里已经改为通过 Mocha 框架进行测试;

最后, 通过执行

```bash
npm run build
```

即可完成 Rust 模块编译, 并通过

```bash
npm test
```

执行 Rust 模块的测试

## 2. 编写 Rust 模块

参考: <https://napi.rs/docs/introduction/getting-started> 文档内容
