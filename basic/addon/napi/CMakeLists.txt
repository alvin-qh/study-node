project(addon_napi CXX)

# 收集当前项目下的所有 `.cc` 文件
file(GLOB_RECURSE addon_napi_src "*.cc")

# 设置当前项目输出动态链接库
add_library(${PROJECT_NAME} SHARED ${addon_napi_src})

# 设置当前项目输出的动态链接库以 `.node` 扩展名结尾
# set_target_properties(${PROJECT_NAME} PROPERTIES PREFIX "" SUFFIX ".node")

# 执行命令, 获取 `node-addon-api` 依赖库的 `include` 目录路径, 其中包含了 `napi.h` 头文件
execute_process(COMMAND node -p "require('node-addon-api').include"
  WORKING_DIRECTORY ${CMAKE_SOURCE_DIR}
  OUTPUT_VARIABLE addon_api_headers
)
string(REPLACE "\n" "" addon_api_headers ${addon_api_headers})
string(REPLACE "\"" "" addon_api_headers ${addon_api_headers})

# 设置当前项目要包含的头文件
target_include_directories(${PROJECT_NAME}
  PRIVATE
    "${api_headers}"       # 设置 `node_api.h` 头文件所在路径
    "${addon_api_headers}" # 设置 `napi.h` 头文件所在路径
)
