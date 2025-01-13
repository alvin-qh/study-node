project(node_addon_api CXX)

# 执行命令, 获取 `node-addon-api` 依赖库的 `include` 目录路径
execute_process(COMMAND node -p "require('node-addon-api').include"
  WORKING_DIRECTORY ${CMAKE_SOURCE_DIR}
  OUTPUT_VARIABLE include_dir
)
string(REPLACE "\n" "" node_addon_api_include_dir ${include_dir})
string(REPLACE "\"" "" node_addon_api_include_dir ${include_dir})

file(GLOB_RECURSE node_addon_api_src "*.cc")

add_library(${PROJECT_NAME} SHARED ${node_addon_api_src})

set_target_properties(${PROJECT_NAME} PROPERTIES PREFIX "" SUFFIX ".node")

if ("${CMAKE_SYSTEM_NAME}" STREQUAL "Linux")
  target_include_directories(${PROJECT_NAME}
    # 设置 Linux 环境下 `node_api.h` 文件所在路径
    PRIVATE "$ENV{HOME}/.cache/node-gyp/${node_version}/include/node"
    # 设置 Linux 环境下 `napi.h` 文件所在路径
    PRIVATE "${node_addon_api_include_dir}"
  )
endif()
