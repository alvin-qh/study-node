# Nodemon

> <https://github.com/remy/nodemon>

`nodemon` 工具用来监控磁盘文件的变化, 当指定文件发生变化后, 重新执行指定的命令

该工具在开发中非常有用, 当修改了源代码后, 无需重新启动应用程序进程, `nodemon` 会自动重启进程

## 1. 安装

`nodemon` 工具本质上就是一个 Node 依赖包, 通过 NPM 直接安装即可:

```bash
npm add -D nodemon
```

由于 `nodemon` 在监控文件和重启进程时会产生系统性能损耗, 故一般只用于开发环境 (即用于 `devDependencies`), 很少在生产环境中使用

## 2. 配置

`nodemon` 需要在工程的根目录下添加 `nodemon.json` 配置文件, 内容如下:

```json
{
  // 启动进程时加入的环境变量
  "env": {
    "NODE_ENV": "development"
  },

  // 在进程状态发生变化时回调的事件命令
  "events": {
    "crash": "echo \"App crashed\"",
    "exit": "echo \"App exited\"",
    "restart": "echo \"App restarted\"",
    "start": "echo \"App started\""
  },

  // 针对不同扩展名的文件, 启动进程的命令
  // 例如:
  // 当通过 `nodemon index.js` 启动进程时, `nodemon` 内部会通过 `tsx [argument] index.js` 执行程序
  "execMap": {
    "js": "tsx [argument]",
    "ts": "tsx [argument]"
  },
  "ext": "ts json js",

  // 忽略监控的文件夹
  "ignore": [
    ".git",
    "node_modules/**/node_modules"
  ],
  "restartable": "rs",
  "verbose": true,
  "watch": [
    [
      "src/**/*.json",
      "src/**/*.ts"
    ]
  ]
}
```
