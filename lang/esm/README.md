# ESM

Node 可以支持最新的 es Module 模式, 可以使用 `import` 和 `export` 进行包的导入和导出, 并可支持最新的 ES 语言标准

## 1. 配置

要开启 ESM 模式, 需要在 `package.json` 配置文件中, 将 `type` 设置为 `module`, 即

```json
{
  "name": "project-name",
  "private": true,
  "type": "module",
  ...
}
```

## 2. 模块导出

如果一个项目将作为 "库" 来定义, 则在 `package.json` 文件中的导出规则和 CommonJS 有所区别, 可定义如下:

```json
{
  "name": "es-module-lib",  // 定义模块的名称
  "type": "module",         // 开启 ESM 模式
  "exports": {              // 定义当前模块要导出的部分:
                            // - `import` 字段表示以 ESM 标准的导出的内容
                            // - `require` 字段表示以 CommonJS 标准导出的内容
    "import": "./index.js",
    "require": "./index.cjs"
  },
  "main": "./index.cjs",    // 传统的 CommonJS 标准导出
  ...
}
```

此时当其它项目导入该 "库" 时, 即可根据其它项目是否 ESM 或 CommonJS 来选择不同的导入方法, 例如:

```bash
# 安装所定义的模块

npm install -S ../module
```

则该其它项目的 `package.json` 文件应该如下:

```json
{
  "name": "es-module-app",
  "private": true,
  "type": "module",
  "dependencies": {
    "es-module-lib": "link:../module",
    ...
  },
  ...
}
```