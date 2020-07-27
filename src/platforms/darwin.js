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
"use strict";

const Platform = require("./_platform.js");

module.exports = class Darwin extends Platform {

	static init(win, _options){
		this._wrapVibrancy(win, _options.vibrancy || null);
	}

	static setBlur(win, bool){
		return Promise.resolve(win.setVibrancy(bool ? win.vibrancy : null));
	}

	static getBlur(win){
		return Promise.resolve(win.getVibrancy() === null);
	}

	static _wrapVibrancy(win, vibrancyInitialValue = "fullscreen-ui"){
		const originalFunction = win.setVibrancy;
		let _vibrancy = vibrancyInitialValue;
		let _vibrancyInternal = _vibrancy;
		Object.defineProperty(win, "vibrancy", {
			get: () => _vibrancy,
			set: async (_newVibrancy) => {
				if(typeof _newVibrancy === "undefined") return;
				if(_newVibrancy === "")
					_newVibrancy = null;
				if(_newVibrancy === null){
					originalFunction(null);
					_vibrancyInternal = null;
					return;
				}
				_vibrancyInternal = _newVibrancy;
				_vibrancy = _vibrancyInternal;
				if(_vibrancyInternal !== null) originalFunction(_vibrancy);
			}
		});
		const boundFunction = ((vibrancy) => {this.vibrancy = vibrancy;}).bind(win);
		Object.defineProperty(win, "setVibrancy", {
			get: () => boundFunction
		});
		Object.defineProperty(win, "getVibrancy", {
			get: () => _vibrancyInternal
		});
	}
}
