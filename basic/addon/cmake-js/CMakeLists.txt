cmake_minimum_required(VERSION 3.20)

cmake_policy(SET CMP0091 NEW)
cmake_policy(SET CMP0042 NEW)

project(node_cmake CXX)

add_definitions(-DNAPI_VERSION=9)

file(GLOB_RECURSE node_cmake_src "*.cc")

add_library(${PROJECT_NAME} SHARED ${node_cmake_src} ${CMAKE_JS_SRC})

if ("${CMAKE_JS_INC}" STREQUAL "")
  # 执行命令, 获取 `node-addon-api` 依赖库的 `include` 目录路径
  execute_process(COMMAND node -p "require('node-addon-api').include"
    WORKING_DIRECTORY ${CMAKE_SOURCE_DIR}
    OUTPUT_VARIABLE addon_api_headers
  )
  string(REPLACE "\n" "" addon_api_headers ${addon_api_headers})
  string(REPLACE "\"" "" addon_api_headers ${addon_api_headers})

  set(CMAKE_JS_INC "${api_headers}" "${addon_api_headers}")
endif()

target_include_directories(${PROJECT_NAME}
  PRIVATE "${CMAKE_JS_INC}"
)

message(STATUS "${CMAKE_JS_INC}")

set_target_properties(${PROJECT_NAME} PROPERTIES PREFIX "" SUFFIX ".node")

target_link_libraries(${PROJECT_NAME} ${CMAKE_JS_LIB})

if(MSVC AND CMAKE_JS_NODELIB_DEF AND CMAKE_JS_NODELIB_TARGET)
  # Generate node.lib
  execute_process(COMMAND ${CMAKE_AR} /def:${CMAKE_JS_NODELIB_DEF} /out:${CMAKE_JS_NODELIB_TARGET} ${CMAKE_STATIC_LINKER_FLAGS})
endif()
