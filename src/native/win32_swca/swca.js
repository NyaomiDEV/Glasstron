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

module.exports = class SWCA{

	constructor(win){
		this.win = win;
		this.hwnd = this.win.getNativeWindowHandle()["readInt32" + os.endianness]();

		console.log("[Glasstron/SWCA] Trying to load the native SWCA module...");
		try{
			this.__swca = require("../../../native/swca.node");
			console.log("[Glasstron/SWCA] Native SWCA module loaded");
		}catch(_){
			console.log("[Glasstron/SWCA] Native SWCA module failed to load. Falling back to the executable.");
			this.__swca = new (require("./swca_executable.js"))();
		}
	}
	
	setWindowCompositionAttribute(mode, tint){
		this.wattr = [mode, tint];
		return this.__swca.setWindowCompositionAttribute(this.hwnd, mode, tint);
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
		if(!this.constructor.isWindows10April18OrAbove()) return this.setBlurBehind(tint);
		return this.setWindowCompositionAttribute(4, tint);
	}

	static isWindows10April18OrAbove(){
		if(process.platform !== "win32") return false;
		const version = os.release().split(".").map(x => parseInt(x));
		return version[0] >= 10 && version[1] >= 0 && version[2] >= 17134;
	}
}
