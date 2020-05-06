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

const os = require("os");
const path = require("path");
const execFile = require("util").promisify(require("child_process").execFile);
const Utils = require("../../utils.js");

module.exports = class SWCA{

	constructor(win){
		this.win = win;
		this.hwnd = this.win.getNativeWindowHandle()["readInt32" + os.endianness]();
		if(!Utils.isInPath("swca.exe"))
			Utils.copyToPath(path.join(__dirname, "swca.exe"), "swca.exe");

		this.swca = Utils.getSavedPath("swca.exe");
		this._p = Promise.resolve();
	}
	
	setWindowCompositionAttribute(mode, tint){
		this.wattr = [mode, tint];
		return this._p = this._p.then(() => return execFile(this.swca, [this.hwnd, mode, tint]));
	}
	
	getWindowCompositionAttribute(){
		return this.wattr;
	}

	disable(){
		return this.setWindowCompositionAttribute(0, 0);
	}

	setGradient(tint = 0xff000000){
		return this.setWindowCompositionAttribute(1, tint);
	}

	setTransparentGradient(tint = 0x00000000){
		return this.setWindowCompositionAttribute(2, tint);
	}

	setBlurBehind(tint = 0x00000000){
		return this.setWindowCompositionAttribute(3, tint);
	}

	setAcrylic(tint = 0x00000001){
		return this.setWindowCompositionAttribute(4, tint);
	}

	_applyPerformance(){
		const lessCostlyBlurWin = this.constructor.debounce(() => {this.setBlurBehind()}, 50, true);
		const moreCostlyBlurWin = this.constructor.debounce(() => {this.setAcrylic()}, 50);
		const callback = () => {
			if(this.wattr[0] === 4 && typeof this.perfmode === "boolean" && this.perfmode){
				lessCostlyBlurWin();
				moreCostlyBlurWin();
			}
		};
		this.win.on("move", callback);
		this.win.on("resize", callback);
	}

	/**
	 * Debounce function
	 * Might come in handy, given all those bouncy events!
	 */
	static debounce(func, wait, immediate){
		var timeout;
		return function() {
			var context = this, args = arguments;
			var callNow = immediate && !timeout;
			clearTimeout(timeout);
			timeout = setTimeout(function() {
				timeout = null;
				if (!immediate) func.apply(context, args);
			}, wait);
			if (callNow) func.apply(context, args);
		};
	}
}
