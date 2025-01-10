#include <assert.h>

#include "common.h"

napi_value init(napi_env env, napi_value exports) {
  return MyObject::Init(env, exports);
}

NAPI_MODULE(NODE_GYP_MODULE_NAME, init)
