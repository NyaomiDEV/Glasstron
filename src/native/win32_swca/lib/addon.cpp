#include <napi.h>

#include "swca.cpp"

Napi::Number set_window_composition_attribute(const Napi::CallbackInfo& info) {
    Napi::Env env{info.Env()};

    return Napi::Number::New(env,
                             swca((HWND)info[0].As<Napi::Number>().Int64Value(),
                                  info[1].As<Napi::Number>().Int32Value(),
                                  info[2].As<Napi::Number>().Int32Value()));
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
    exports.Set(Napi::String::New(env, "setWindowCompositionAttribute"),
                Napi::Function::New(env, set_window_composition_attribute));

    return exports;
}

NODE_API_MODULE(addon, Init)
