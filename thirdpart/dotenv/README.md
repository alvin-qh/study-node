# dotenv

参考: <https://www.dotenv.org/docs>

## 1. 使用

### 1.1. 通过命令行使用

#### 1.1.1. 加载 `.env` 文件

通过在 node 命令行参数中加入 `--require` 参数, 用 dotenv 模块载入 `.env` 文件中的内容, 命令行如下:

```bash
node -r/--require dotenv/config index.js
```

同样的命令行参数也适用于 `tsx` 命令行

```bash
npx tsx -r/--require dotenv/config index.ts
```

#### 1.1.2. 制定加载文件

除了默认的 `.env` 文件, 也指定所需加载的文件 (例如 `.env.dev` 文件), 可以通过 `dotenv_config_path` 参数来指定, 命令行如下:

```bash
node -r/--require dotenv/config index.js dotenv_config_path=.env.dev
```

#### 1.1.3. 其它设置

此命令会执行 `index.js` 文件并预先加载 `.env` 文件的内容, 命令行中还可以加入 dotenv 的其它配置

#### 1.1.4. 参数设置

要为 `dotenv` 模块设置更多参数, 可以通过 `dotenv_config_{option}={value}` 参数指定, 其中 `option` 为 dotenv 的配置项名称, `value` 为该配置的值, 命令行如下:

```bash
node -r/--require dotenv/config index.js dotenv_config_{option}={value}
```

可用的配置项名称包括:

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

### 1.2. 通过代码使用

也可以在代码中加载 `.env` 文件中的内容, 最简单的方式如下:

```javascript
await import('dotenv/config');
```

通过载入 `dotenv/config` 模块, `dotenv` 模块会自动将 `.env` 文件中的内容载入到环境变量中

也可以通过如下代码载入`.env` 文件, 并可设置 dotenv 配置项

```javascript
import dotEnv from 'dotenv';

const options = {
  path: path.resolve(process.cwd(), '.env'),
  override: true,
  processEnv: {},
  debug: true,
};

// 读取环境变量
const result = dotEnv.config(options);
```

上述代码会返回一个对象, 包含 `.env` 文件中的内容, 并且 `process.env` 中也会导入 `.env` 文件中的内容

### 1.3. 测试

#### 1.3.1. jest

要在测试前自动加载 `.env` 文件的内容, 可以通过如下命令执行测试

```bash
npx mocha --setupFiles dotenv/config
```

也可以在 [jest.config.js](./jest.config.js) 中加入如下配置

```js
"jest": {
  setupFiles: [
    "dotenv/config"
  ]
}
```

#### 1.3.2. mocha

要在测试前自动加入 `.env` 文件的内容, 可通过如下命令执行测试

```bash
npx mocha --require dotenv/config src/**/*.spec.ts
```

也可以在 [.mocharc.json](./.mocharc.json) 中增加如下配置

```json
{
  ...,
  "require": [
    "dotenv/config",
    ...
  ]
}
```

## 2. dotenv-expand

`dotenv-expand` 是一个模块, 用于扩展 dotenv 功能, 使其支持在一个环境变量中引用其它环境变量, 例如如下的 `.env` 文件:

```ini
APP_USER=Alvin
APP_VARIABLE=Develop dotenv by ${APP_USER}
```

其中 `APP_VARIABLE` 环境变量中引用了 `APP_USER` 环境变量, `dotenv-expand` 会将 `APP_VARIABLE` 环境变量中的 `${APP_USER}` 部分替换为 `APP_USER` 环境变量的值, 整个 `APP_VARIABLE` 环境变量最终扩展为 `Develop dotenv by Alvin`, 其使用方法为:

```javascript
import dotEnv from 'dotenv';
import { expand } from 'dotenv-expand';

// 读取环境变量
let result = dotEnv.config(options);
result = expand(result);
```

这样即完成了环境变量扩展, 将`APP_VARIABLE` 环境变量中的 `${APP_USER}` 部分替换为 `APP_USER` 环境变量的值

## 2. dotenvx

`dotenvx` 是一个命令行工具, 可以为进程在运行前将 `.env` 文件中的内容载入到环境变量中, 也可以为 `.env` 文件进行加密, 并在载入 `.env` 文件时进行解密

### 2.1. 安装

通过如下命令可以安装 `dotenvx` 命令行工具

```bash
curl -sfS https://dotenvx.sh | sudo sh
```

验证安装

```bash
dotenvx --help

Usage: dotenvx run -- yourcommand

a secure dotenv–from the creator of `dotenv`

Options:
  -l, --log-level <level>      set log level (default: "info")
  -q, --quiet                  sets log level to error
  -v, --verbose                sets log level to verbose
  -d, --debug                  sets log level to debug
  -V, --version                output the version number
  -h, --help                   display help for command

Commands:
  run                inject env at runtime [dotenvx run -- yourcommand]
  get [KEY]          return a single environment variable
  set <KEY> <value>  set a single environment variable
  encrypt            convert .env file(s) to encrypted .env file(s)
  decrypt            convert encrypted .env file(s) to plain .env file(s)
  keypair [KEY]      print public/private keys for .env file(s)
  ls [directory]     print all .env files in a tree structure
  rotate             rotate keypair(s) and re-encrypt .env file(s)

Advanced:
  radar                        📡 radar
  ext                          🔌 extensions
```

