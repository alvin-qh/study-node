# Typescript for Node

## 1. 编译

Typescript 文件 (`.ts` 文件) 并不能直接被 Node 平台运行, 需要在运行前将 `.ts` 文件编译为 `.js` 文件, 这个过程是通过 `tsc` 命令来完成的, 需要先安装 `typescript` 模块

```bash
npm install -D typescript
```

即可执行 `tsc` 命令:

```bash
npx tsc
```

此时会根据默认的 `tsconfig.json` 配置文件对 `.ts` 文件进行编译, 也可以指定配置文件

```bash
npx tsc --project tsconfig.build.json
```

关于配置文件的解释请参见 [TypeScript 配置详解](./docs/tsconfig.md)

## 2. 直接运行

也可以直接运行 `.ts` 文件而无需进行编译, 这需要借助其它工具, 其原理是在内存中完成编译后执行, 故会降低程序启动的速度, 一般只在开发模式中使用, 这类工具主要有如下两种:

### 2.1. `ts-node` 工具

使用 `ts-node` 模块, 即可直接运行 `.ts` 文件而无需对其进行编译, 执行时默认使用 `tsconfig.json` 配置文件, 也可以指定配置文件

```bash
npm install ts-node
```

运行 `.ts` 文件

```bash
npx ts-node src/index.ts

# 指定配置文件
npx ts-node src/index.ts --project tsconfig.json
```

### 2.2. `tsx` 工具

`tsx` 比 `ts-node` 功能更多且性能更好, 提供了完整的 ESM 支持, `tsx` 的使用方式和 `ts-node` 基本一致, 执行时默认使用 `tsconfig.json` 配置文件, 也可以指定配置文件

安装所需模块

```bash
npm install tsx
```

运行 `.ts` 文件

```bash
npx tsx src/index.ts

# 指定配置文件
npx tsx src/index.ts --project tsconfig.json
```

## 3. 模块导出

一般情况下, 不会在模块中直接导出 `.ts` 文件, 这样一旦引用该模块的环境不是 Typescript, 则模块无法正确引入, 故推荐导出编译后的 `.js` 文件

Typescript 导出模块和 ES 的 ESM 或 CommonJS 模式基本一致, 均是通过 `package.json` 中的配置进行, 主要区别在于, Typescript 导出模块一般还需包含一个 `.d.ts` 文件, 作为被导出内容的类型标注

和导出 EM 模块类似, 为了最大兼容性, 需要同时描述 `package.json` 文件的 `exports`, `module` 和 `main` 属性, 另外还需额外描述一个 `types` 属性表示类型标注文件的位置, 且 `exports` 属性中也应该包含 `types` 属性:

```json
{
  "name": "ts-lib",
  "type": "module",
  "exports": { // 描述要导出的内容 (新方法)
    ".": {     // 表示导出模块的相对路径
      "types": "./index.d.ts", // 描述要导出的类型标注文件
      "import": "./index.js",  // 描述要导出的 ESM 模块文件
      "require": "./index.cjs" // 描述要导出的 CJS 模块文件
    },
    "./database": {
      "types": "./database/index.d.ts", // 描述要导出的类型标注文件
      "import": "./database/index.js",  // 描述要导出的 ESM 模块文件
      "require": "./database/index.cjs" // 描述要导出的 CJS 模块文件
    }
  },
  "module": "./index.js",  // 描述要导出的 ESM 模块文件 (旧方式)
  "main": "./index.cjs",   // 描述要导出的 CJS 模块文件 (旧方式)
  "types": "./index.d.ts", // 描述要导出的类型标注文件 (旧方式)
  ...
}
```

## 附录

### 1. 关于 ESM 支持

如果在 `package.json` 中设置了如下配置

```json
{
  ...,
  "type": "module",
  ...
}
```

则意味着当前的 Node 环境为 ESM 模式, 运行环境会产生若干额外的要求:

1. 必须使用 `import`/`export` 语法导入/导出模块:

   ```js
   // `foo.js`

   export function foo(a, b) {
      return a + b;
   }
   ```

   ```js
   // index.js

   import { foo } from './foo.js';

   console.log(foo(1, 2));
   ```

2. 导入模块时必须包括扩展名

   对于 CommonJS 模式, 源代码中通过 `require` 导入模块时, 无需包含模块文件的扩展名, 另外, 对于使用了 Babel, Typescript 等编译工具的情况, 源代码中通过 `import` 导入模块时, 也无需包含模块文件的扩展名;

   但对于 ESM 模式, 则要求所有通过 `import` 导入的模块文件, 都必须包含扩展名;

   如果通过 `tsc` 命令将 `.ts` 文件编译为 `.js` 文件时, 编译结果中的 `import` 语句并不会包含模块文件的扩展名, 这就导致编译后的文件无法在 ESM 模式下运行, 解决这一问题的方法包括:

   1. 删除掉 `package.json` 文件中的 `"type": "module"` 配置, 从而使用 CommonJS 模式; 同时修改 `tsconfig.json` 配置文件, 将 Typescript 编译目标 (`target`) 设置为 CommonJS 模式, 即:

      ```json
      {
        "compilerOptions": {
          ...,
          "strict": true,
          "target": "CommonJS",
          ...
        },
        ...
      }
      ```

      由此通过将 `.ts` 文件编译为 CommonJS 模式的 `.js` 文件后运行

   2. 在 `.ts` 源文件中为模块文件导入添加 `.js` 扩展名, 例如:

      ```ts
      // 导入 `./foo.ts` 文件模块

      import { foo } from './foo.js';
      ```

      这样编译后的 `.js` 文件也会包含同样包含 `.js` 扩展名, 注意, 在源代码中实际导入的是 `foo.ts` 文件, 这会导致一些困惑

   3. 使用 `tsc-alias` 工具

      通过 `tsc-alias` 工具可以为 `tsc` 工具的编译结果 (`.js` 文件) 中所有 `import` 导入模块添加 `.js` 扩展名, 使其符合 ESM 模式的要求, 具体方式如下:

      第一步: 修改 `tsconfig.json` 文件, 添加 `tsc-alias` 的配置项

      ```json
      {
        ...,
        "tsc-alias": {
          "resolveFullPaths": true,
          "verbose": false
        },
        ...
      }
      ```

      第二步: 在 `tsc` 编译命令后加上 `tsc-alias` 命令, 以在编译结果中为 `import` 语句添加 `.js` 扩展名

      ```bash
      # 先通过 tsc 命令将 .ts 文件编译为 .js 文件
      npx tsc --project tsconfig.json

      # 再通过 tsc-alias 命令 import 语句添加 .js 扩展名
      npx tsc-alias --project tsconfig.json
      ```
