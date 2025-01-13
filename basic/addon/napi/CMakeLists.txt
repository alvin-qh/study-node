project(napi C)

file(GLOB_RECURSE napi_src "*.c")

add_library(${PROJECT_NAME} SHARED ${napi_src})

set_target_properties(${PROJECT_NAME} PROPERTIES PREFIX "" SUFFIX ".node")

if ("${CMAKE_SYSTEM_NAME}" STREQUAL "Linux")
  target_include_directories(${PROJECT_NAME}
    # 设置 Linux 环境下 `node_api.h` 文件所在路径
    PRIVATE "$ENV{HOME}/.cache/node-gyp/${node_version}/include/node"
  )
endif()
