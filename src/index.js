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
const Module = require("module");
const BrowserWindow = require("./browser_window.js");
const Main = require("./main.js");

const __module = findModule("__glasstron");
if(typeof __module !== "undefined"){
	module.exports = __module.exports;
}else{
	module.exports = {
		init: function(){
			_inject();
			if(process.platform === "linux")
				_overrideEmit();
		},
		update: function(win, values){
			return Main.getInstance().update(win, values);
		},
		getPlatform: function(){
			return Main.getInstance().getCurrentPlatform();
		}
	};
	module.__glasstron = true;
}

// ------------------------------------------------------------- FUNCTIONS

function findModule(prop){
	for(let module in require.cache){
		if(typeof require.cache[module][prop] !== "undefined") return require.cache[module];
	}
	return undefined;
}

function _inject(){
	// Switches and configs that can be toggled on directly
	if(process.platform === "linux" && !electron.app.commandLine.hasSwitch("enable-transparent-visuals"))
		electron.app.commandLine.appendSwitch("enable-transparent-visuals"); // ALWAYS enable transparent visuals

	// Replace BrowserWindow with our wrapper class
	const electronPath = require.resolve("electron");
	const newElectron = Object.assign({}, electron, {BrowserWindow}); // Create new electron object

	delete require.cache[electronPath].exports; // Delete exports
	require.cache[electronPath].exports = newElectron; // Assign the exports as the new electron

	if(require.cache[electronPath].exports !== newElectron)
		console.log("Something's wrong! Glasstron can't be injected properly!");
};

function _overrideEmit(){ // from Zack, blame Electron
	const originalEmit = electron.app.emit;
	electron.app.emit = function(event, ...args) {
		if (event !== "ready") return Reflect.apply(originalEmit, this, arguments);
		setTimeout(() => {
			electron.app.emit = originalEmit;
			electron.app.emit("ready", ...args);
		}, 1000);
	};
}

