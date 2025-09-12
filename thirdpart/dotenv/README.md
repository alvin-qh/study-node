# dotenv

## 1. 使用

### 1.1. node

通过如下命令启动 node

```bash
node -r dotenv/config index.js
```

此命令会执行 `index.js` 文件并预先加载 `.env` 文件的内容, 命令行中还可以加入 `dotenv` 的其它配置

```bash
node -r dotenv/config index.js dotenv_config_path=.env dotenv_config_{option}={value}
```

其中 `dotenv_config_path` 用于指定 `.env` 文件的路径文件名, `dotenv_config_{option}` 用于指定 `dotenv` 的某个指定配置, 配置定义如下

```ts
export interface DotenvConfigOptions {
  /**
   * Default: `path.resolve(process.cwd(), '.env')`
   *
   * Specify a custom path if your file containing environment variables is located elsewhere.
   *
   * example: `require('dotenv').config({ path: '/custom/path/to/.env' })`
   */
  path?: string | URL;

  /**
   * Default: `utf8`
   *
   * Specify the encoding of your file containing environment variables.
   *
   * example: `require('dotenv').config({ encoding: 'latin1' })`
   */
  encoding?: string;

  /**
   * Default: `false`
   *
   * Turn on logging to help debug why certain keys or values are not being set as you expect.
   *
   * example: `require('dotenv').config({ debug: process.env.DEBUG })`
   */
  debug?: boolean;

  /**
   * Default: `false`
   *
   * Override any environment variables that have already been set on your machine with values from your .env file.
   *
   * example: `require('dotenv').config({ override: true })`
   */
  override?: boolean;

  /**
   * Default: `process.env`
   *
   * Specify an object to write your secrets to. Defaults to process.env environment variables.
   *
   * example: `const processEnv = {}; require('dotenv').config({ processEnv: processEnv })`
   */
  processEnv?: DotenvPopulateInput;

  /**
   * Default: `undefined`
   *
   * Pass the DOTENV_KEY directly to config options. Defaults to looking for process.env.DOTENV_KEY environment variable. Note this only applies to decrypting .env.vault files. If passed as null or undefined, or not passed at all, dotenv falls back to its traditional job of parsing a .env file.
   *
   * example: `require('dotenv').config({ DOTENV_KEY: 'dotenv://:key_1234…@dotenv.org/vault/.env.vault?environment=production' })`
   */
  DOTENV_KEY?: string;
}
```

也可以通过 `DOTENV_CONFIG_{OPTIONS}` 环境变量来定义 dotenv 的某项配置配置

### 1.2. TypeScript

通过如下代码可以在代码执行前自动加载 `.env` 中的内容

```ts
await import('dotenv/config');
```

### 1.3. 测试

#### 1.3.1. jest

要在测试前自动加载 `.env` 文件的内容, 可以在 [jest.config.js](./jest.config.js) 中加入如下配置

```js
"jest": {
  setupFiles: [
    "dotenv/config"
  ]
}
```

#### 1.3.2. mocha

要在每次测试前自动加入 `.env` 文件的内容, 可以在 [.mocharc.json](./.mocharc.json) 中增加如下配置

```json
{
  ...,
  "require": [
    "dotenv/config",
    ...
  ]
}
```

## 2. dotenvx

curl -sfS https://dotenvx.sh | sudo sh

`dotenv-vault` 可以通过密钥保护 `.env` 文件, 避免将关键信息 (例如密钥) 提交到 github 等平台导致信息泄漏, 该工具的基本原理为:

1. 将密钥和加密内容分开保存, 加密后的内容保存在 `.env.vault` 文件中, 可以提交到 github 等平台, 无需担心数据泄漏;
2. 密钥从 `vault.dotenv.org` 网站生成, 用户需要进入指定组织和项目后, 才能生成正确的密钥;
3. 同时拥有密钥和加密数据, 才能获取 `.env` 中的原始内容;

### 2.1. 安装

1. 通过 npm/yarn/pnpm 安装

   ```bash
   npm install -g dotenv-vault
   ```

   或者

   ```bash
   npm install --save-dev dotenv-vault
   ```

2. 其它安装方式

   ```bash
   brew install dotenv-org/brew/dotenv-vault
   ```

   或下载 .exe 安装包 <https://dotenv-vault-assets.dotenv.org/channels/stable/dotenv-vault-x64.exe>

### 2.2. 使用

1. 创建项目

   ```bash
   npx dotenv-vault new
   ```

   此时会打开提示 URL 地址, 打开浏览器后按照页面提示创建项目

2. 获取本地密钥

   ```bash
   npx dotenv-vault login
   ```

   此时会打开浏览器, 完成登录后会在本地生成 `.env.me` 文件, 该文件用于保存本地密钥

3. 创建加密文件

   ```bash
   npx dotenv-vault build
   ```

   此时会创建 `.env.vault` 文件, 其中的内容为从 `.env`, `.env.staging`, `.env.ci`, `.env.production` 等文件中读取内容并加密后的结果

4. 提交加密数据

   ```bash
   npx dotenv-vault push
   ```

   此时会将 `.env` 文件的内容加密并合并到 `.env.vault` 文件中, 并将变更信息提交到 `vault.dotenv.org` 网站

   除了提交 `.env` 文件, 还可以提交其它如 `.env.production` 等文件

   ```bash
   npx dotenv-vault push production
   npx dotenv-vault push staging
   npx dotenv-vault push ci
   ```

5. 获取 `.env` 文件原始内容

   ```bash
   npx dotenv-vault pull
   ```

   此操作会从 `.env.vault` 文件中解密 `.env` 文件的内容

   除了恢复 `.env` 文件, 还可以恢复其它如 `.env.production` 等文件

   ```bash
   npx dotenv-vault pull production
   npx dotenv-vault pull staging
   npx dotenv-vault pull ci
   ```

注意, `.env`, `.env.me`, `.env.production` 等存放密钥和原始内容的文件禁止提交到 github 等平台, `.env.vault` 可以放心提交

### 2.3. 集成

要通过 `dotenv` 库访问 `.env.vault` 中的加密内容, 只需要设置环境变量 `DOTENV_KEY` 即可, 该环境变量的值可以通过以下方式获取

```bash
npx dotenv-vault keys
```

此命令会列出所有有效的密钥, 包括 `development`, `staging` 和 `production` 等, 选择其中某个作为 `DOTENV_KEY` 环境变量的值即可, 此时代码中即可读取到对应的环境变量设置

```ts
import dotEnv from 'dotenv';
dotEnv.config();
```

如果 `DOTENV_KEY` 设置了对应 `development` 的密钥, 则对应 `.env` 文件; 同理, 如果 `DOTENV_KEY` 设置了对应 `production` 的密钥, 则对应 `.env.production` 文件
