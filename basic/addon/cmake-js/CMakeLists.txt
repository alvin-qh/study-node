cmake_minimum_required(VERSION 3.20)

cmake_policy(SET CMP0091 NEW)
cmake_policy(SET CMP0042 NEW)

project(node_cmake CXX)

add_definitions(-DNAPI_VERSION=4)

file(GLOB_RECURSE node_cmake_src "*.cc")

add_library(${PROJECT_NAME} SHARED ${node_cmake_src} ${CMAKE_JS_SRC})

target_include_directories(${PROJECT_NAME}
  PRIVATE "${CMAKE_JS_INC}"
)

set_target_properties(${PROJECT_NAME} PROPERTIES PREFIX "" SUFFIX ".node")

target_link_libraries(${PROJECT_NAME} ${CMAKE_JS_LIB})

if(MSVC AND CMAKE_JS_NODELIB_DEF AND CMAKE_JS_NODELIB_TARGET)
  # Generate node.lib
  execute_process(COMMAND ${CMAKE_AR} /def:${CMAKE_JS_NODELIB_DEF} /out:${CMAKE_JS_NODELIB_TARGET} ${CMAKE_STATIC_LINKER_FLAGS})
endif()
