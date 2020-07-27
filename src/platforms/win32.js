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

const SWCA = require("../native/win32_swca/swca.js");

module.exports = class Win32 extends Platform {

	static init(win){
		if(typeof win.getSWCA === "undefined")
			this._defineSwca(win);
		
		if(typeof win.blurType === "undefined")
			this._defineBlurType(win);
	}

	static setBlur(win, bool){
		this.init(win);
		return Promise.resolve(this._apply(win, bool ? win.blurType : "none"));
	}

	static getBlur(win){
		if(typeof win.getSWCA === "undefined")
			return Promise.resolve(false);
		
		if(typeof win.blurType === "undefined")
			return Promise.resolve(false);
		
		return Promise.resolve(win.getSWCA().getWindowCompositionAttribute()[0] !== 0);
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
		let _blurType = "none";
		Object.defineProperty(win, "blurType", {
			get: () => _blurType,
			set: async (_newBlurType) => {
				if(_newBlurType == "none"){
					await win.setBlur(false);
					return;
				}
				_blurType = _newBlurType;
				const shouldUpdate = await win.getBlur();
				if(shouldUpdate) await win.setBlur(true);
			}
		});
	}
}
