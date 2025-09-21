# Jest

Jest 是 Facebook 推出的测试框架, 可用于 JavaScript, TypeScript 等脚本的测试, 兼容 CommonJS, ES Module 模式

## 1. 依赖

Jest 相关的依赖包括如下几个:

- `jest`: Jest 测试框架的主体;
- `@jest/globals`: 提供 Jest 测试用的公共函数库;
- `ts-jest`: Jest 测试框架对 TypeScript 的支持;
- `@types/jest`: Jest 测试框架对 TypeScript 的类型支持, 添加该依赖后, 即可在 `tsconfig.json` 文件中配置 Jest 全局类型:

  ```json
  {
    "compilerOptions": {
      ...,
      "types": [
        "jest",
        "node"
      ]
    },
    ...
  }
  ```

## 2. 配置

对于 CommonJS 模式, Jest 可做到开箱即用, 无需额外进行配置, 对于 ES Module 模式或 TypeScript 语言, 则需要额外的配置

### 2.1. TypeScript 支持

需要在 `jest.config.json` 配置文件中设置如下内容:

```js
/**
 * @type {import("ts-jest").JestConfigWithTsJest}
 */
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // 对于 `import from` 中导入的内容进行映射
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
    // 将 `@/...` 映射为 `src/...`
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};
```

1. 配置文件中, `preset` 字段指定通过 `ts-jest` 插件开启对 TypeScript 的支持;
2. 配置文件中, `moduleNameMapper` 字段指定的是 TypeScript 中的 `import` 路径的映射关系;

    TypeScript 的路径映射是通过 `tsconfig.json` 的 `paths` 属性指定, 对于 `tsconfig.json` 文件的如下配置:

    ```json
    {
      "compilerOptions": {
        "paths": {
          "@/*": [
            "./src/*"
          ]
        },
        ...
      },
      ...
    }
    ```

    对应的 `jest.config.js` 文件的如下配置:

    ```js
    export default {
      ...,
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
      },
    };
    ```

### 2.2. ES Module 支持

#### 2.2.1. ESM + JavaScript

Jest 目前主要还是对 CommonJS 模式提供直接支持, 如果要对 ES Module 进行支持, 需要进行如下配置:

1. 需要设置 `NODE_OPTIONS=--experimental-vm-modules` 环境变量, 开启 Node 的 `vm modules` 实验性支持;
2. 需要关闭 Jest 配置文件 `jest.config.js` 的 `transform` 项:

    ```js
    export default {
      testEnvironment: 'node',
      transform: {},  // 关闭 transform
      ...
    };
    ```

#### 2.2.2. ESM + TypeScript

1. 需要设置 `NODE_OPTIONS=--experimental-vm-modules` 环境变量, 开启 Node 的 `vm modules` 实验性支持;
2. 需要关闭 Jest 配置文件 `jest.config.js` 的 `transform` 项:

    ```js
    export default {
      preset: 'ts-jest',
      testEnvironment: 'node',
      transform: {
        '^.+\\.ts?$': [
          'ts-jest',
          { useESM: true },
        ],
      },
      extensionsToTreatAsEsm: ['.ts'],
      ...
    };
    ```

## 3. Jest Extended

Jest Extended 是一个第三方库, 用于为 Jest 扩展更多的 Matcher 方法, 详细文档可参考 [Jest Extended](https://jest-extended.jestcommunity.dev/docs)

### 3.1. 安装

Jest Extended 可直接通过 NPM 命令安装, 命令如下:

```bash
npm i -D jest-extended
```

### 3.2. 配置

#### 3.2.1. 手动引入

可以通过 `import`, 在代码中引入 Jest Extended 的 Matcher, 方式如下:

```js
// 引入 Jest Extended 的全部 Matcher
import * as matchers from 'jest-extended';
expect.extend(matchers);

// 或者引入部分 Matcher
import { toBeArray, toBeSealed } from 'jest-extended';
expect.extend({ toBeArray, toBeSealed });
```

手动引入的方式比较繁琐, 在条件允许的情况下, 应尽可能采用如下方式自动引入

#### 3.2.2. Jest 配置

在 Jest 配置文件 (`jest.config.js`) 中, 需要添加如下内容:

```js
export default {
  // ...
  setupFilesAfterEnv: ['jest-extended/all'],
}
```

#### 3.2.2. TypeScript 配置

对于 TypeScript 项目, 需要为 Jest Extended 的 Matcher 添加类型声明, 分如下两步:

首先需要添加一个类型声明文件 (如: `jest-extended.d.ts` 文件), 并包含如下内容:

```ts
import 'jest-extended';
```

在 `tsconfig.json` 文件中引入上述文件:

```json
{
  "compilerOptions": {
    ...
  },
  "files": [
    "jest-extended.d.ts"
  ]
}
```
