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

const SWCA = require("../native/win32_swca/swca.js");

module.exports = class Win32{

	static setBlur(win, bool){
		if(typeof win.getSWCA === "undefined")
			this._defineSwca(win);
		
		if(typeof win.blurType === "undefined")
			win.blurType = "blurbehind";
		
		return Promise.resolve(this._apply(win, bool ? win.blurType : "none"));
	}
	
	static getBlur(win){
		if(typeof win.getSWCA === "undefined")
			return Promise.resolve(false);
		
		if(typeof win.blurType === "undefined")
			return Promise.resolve(false);
		
		return Promise.resolve(win.getSWCA().getWindowCompositionAttribute() !== 0);
	}

	static _apply(win, type){
		switch(type){
			case "acrylic":
				win.getSWCA().setAcrylic();
				break;
			case "blurbehind":
				win.getSWCA().setBlurBehind();
				break;
			case "transparent":
				win.getSWCA().setTransparentGradient();
				break;
			case "none":
			default:
				win.getSWCA().disable();
				break;
		}
	}
	
	static _defineSwca(win){
		const _swca = new SWCA(win);
		const boundFunction = (() => _swca).bind(win);
		Object.defineProperty(win, "getSWCA", {
			get: () => boundFunction
		})
	}
	
	static _defineBlurType(win){
		let _blurType;
		Object.defineProperty(win, "blurType", {
			get: () => _blurType,
			set: async (_newBlurType) => {
				_blurType = _newBlurType;
				await win.setBlur(!(await win.getBlur()));
			}
		});
	}
}
