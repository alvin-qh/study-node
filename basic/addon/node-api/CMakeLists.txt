project(addon_node_api C)

# 收集项目中所有的 `.c` 文件
file(GLOB_RECURSE addon_node_api "*.c")

# 设置当前项目输出动态链接库
add_library(${PROJECT_NAME} SHARED ${addon_node_api})

# 设置当前项目输出的动态链接库以 `.node` 扩展名结尾
# set_target_properties(${PROJECT_NAME} PROPERTIES PREFIX "" SUFFIX ".node")

# 设置当前项目要包含的头文件
target_include_directories(${PROJECT_NAME}
  PRIVATE
    "${api_headers}" # 设置 `node_api.h` 文件所在路径
)
