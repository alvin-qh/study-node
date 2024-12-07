# CommonJS

CommonJS 是 Node 传统的模块管理方式, 使用 `require` 和 `module.exports` 进行包的导入和导出

## 1. 配置

要开启 ESM 模式, 需要在 `package.json` 配置文件中, 将 `type` 设置为 `commonjs` (或者不设置 `type` 属性), 即

```json
{
  "name": "project-name",
  "private": true,
  "type": "commonjs",
  ...
}
```

## 2. 模块导出

如果一个项目将作为 "库" 来定义, 则在 `package.json` 文件中的导出规则和 CommonJS 有所区别, 可定义如下:

```json
{
  "name": "cjs-lib",   // 定义模块的名称
  "version": "1.0.0",
  "exports": {         // 定义当前模块要导出的部分:
    ".": {             // 表示导出模块的路径
      "import": "./index.mjs", // 表示以 ESM 标准的导出的内容
      "require": "./index.js"  // 表示以 CommonJS 标准导出的内容
    }
  },
  "main": "./index.js",    // 传统的 CommonJS 模块文件导出
  "module": "./index.mjs",   // 传统的 ESM 模块文件导出
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
  "name": "cjs-app",
  "private": true,
  "dependencies": {
    "cjs-lib": "link:../module",
    ...
  },
  ...
}
```
