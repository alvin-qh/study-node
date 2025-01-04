#pragma once

#ifndef __COMMON_H
#define __COMMON_H

#include <node_api.h>

/**
 * @brief 定义宏, 用于声明一个 `napi_property_descriptor` 结构体实例
 *
 * 该结构体用于注册一个 C++ 函数, 该函数可以在 Node 环境下调用
 *
 * @param name 函数名称
 * @param func 函数地址
 */
#define DECLARE_NAPI_METHOD(name, func) \
  { name, 0, func, 0, 0, 0, napi_default, 0 }


#endif // __COMMON_H
