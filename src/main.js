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

module.exports = class Main{
	constructor(){
		// Let's read our platform
		this._loadPlatform();
		
		Main.prototype._instance = this;
	}
	
	static getInstance(){
		if(typeof Main.prototype._instance === "undefined")
			new Main();
		return Main.prototype._instance;
	}
	
	update(win, values){
		const mappings = { // Glasstron platform types <--- process.platform types
			"win32": "windows",
			"linux": "linux",
			"darwin": "macos",
			"freebsd": "freebsd",
			"sunos": "sunos"
		};
		if(values[mappings[process.platform]])
			this._platform.update(win, values[mappings[process.platform]]);
		return true;
	}
	
	getCurrentPlatform(){
		return this._platform;
	}
	
	// Methods for private use -- don't call them from outside, please
	
	_loadPlatform(){
		try{
			this._platform = require(`./platforms/${process.platform}.js`);
		}catch(e){
			console.log("It seems your platform is not supported by Glasstron!");
			this._platform = class Dummy{static update(win, values){}};
		}
	}
}

