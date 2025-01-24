project(node_addon_api CXX)

# 执行命令, 获取 `node-addon-api` 依赖库的 `include` 目录路径
execute_process(COMMAND node -p "require('node-addon-api').include"
  WORKING_DIRECTORY ${CMAKE_SOURCE_DIR}
  OUTPUT_VARIABLE addon_api_headers
)
string(REPLACE "\n" "" addon_api_headers ${addon_api_headers})
string(REPLACE "\"" "" addon_api_headers ${addon_api_headers})

file(GLOB_RECURSE node_addon_api_src "*.cc")

add_library(${PROJECT_NAME} SHARED ${node_addon_api_src})

set_target_properties(${PROJECT_NAME} PROPERTIES PREFIX "" SUFFIX ".node")

if ("${CMAKE_SYSTEM_NAME}" STREQUAL "Linux")
  target_include_directories(${PROJECT_NAME}
    # 设置 Linux 环境下 `node_api.h` 文件所在路径
    PRIVATE "${api_headers}"
    # 设置 Linux 环境下 `napi.h` 文件所在路径
    PRIVATE "${addon_api_headers}"
  )
endif()
