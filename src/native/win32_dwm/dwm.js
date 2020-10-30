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

module.exports = class DWM{

	constructor(win){
		this.win = win;
		this.hwnd = this.win.getNativeWindowHandle()["readInt32" + os.endianness]();
		this.wattr = [0, 0];

		console.debug("[Glasstron/DWM] Trying to load the native module...");
		try{
			this.__dwm = require("../../../native/dwm.node");
			console.debug("[Glasstron/DWM] Native module loaded");
		}catch(_){
			console.debug("[Glasstron/DWM] Native module failed to load. Falling back to the executable.");
			this.__dwm = new (require("./dwm_exec.js"))();
		}
	}
	
	setWindowCompositionAttribute(mode, tint){
		this.wattr = [mode, tint];
		return this.__dwm.setWindowCompositionAttribute(this.hwnd, mode, tint);
	}
	
	getWindowCompositionAttribute(){
		return this.wattr;
	}

	// TINT IS IN AGBR VALUES!!
	disable(tint = 0xffffffff){
		return this.setWindowCompositionAttribute(0, tint);
	}

	setGradient(tint = 0xffffffff){
		return this.setWindowCompositionAttribute(1, tint);
	}

	setTransparentGradient(tint = 0x00ffffff){
		return this.setWindowCompositionAttribute(2, tint);
	}

	setBlurBehind(tint = 0x00ffffff){
		return this.setWindowCompositionAttribute(3, tint);
	}

	setAcrylic(tint = 0x00ffffff){
		if(!this.supportsAcrylic()) return this.setBlurBehind(tint);
		return this.setWindowCompositionAttribute(4, tint);
	}

	supportsAcrylic(){
		return this.constructor.isWindows10April18OrAbove();
	}

	// I won't integrate the bottom static method into the top non-static one;
	// always watch out for shit, it can probably be useful later on
	static isWindows10April18OrAbove(){
		if(process.platform !== "win32") return false;
		const version = os.release().split(".").map(x => parseInt(x));
		return version[0] >= 10 && version[1] >= 0 && version[2] >= 17134;
	}
};
