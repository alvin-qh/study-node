cmake_minimum_required(VERSION 3.20)

project(study-cpp CXX C)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)
set(CMAKE_VERBOSE_MAKEFILE ON)

# enable_testing()
add_compile_options(-g -pthread -fopenmp -W -Wno-unknown-pragmas -fno-stack-protector -fno-omit-frame-pointer)

# 执行命令行, 获取 Node 版本号
execute_process(COMMAND node --version
  WORKING_DIRECTORY ${CMAKE_SOURCE_DIR}
  OUTPUT_VARIABLE node_version
)
string(REPLACE "\"" "" node_addon_api_include_dir ${node_version})
string(REPLACE "v" "" node_version ${node_version})
string(REPLACE "\n" "" node_version ${node_version})

add_subdirectory(napi)
add_subdirectory(node-addon-api)
add_subdirectory(cmake-js)
