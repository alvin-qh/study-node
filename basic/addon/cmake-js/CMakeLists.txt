cmake_minimum_required(VERSION 3.20)

cmake_policy(SET CMP0091 NEW)
cmake_policy(SET CMP0042 NEW)

project(addon_cmake_js CXX)

# 设置 `NAPI` 版本号
add_definitions(-DNAPI_VERSION=9)

# 收集所有的 `.cc` 文件, 形成文件集合变量
file(GLOB_RECURSE addon_cmake_js_src "*.cc")

# 设置当前项目编译目标为动态库
add_library(${PROJECT_NAME}
  SHARED
    ${addon_cmake_js_src}
    ${CMAKE_JS_SRC}
)

# 设置当前项目编译目标扩展名为 `.node` 文件
set_target_properties(${PROJECT_NAME} PROPERTIES PREFIX "" SUFFIX ".node")

# 判断 `CMAKE_JS_INC` 变量是否存在
# `CMAKE_JS_INC` 为 `cmake-js` 引入的头文件路径, 包含 `node-api.h` 和 `napi.h` 头文件
if ("${CMAKE_JS_INC}" STREQUAL "")
  # 执行命令, 获取 `node-addon-api` 依赖库的 `include` 目录路径, 包含 `napi.h` 头文件
  execute_process(COMMAND node -p "require('node-addon-api').include"
    WORKING_DIRECTORY ${CMAKE_SOURCE_DIR}
    OUTPUT_VARIABLE addon_api_headers
  )
  string(REPLACE "\n" "" addon_api_headers ${addon_api_headers})
  string(REPLACE "\"" "" addon_api_headers ${addon_api_headers})

  # 设置 `CMAKE_JS_INC` 变量
  set(CMAKE_JS_INC "${api_headers}" "${addon_api_headers}")
endif()

# 为当前项目设置头文件路径
target_include_directories(${PROJECT_NAME}
  PRIVATE
    "${CMAKE_JS_INC}"
)

# 为当前项目链接库路径
target_link_libraries(${PROJECT_NAME}
  PRIVATE
    ${CMAKE_JS_LIB}
)

# 对于 MSVC 环境, 需执行一次构建命令
if(MSVC AND CMAKE_JS_NODELIB_DEF AND CMAKE_JS_NODELIB_TARGET)
  execute_process(COMMAND ${CMAKE_AR} /def:${CMAKE_JS_NODELIB_DEF} /out:${CMAKE_JS_NODELIB_TARGET} ${CMAKE_STATIC_LINKER_FLAGS})
endif()
