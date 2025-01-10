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
    }
  },
  "targets": [
    {
      "target_name": "simple",
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
    }
  ]
}
