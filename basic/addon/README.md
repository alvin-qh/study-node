# Node 插件系统

## 1. 工具链

Node 提供了两种编译工具链, 可以帮助快速的为 Node 项目构建 C/C++ 模块, 可在 Node 中使用的 C++ 模块本质上是一个动态链接库, 并且以 `.node` 作为文件扩展名

当编译得到了 `.node` 动态库后, 即可通过 Node 的 `require` 函数进行导入, 并在 Node 中进行调用

Node 提供了两种工具链和两种 API 进行 C++ 模块的编程, 两种工具链包括 `node-gyp` 和 `cmake-js`; 两种 API 包括 `node-api` 和 `napi`;

### 1.1. node-gyp

参考: <https://github.com/nodejs/node-gyp>

`node-gyp` 基于 `gyp` 工具链, 可以通过 `building.gyp` 对 C/C++ 源文件进行构建

`node-gyp` 同时需要 Python 以及 C++ 编译环境支持, 故配置起来较为麻烦

#### 1.1.1. 准备工作

##### Unix/Linux 平台

1. 安装 Python 开发环境, 2.x 和 3.x 版本均可
2. 安装 GCC 或 Clang 工具链和 Make 工具

##### macOS 平台

1. 安装 Python 开发环境, 2.x 和 3.x 版本均可
2. 安装 XCode (或 XCode Command Line Tools), 或者安装独立的 Clang 开发环境和 Make 工具

   ```bash
   # 安装 XCode Command Line Tools
   xcode-select --install
   ```

##### Windows 平台

1. 安装 Python 开发环境, 2.x 和 3.x 版本均可
2. 通过 NPM 安装 Windows Build Tools 工具包, 可自动安装所需 C++ 工具和配置

   ```bash
   npm i -g --production windows-build-tools
   ```

   也可以手动安装 Virtual Studio (或 Visual Studio Build Tools), 并通过 NPM 进行设置

   ```bash
   npm config set msvs_version 2022
   ```

#### 1.1.2. 安装和配置

在项目目录下执行如下命令

```bash
npm i -D node-gyp
```

如果安装了多个版本的 Python 环境, 则需要指定 GYP 使用的 Python (如果通过 PyENV 这类工具管理多个 Python, 则无需配置)

```bash
npm config set python /path/to/executable/python
```

也可以在执行 `node-gyp` 命令时指定所需的 Python 版本

```bash
npx node-gyp <command> --python /path/to/executable/python
```

如果使用 Windows 平台和 Virtual C++ 工具链, 且未通过 NPM 设置 Virtual Studio 版本, 则也可以通过 `node-gyp` 命令进行设置

```bash
node-gyp configure --msvs_version=2022
```

#### 1.1.3. GYP 命令

主命令

|   命令       | 说明                                          |
|-------------|-----------------------------------------------|
| `configure` | 配置当前项目, 生成所需的构建文件 (Makefile)        |
| `build`     | 通过调用 `make`/`msbuild.exe` 进行编译和构建     |
| `clean`     | 删除已生成的构建文件和目标文件                     |
| `rebuild`   | 连续运行 `clean`, `configure` 和 `build` 命令   |
| `install`   | 安装所需的头文件                                |
| `list`      | 列举所需的头文件                                |
| `remove`    | 删除所需的头文件                                |

命令参数

| 参数                               | 说明                                             |
|-----------------------------------|-------------------------------------------------|
| `-j n`, `--jobs n`                | 并行执行构建, `n` 为线程数                          |
| `--target=vx.y.z`                 | 设置对应的 Node 环境版本, 默认为 `process.version`   |
| `--silly`, `--loglevel=silly`     | 设置构建时的日志级别, 记录所有日志                    |
| `--verbose`, `--loglevel=verbose` | 设置构建时的日志级别, 记录主要日志                    |
| `--silent`, `--loglevel=silent`   | 设置构建时的日志级别, 不记录日志                      |
| `--debug`                         | 构建调试版本, 默认为 `--release`                    |
| `--release`, `--no-debug`         | 构建发行版本                                      |
| `-C $dir`, `--directory=$dir`     | 指定保存构建文件的路径                              |
| `--make=$make`                    | 自定义 `make` 命令 (例如 `--make=gmake`)           |
| `--thin=yes`                      | 使用精简数据库                                     |
| `--arch=$arch`                    | 设置编译目标的指令集架构, 默认为本机指令架构, 例如 `x64` |
| `--tarball=$path`                 | 从指定的本地压缩包提取头文件                         |
| `--devdir=$path`                  | 指定 SDK 的下载路径                                |
| `--ensure`                        | 如果头文件已存在, 则不再重新安装                      |
| `--dist-url=$url`                 | 从指定的 URL 下载 SDK                             |
| `--proxy=$url`                    | 设置下载代理服务器                                  |
| `--noproxy=$urls`                 | 设置忽略代理的 URL 列表                             |
| `--cafile=$cafile`                | 指定 CA 文件                                      |
| `--python=$path`                  | 指定 Python 环境的路径                             |
| `--msvs_version=$version`         | 设置 Virtual Studio 版本                          |
| `--solution=$solution`            | -                                               |

可以通过 `npm_config_<option>` 环境变量设置编译命令选项, 例如:

```bash
export npm_config_proxy=socks5h://127.0.0.1:10086

npx node-gyp install

# 相当于
# npx node-gyp install --proxy=socks5h://127.0.0.1:10086
```

#### 1.1.4. building.gyp 文件

