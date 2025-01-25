cmake_minimum_required(VERSION 3.20)

project(study-cpp CXX C)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)
set(CMAKE_VERBOSE_MAKEFILE ON)

# enable_testing()

# 设置编译选项
add_compile_options(-g -pthread -fopenmp -W -Wno-unknown-pragmas -fno-stack-protector -fno-omit-frame-pointer)

# 执行命令, 获取 `node-api-headers` 依赖库的 `include` 目录路径, 其中包含了 `node_api.h` 头文件
execute_process(COMMAND node -p "require('node-api-headers').include_dir"
  WORKING_DIRECTORY ${CMAKE_SOURCE_DIR}
  OUTPUT_VARIABLE api_headers
)
string(REPLACE "\n" "" api_headers ${api_headers})
string(REPLACE "\"" "" api_headers ${api_headers})

# 设置子项目
add_subdirectory(node-api)
add_subdirectory(napi)
add_subdirectory(cmake-js)
