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

const DWM = require("../native/win32_dwm/dwm.js");

module.exports = class Win32 extends Platform {

	static init(win, _options){
		if(typeof win.getDWM === "undefined")
			this._defineDWM(win);
		
		if(typeof win.blurType === "undefined")
			this._defineBlurType(win, _options.blurType || null);
		
		super.init(win, _options);
	}

	static setBlur(win, bool){
		return Promise.resolve(this._apply(win, bool ? win.blurType : null));
	}

	static getBlur(win){
		if(typeof win.getDWM === "undefined")
			return Promise.resolve(false);
		
		if(typeof win.blurType === "undefined")
			return Promise.resolve(false);
		
		return Promise.resolve(win.getDWM().getWindowCompositionAttribute()[0] !== 0);
	}

	static _apply(win, type){
		switch(type){
			case "acrylic":
				return win.getDWM().setAcrylic();
			case "blurbehind":
				return win.getDWM().setBlurBehind();
			case "transparent":
				return win.getDWM().setTransparentGradient();
			case "none":
			case null:
			case "":
				return win.getDWM().disable();
			default:
				throw "Blur type is not recognized: please specify one of 'acrylic', 'blurbehind', 'transparent', 'none'.";
		}
	}

	static _defineDWM(win){
		const _DWM = new DWM(win);
		const boundFunction = (() => _DWM).bind(win);
		Object.defineProperty(win, "getDWM", {
			get: () => boundFunction
		});
	}

	/**
	 * Note for everyone, not just developers and contributors
	 * the win.blurType variable should always return a string
	 * between "acrylic", "blurbehind" and "transparent".
	 * It can return null but only initially, when the blurType is not set.
	 * It MUST NOT return null afterwards, even if win.setBlur(false) has been called.
	 * win.blurType defines the blurring effect to be used when blurring.
	 */
	static _defineBlurType(win, _defaultValue = null){
		let _blurType = _defaultValue;
		Object.defineProperty(win, "blurType", {
			get: () => _blurType,
			set: async (_newBlurType) => {
				if(_newBlurType === "none"){
					await win.setBlur(false);
					return;
				}
				_blurType = _newBlurType;
				const shouldUpdate = await win.getBlur();
				if(shouldUpdate) await win.setBlur(true);
			}
		});
	}
};
