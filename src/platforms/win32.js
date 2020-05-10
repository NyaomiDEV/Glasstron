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
	
	static update(win, values){
		if(typeof win._swca === "undefined")
			win._swca = new SWCA(win);
		
		if(typeof values.blurType !== "undefined"){
			this._apply(win, values.blurType);
		}
	}
	
	static _apply(win, type){
		switch(type){
			case "acrylic":
				win._swca.setAcrylic();
				break;
			case "blurbehind":
				win._swca.setBlurBehind();
				break;
			case "transparent":
				win._swca.setTransparentGradient();
				break;
			case "none":
			default:
				win._swca.disable();
				break;
		}
	}
}