`node-gyp` 构建需要配合 `building.gyp` 文件, 该文件中包含一个 Python 字典, 用于指定构建选项, 该文件内容如下:

```python
{
  # 定义编译时的环境变量
  "variables": {},

  # 定义要包含的另一个 `.gyp` 文件
  "includes": [
    "../build/common.gypi",
  ],

  # 定义默认的构建选项 (为所有目标生效)
  "target_defaults": {},

  # 设置构建目标和构建选项
  "targets": [
    {
      "target_name": "target_1",
      "sources": [
        "./target_1_1.cc",
        "./target_1_2.cc",
      ],
    },
    {
      "target_name": "target_2",
      "sources": [
        "./target_2_1.cc",
        "./target_2_2.cc",
      ],
    },
  ],

  # 设置条件构建分支
  "conditions": [
    ['OS=="linux"', {
      "targets": [
        {
          "target_name": "linux_target_3",
          "sources": [
            "./linux_target_3.cc",
          ],
        },
      ],
    }],
    ['OS=="win"', {
      "targets": [
        {
          "target_name": "windows_target_4",
          "sources": [
            "./windows_target_4.cc",
          ],
        },
      ],
    }],
  ],
}
```

可参考 [node-api/binding.gyp](./node-api/binding.gyp) 和 [napi/binding.gyp](./napi/binding.gyp) 文件

#### 1.1.5. 自动构建

`node-gyp` 支持自动构建, 即在执行 `npm install` 时, 自动执行构建动作, 需要在 `package.json` 中加入如下内容

```json
{
  ...,
  "gypfile": true
}
```

#### 1.1.6. 其它

为了能让开发环境自动配置 (例如 VSCode), 可以通过编写 `CMakeLists.txt` 文件, 通过 CMake 工具链完成开发环境配置, `CMakeLists.txt` 文件中主要是指定所需头文件的位置, 可以通过如下方式设置

```cmake
# 获取包含 `node_api.h` 头文件的路径, 将路径内容保存在变量 `api_headers` 中
execute_process(COMMAND node -p "require('node-api-headers').include_dir"
  WORKING_DIRECTORY ${CMAKE_SOURCE_DIR}
  OUTPUT_VARIABLE api_headers
)
string(REPLACE "\n" "" api_headers ${api_headers})
string(REPLACE "\"" "" api_headers ${api_headers})

# 获取包含 `napi.h` 头文件的路径, 将路径内容保存在变量 `addon_api_headers` 中
execute_process(COMMAND node -p "require('node-addon-api').include"
  WORKING_DIRECTORY ${CMAKE_SOURCE_DIR}
  OUTPUT_VARIABLE addon_api_headers
)
string(REPLACE "\n" "" addon_api_headers ${addon_api_headers})
string(REPLACE "\"" "" addon_api_headers ${addon_api_headers})

# 设置当前项目要包含的头文件
target_include_directories(${PROJECT_NAME}
  PRIVATE
    "${api_headers}"       # 设置 `node_api.h` 头文件所在路径
    "${addon_api_headers}" # 设置 `napi.h` 头文件所在路径
)
```

这样就可以在开发工具中找到所需的头文件

### 1.2. cmake-js

参考: <https://github.com/cmake-js/cmake-js>

`cmake-js` 基于 CMake 工具链, 和 `pyp` 工具链相比, 无需 Python 环境, 但需要 CMake 工具链, 通过 `CMakeLists.txt` 文件进行构建

`cmake-js` 的优势在于 CMake 工具链的通用性, 同时可支持构建过程以及开发环境, 更为方便

#### 1.2.1. 安装工具包

##### 安装 CMake

Linux 系统: 可通过自带的包管理器进行安装, 例如:

```bash
sudo apt install cmake
```

macOS 系统: 可通过 Homebrew 包管理器进行安装, 例如:

```bash
brew install cmake
```

Windows 系统: 可通过 scoop 包管理器进行安装, 例如:

```posh
scoop install cmake
```

也可以在 <https://cmake.org/download/> 网站下载二进制分发包进行下载

##### 安装 cmake-js

在当前项目中执行命令进行安装

```bash
npm i -D cmake-js
```

### 1.3. bindings 工具包

参考: <https://github.com/TooTallNate/node-bindings>

Node 的 C++ 模块会被编译为包含 `.node` 扩展名的动态库, 目标文件位置一般为当前项目的 `build/Release` 下, 如: `build/Release/demo_module.node`

当然, 如果在构建时选择了 Debug 模式, 则文件位置可能会在 `build/Debug` 目录下

当需要在 JS 文件中导入 C++ 模块时, 需要明确 `.node` 文件的确定位置, 并通过 `require` 函数进行导入, 即:

```js
// demo.cjs
const { Demo } = require('./build/Release/demo_module.node');
module.exports = { Demo };
```

通过 `bindings` 工具包, 则可以忽略 `.node` 文件的具体路径, 只需指定 `.node` 文件的文件名即可, `bindings` 工具包可在当前项目中进行自动搜索, 而且可支持 Node 的 ESM 模式, 即:

```js
// 从 `bindings` 模块导入插件对象
import addon from 'bindings';

// 从名为 `demo_module.node` 的 C++ 动态库中导入名为 `Demo` 的类
export const { Demo } = addon('demo_module');
```

## 2. API

### 2.1. Node API

参考: <https://www.nodeapp.cn/n-api.html>

<https://gyp.gsrc.io/docs/InputFormatReference.md>

### 2.2. NAPI

参考: <https://github.com/nodejs/node-addon-api/blob/main/doc/README.md>
