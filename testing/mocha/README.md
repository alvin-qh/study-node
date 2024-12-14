# Mocha

## 1. 配置

### 1.1. 配置文件

Mocha 通过项目根路径下的 `.mocharc.json` 进行配置

也可以将 Mocha 的配置合并在 `package.json` 文件内, 但推荐使用单独的 Mocha 配置文件

参见 [.mocharc.json](.mocharc.json) 文件

### 1.2. 集成 Typescript

#### 1.2.1. 通过 `ts-node` 依赖

如果项目安装 `ts-node` 依赖, 则需在 `.mocharc.json` 文件中加入如下配置

```json
{
  ...,
  "require": [
    "ts-node/register"
  ],
  ...
}
```

#### 1.2.2. 通过 `tsx` 依赖

如果项目安装了 `tsx` 依赖, 则需要在 `.mocharc.json` 文件中加入如下配置

```json
{
  ...,
  "node-option": [
    "import=tsx"
  ],
  ...
}
```

### 1.3. 支持 Typescript 路径别名

如果在 `tsconfig.json` 中配置了 `paths` 字段即路径别名, 则默认情况下, Mocha 无法识别通过路径别名导入的包, 需要安装 `tsconfig-paths` 依赖, 并在 `.mocharc.json` 文件中加入相应配置

```json
{
  ...,
  "require": [
    "tsconfig-paths/register"
  ],
  ...
}
```

### 1.4. 支持环境变量文件

如果项目中使用了 `.env` 环境变量文件并通过 `dotenv` 依赖引入, 默认情况下 Mocha 不会引入环境变量文件中的内容, 需要在 `.mocharc.json` 文件中加入相应配置

```json
{
  ...,
  "env": "dotenv_config_path=.env", // 指定 .env 文件位置
  "require": [
    "dotenv/config"  // 配置 dotenv 依赖
  ],
  ...
}
```

## 2. 使用 Mocha 进行测试

参考 [Mocha 使用手册](./docs/mocha.md) 相关章节

## 3. 在 VSCode 中使用 Mocha

VSCode 需要通过 **Mocha Test Explorer** 插件对 Mocha 测试进行支持, 默认对当前工程的 `test/**` 目录下脚本执行测试, 需要通过 VSCode 配置设置正确的测试脚本文件位置

```json
{
  "mochaExplorer.files": "src/**/*.spec.ts",
  "mochaExplorer.watch": "src/**/*.spec.ts"
}
```
