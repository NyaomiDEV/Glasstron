/*
   Copyright 2020 AryToNeX

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
#include <napi.h>

#include "dwm.cpp"

Napi::Number set_window_composition_attribute(const Napi::CallbackInfo &info){
	Napi::Env env{info.Env()};

	return Napi::Number::New(
		env,
		swca(
			(HWND) info[0].As<Napi::Number>().Int64Value(),
			info[1].As<Napi::Number>().Int32Value(),
			info[2].As<Napi::Number>().Int32Value()
		)
	);
}

Napi::Object Init(Napi::Env env, Napi::Object exports){
	exports.Set(
		Napi::String::New(env, "setWindowCompositionAttribute"),
		Napi::Function::New(env, set_window_composition_attribute)
	);

	return exports;
}

NODE_API_MODULE(addon, Init)
