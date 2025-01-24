#include <napi.h>
#include <sstream>

class Demo : public Napi::ObjectWrap<Demo> {
public:
  Demo(const Napi::CallbackInfo& info)
    : Napi::ObjectWrap<Demo>(info) {
    if (info.Length() <= 0 || info[0].IsUndefined()) {
      Napi::TypeError::New(info.Env(), "value expected").ThrowAsJavaScriptException();
      return;
    }
    _value = info[0];
  }

  static void init(Napi::Env env, Napi::Object& exports) {
    Napi::Function fn = DefineClass(env, "Demo", {
        InstanceAccessor("value", &Demo::get_value, &Demo::set_value),
        InstanceMethod("toString", &Demo::to_string)
      });

    env.SetInstanceData(
      new Napi::FunctionReference(Napi::Persistent(fn))
    );

    exports.Set("Demo", fn);
  }
private:
  Napi::Value _value;

  Napi::Value get_value(const Napi::CallbackInfo& info) {
    return _value;
  }

  void set_value(const Napi::CallbackInfo& info, const Napi::Value& value) {
    if (value.IsUndefined()) {
      Napi::TypeError::New(info.Env(), "value is undefined").ThrowAsJavaScriptException();
      return;
    }
    _value = value;
  }

  Napi::Value to_string(const Napi::CallbackInfo& info) {
    std::stringstream stream;
    stream << "Hello CMakeJS, value is: " << _value.As<Napi::String>().Utf8Value();

    return Napi::String::New(info.Env(), stream.str());
  }
};
