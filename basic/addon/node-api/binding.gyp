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
    # 定义头文件路径
    # `node-gyp` 会自动加入 `node-api-headers` 头文件路径
    "include_dirs": [],
  },
  # 设置编译目标
  "targets": [
    {
      # 编译目标名称, 用于在 Node 中引入
      "target_name": "simple",
      # 设置编译目标相关的 `c` 文件
      "sources": [
        "./simple.c"
      ]
    },
    {
      "target_name": "arguments",
      "sources": [
        "./arguments.c"
      ]
    },
    {
      "target_name": "callback",
      "sources": [
        "./callback.c"
      ]
    },
    {
      "target_name": "builder",
      "sources": [
        "./builder.c"
      ]
    },
    {
      "target_name": "function",
      "sources": [
        "./function.c"
      ]
    },
    {
      "target_name": "object",
      "sources": [
        "./object.c"
      ]
    }
  ]
}
