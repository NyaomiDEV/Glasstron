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

const electron = require("electron");
const BrowserWindow = require("./browser_window.js");
const Main = require("./main.js");
const Hacks = require("./hacks.js");

const __module = findModule("__glasstron");
if(typeof __module !== "undefined")
	module.exports = __module.exports;
else{
	module.exports = {
		BrowserWindow,
		Hacks,
		// DEPRECATED STUFF FROM NOW ON
		init: function(){
			console.warn("Glasstron.init() is deprecated! Please use the Glasstron.BrowserWindow export");
			Hacks.injectOnElectron();
			if(process.platform === "linux")
				Hacks.delayReadyEvent();
		},
		update: function(win, values){
			console.warn("Glasstron.update() is deprecated! Please use the Glasstron.BrowserWindow export");
			// HACKY DEPRECATED CODE FROM HERE!!
			const mappings = { // Glasstron platform types <--- process.platform types
				"win32": "windows",
				"linux": "linux",
				"darwin": "macos",
				"freebsd": "freebsd",
				"sunos": "sunos"
			};
			
			let bool = false;
			if(values[mappings[process.platform]]){
				if(process.platform !== "win32")
					bool = values[mappings[process.platform]];
				else
					bool = ["acrylic","transparent","blurbehind"].includes(values[mappings[process.platform]]);
			}
			
			return Main.getInstance().setBlur(win, bool);
		},
		getPlatform: function(){
			return Main.getInstance().getCurrentPlatform();
		}
	};
	module.__glasstron = true;
}

function findModule(prop){
	for(let module in require.cache){
		if(typeof require.cache[module][prop] !== "undefined") return require.cache[module];
	}
	return undefined;
}


