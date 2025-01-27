# Husky

参考: <https://husky.nodejs.cn/>

Husky 是应用于 Node 环境的 Git Hook 工具, 可以在代码提交的同时执行预定义的命令, 并且当所有命令均执行成功后方可进行提交, 否则会报告错误并中断提交过程

可能导致提交过程中断的错误包括:

- 代码静态检查未通过;
- 代码测试未通过;
- 代码编译未通过;
- 等

## 1. 安装配置

Husky 必须安装在和 `.git` 目录同级的路径下, 否则会因为无法找到 `.git` 目录导致注册 Git Hook 失败, 安装过程比较简单, 执行如下命令即可:

```bash
npm i -D husky
```

安装后即可进行初始化操作, 向当前所在的 `.git` 目录中安装 Git Hook 回调, 执行如下命令初始化 Husky:

```bash
npx husky init
```

初始化完毕后, 会在当前路径下生成 `.husky` 目录, 包括 [pre-commit](.husky/pre-commit) 文件以及 `_` 目录, 其中:

- `pre-commit` 文件为一个 `bash` 文件, 其中可包含任意 SHELL 命令行, 在 Git 提交前, 文件中的所有命令行均会被执行一次, 如果有任意命令行执行失败, 则会导致 Git 提交中止;
- `_` 路径下包含了所需的 Git Hook 命令行, 用于执行 Husky 脚本, 无需更改其中的任何内容;

注意: 新版本 (版本 10 以后) Husky 的 `pre-commit` 文件和之前版本略有区别, 取消了如下内容:

```bash
#!/usr/bin/env bash
. "$(dirname -- "$0")/_/husky.sh"
```

之前上述两行命令必须位于 `pre-commit` 文件的开始, 新版本的 Husky 不再需要这两行命令

## 2. 使用方式

### 2.1. 为不同环境执行初始化

一般情况下, 只需在开发环境提交时执行 Git Hook, 而在生产环境或者 CI 环境中, 则无需执行 Git Hook, 故需要根据不同环境选择是否需要执行 `husky init` 命令

另外, 对于生产环境, 通常也不会安装 `package.json` 中定义在 `devDependencies` 下的依赖包, 即意味着测试, Lint 等工程化操作都无法执行, 此时也需要针对不同环境选择是否注册 Git Hook

一个最佳实践包括如下操作:

1. 在 `.husky` 目录下创建 [install.js](.husky/install.js) 文件, 用于安装 Git Hook, 代码内容如下:

   ```js
   if (process.env.NODE_ENV === 'production' || process.env.CI === 'true') {
     process.exit(0);
   }

   const husky = (await import('husky')).default;
   console.log(husky());
   ```

   可以看到, 该代码不会为生产环境和 CI 环境执行 Husky 的初始化

2. 在 `package.json` 的 `scripts` 配置项中, 增加 `prepare` 命令行:

   ```json
   {
     ...,
     "scripts": {
       "prepare": "node .husky/install.js",
       ...
     }
   }
   ```

3. 通过 `npm run prepare` 命令取代 `npx husky init` 命令, 以便在不同环境进行 (或不进行) Husky 的初始化操作

也可以通过命令行的 `||` 运算符完成类似操作, 即:

```json
{
  ...,
  "scripts": {
    "prepare": "husky init || true",
    ...
  }
}
```

### 2.2. 跳过 Husky 执行

某些时候, 需要临时跳过 Husky 的执行 (例如需要紧急提交代码), Husky 提供了两种方式:

1. 在 Git 命令行增加 `-n` 或者 `--no-verify` 参数来禁止 Git Hook 执行, 例如:

   ```bash
   git commit -m "some comments" -n
   ```

2. 设置 `HUSKY=0` 环境变量, 跳过 Husky 执行, 例如:

   ```bash
   HUSKY=0 git commit -m "some comments"
   ```

   或者

   ```bash
   export HUSKY=0
   git commit -m "some comments 1"
   git commit -m "some comments 2"
   unset HUSKY
   ```

## 3. Node 项目为子项目的情况

对于如下项目结构:

```plaintext
.
├── .git/
├── backend/  # No package.json
└── frontend/ # package.json with husky
```

可以看到, `frontend` 项目 (包含 `package.json` 文件) 是整个项目的一个子项目, 其中并不包含 `.git` 目录 (`.git` 目录在上层路径下), 则无法直接执行 `husky init` 命令, 会提示 `.git` 目录不存在

此时, 在子项目的 `package.json` 文件的 `scripts` 配置项中, 修改 `prepare` 命令行如下:

```json
{
  ...,
  "scripts": {
  "prepare": "cd .. && npx husky frontend/.husky",
  ...
}
}
```

或者

```json
{
  ...,
  "scripts": {
  "prepare": "cd .. && node frontend/.husky/install.js",
  ...
}
}
```

这样就可以将子项目 (`frontend` 项目) 中的 Husky 注册到上层路径的 `.git` 目录中

对于子项目的 `pre-commit` 文件 (即 `frontend/.husky/pre-commit` 文件), 则需要先进入子项目的目录下, 才能执行对应的命令行

```bash
# frontend/.husky/pre-commit
cd frontend

npm run lint
npm test
npm run build
```
