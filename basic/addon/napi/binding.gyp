{
  # 定义公共编译选项
  "target_defaults": {
    # 设置默认编译配置为 `Release`
    "default_configuration": "Release",
    # 为不同的编译配置设置编译选项
    "configurations": {
      "Release": {
        "cflags": [
          "-O3"
        ],
        "cflags_cc": [
          "-O3"
        ],
        "defines": [
          "NDEBUG"
        ]
      }
    },
    # 定义 C++ 版本
    "cflags": [
      "-std=c++17"
    ],
    # 取消 `-fno-exceptions` 选项
    "cflags!": [
      "-fno-exceptions"
    ],
    # 定义 C++ 版本, 用于使用 `cflags_cc` 选项的编译器
    "cflags_cc": [
      "-std=c++17"
    ],
    # 取消 `-fno-exceptions` 选项, 用于使用 `cflags_cc` 选项的编译器
    "cflags_cc!": [
      "-fno-exceptions"
    ],
    # 定义公共宏
    "defines": [
      "NAPI_DISABLE_CPP_EXCEPTIONS"
    ],
    # 定义头文件路径
    # `node-gyp` 会自动加入 `node-api-headers` 头文件路径, `node-addon-api` 头文件需自行加入
    "include_dirs": [
      "<!@(node -p \"require('node-addon-api').include\")"
    ],
  },
  "targets": [
    {
      # 编译目标名称, 用于在 Node 中引入
      "target_name": "simple",
      # 设置编译目标相关的 `c++` 文件
      "sources": [
        "./simple.cc"
      ]
    },
    {
      "target_name": "arguments",
      "sources": [
        "./arguments.cc"
      ]
    },
    {
      "target_name": "callback",
      "sources": [
        "./callback.cc"
      ]
    },
    {
      "target_name": "builder",
      "sources": [
        "./builder.cc"
      ]
    },
    {
      "target_name": "function",
      "sources": [
        "./function.cc"
      ]
    },
    {
      "target_name": "object",
      "sources": [
        "./object.cc"
      ]
    }
  ]
}