### 2.2. 执行进程命令

通过如下命令可以在进程启动时加载 `.env` 文件中的内容, 并设置到环境变量中

```bash
dotenvx run -- node index.js
```

或者

```bash
dotenvx run -- npm start
```

上面的命令行在 `run --` 后面指定启动目标进程的命令行, `dotenvx` 会自动将 `.env` 文件中的内容载入到环境变量中, 并启动目标进程, 使得目标进程的环境变量中包含 `.env` 文件中的内容

此时无需在代码中主动加载 `.env` 文件, `dotenvx` 已经将 `.env` 文件中的内容自动载入到环境变量中, 并启动指定进程, 令该进程运行时环境变量包含 `.env` 文件中的内容

### 2.3. 使用其它环境变量文件

可以通过 `-f/--file` 参数指定其它环境变量文件, 例如:

```bash
dotenvx run -f .env.production -- node index.js
```

表示将 `.env.production` 文件中的内容注入到目标进程的环境变量中

### 2.4. 加密解密

#### 2.4.1. 加密

为了保护 `.env` 文件的内容, 可以通过 `dotenvx encrypt` 命令将 `.env` 文件进行加密, 并生成一个加密后的 `.env` 文件, 例如:

```bash
dotenvx encrypt
```

上述命令默认将 `.env` 文件进行加密, `.env` 文件原本的内容被替换为加密后的内容, 并包含一个加密该文件的 Public Key:

```ini
#/-------------------[DOTENV_PUBLIC_KEY]--------------------/
#/            public-key encryption for .env files          /
#/       [how it works](https://dotenvx.com/encryption)     /
#/----------------------------------------------------------/
DOTENV_PUBLIC_KEY_ENC="0251b4ca294d5bf8f8696f8b706b5112fbfd2de35834929ecd442ed6ffdcead9c7"

# .env.enc
APP_USER=encrypted:BKWsVsS2l/10hnABrP/Mlb5URfCafQQh8FauCh0dKtKNtAjIZ7STL3hDW010etngQqnPuPTSxlZAbujSAZDIh2+L/sDi+LXYmgPLh2bwo5oL/0ocWgFsd/zALhQn8LvbcA2M2jpVdbEKPAw8Oc80RA==
APP_VARIABLE=encrypted:BMqmxxAKFteRpsJEQ+DTHIg8WXVgxCaZpCyCZvirrLk1EwuBFdg+f5RaFo0dlARFMDLmzbHXomd4wKhWdv/NigRjCIMucC69a4gfKEQPNpJLNcunqrb37jyjMCFWacn0LEMU6xANuAt7DDTuszAY1Sj+wOO5unfufpqg9jQbidM=
```

同时会生成一个 `.env.keys` 文件, 包含解密 `.env` 文件的 Private Key

可以通过 `-f/--file` 参数指定加密其它环境变量文件, 例如:

```bash
dotenvx encrypt -f .env.production
```

表示将 `.env.production` 文件进行加密, 并在 `.env.keys` 文件中添加一个用于解密该文件的 Private Key

#### 2.4.2. 解密

通过 `dotenvx decrypt` 命令可以将加密后的 `.env` 文件进行解密, 并将 `.env` 文件中的内容替换为解密后的内容, 例如:

```bash
dotenvx decrypt
```

和加密一样, 也可以通过 `-f/--file` 参数指定其它环境变量文件进行解密, 例如:

```bash
dotenvx decrypt -f .env.production
```

> 注意: `dotenvx decrypt` 命令要求 `.env.keys` 文件中必须包含一个用于解密该文件的 Private Key, 否则无法正确解密

### 2.5. 使用加密后的 `.env` 文件

在实际使用加密后的 `.env` 文件时, 无需进行解密 (以避免 `.env` 文件内容泄露), 可以通过 dotenvx 命令行工具将加密后的 `.env` 文件中的内容注入到目标进程的环境变量中, 并启动目标进程, 令该进程运行时环境变量包含加密后的 `.env` 文件中的内容, 例如:

```bash
DOTENV_PRIVATE_KEY_ENC=163c56d7e3fc33bb62c56c2bef0d3206c5293ba6b23214d53ce7c7931f7ec783 \
dotenvx run -- node index.js
```

或者

```bash
DOTENV_PRIVATE_KEY_ENC=163c56d7e3fc33bb62c56c2bef0d3206c5293ba6b23214d53ce7c7931f7ec783 \
dotenvx run -- npm start
```

这样就可以在启动目标进程前, 将加密的 `.env` 文件中的内容加载为进程环境变量
