{
  "target_defaults": {
    "default_configuration": "Release",
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
    "cflags": [
      "-std=c++17"
    ],
    "cflags!": [
      "-fno-exceptions"
    ],
    "cflags_cc": [
      "-std=c++17"
    ],
    "cflags_cc!": [
      "-fno-exceptions"
    ],
    "defines": [
      "NAPI_DISABLE_CPP_EXCEPTIONS"
    ],
    "include_dirs": [
      "<!@(node -p \"require('node-addon-api').include\")"
    ],
  },
  "targets": [
    {
      "target_name": "simple",
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
