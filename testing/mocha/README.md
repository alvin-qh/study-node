# Mocha

- [Mocha](#mocha)
  - [1. 配置](#1-配置)
    - [1.1. 配置文件](#11-配置文件)
    - [1.2. 集成 Typescript](#12-集成-typescript)
    - [1.3. 支持 Typescript 路径别名](#13-支持-typescript-路径别名)
    - [1.4. 支持环境变量文件](#14-支持环境变量文件)
  - [2. 使用 Mocha 进行测试](#2-使用-mocha-进行测试)
  - [3. 在 VSCode 中使用 Mocha](#3-在-vscode-中使用-mocha)
    - [3.1. 通过 JavaScript Debug Terminal](#31-通过-javascript-debug-terminal)

---

## 1. 配置

### 1.1. 配置文件

Mocha 通过项目根路径下的 `.mochrc.json` 进行配置

也可以将 Mocha 的配置合并在 `package.json` 文件内, 但推荐使用单独的 Mocha 配置文件

参见 [.mocharc.json](.mocharc.json) 文件

### 1.2. 集成 Typescript

如果项目使用了 Typescript, 则需要安装 `ts-node` 依赖, 并在 `.mochrc.json` 文件中加入相应配置

```json
"require": [
  "ts-node/register"
],
```

### 1.3. 支持 Typescript 路径别名

如果在 `tsconfig.json` 中配置了 `paths` 字段即路径别名, 则默认情况下, Mocha 无法识别通过路径别名导入的包, 需要安装 `tsconfig-paths` 依赖并在 `.mochrc.json` 文件中加入相应配置

```json
"require": [
  "tsconfig-paths/register"
],
```

### 1.4. 支持环境变量文件

如果项目中使用了 `.env` 环境变量文件并通过 `dotenv` 依赖引入, 默认情况下 Mocha 不会引入环境变量文件中的内容, 需要在 `.mochrc.json` 文件中加入相应配置

```json
{
  "env": "dotenv_config_path=.env", // 指定 .env 文件位置
  "require": [
    "dotenv/config"  // 配置 dotenv 依赖
  ]
}
```

## 2. 使用 Mocha 进行测试

参考 [Mocha 使用手册](./docs/mocha.md) 相关章节

## 3. 在 VSCode 中使用 Mocha

### 3.1. 通过 JavaScript Debug Terminal
