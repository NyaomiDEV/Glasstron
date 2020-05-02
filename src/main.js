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
'use strict';

const electron = require('electron');

module.exports = class Main{
	constructor(win){
		Object.defineProperty(this, 'win', {get: function() { return win; }});
		
		// Let's read our platform
		this._loadPlatform();
		
		this.win.setBackgroundColor = (color) => {
			if(typeof color == "undefined")
				color = "00000000";
			// Color transform from ARGB to RGBA
			color = [...color.replace('#','')];
			if(color.length % 4 === 0)
				for(let i=0;i<color.length/4;i++)
					color.push(color.shift());
			color = color.join("");
			// CSS insertion
			const callback = () => {
				return this.win.webContents.insertCSS(`:root{ background-color: #${color} !important; }`).then(key => {this._cssKey = key;});
			}
			if(typeof this._cssKey !== "undefined") return this.win.webContents.removeInsertedCSS(this._cssKey).then(callback);
			else return callback();
		}
		
		this.win.setBackgroundColor(this._bgColor);
		Main.prototype._instance = this;
	}
	
	static staticToInstance(){
		const instance = Main.prototype._instance;
		if(instance) return instance;
		return null;
	}
	
	update(values){
		const mappings = { // Glasstron platform types <--- process.platform types
			"win32": "windows",
			"linux": "linux",
			"darwin": "macos",
			"freebsd": "freebsd",
			"sunos": "sunos"
		};
		if(values[mappings[process.platform]])
			this._platform.update(values[mappings[process.platform]]);
		return true;
	}
	
	getCurrentPlatformClass(){
		return this._platform.constructor;
	}
	
	// Methods for private use -- don't call them from outside, please
	
	_loadPlatform(){
		try{
			this._platform = new (require(`./platforms/${process.platform}.js`))(this);
		}catch(e){
			console.log("It seems your platform is not supported by Glasstron!");
			this._platform = new (class Dummy{update(values){}});
		}
	}
	
	/**
	 * Another handy method to log directly to DevTools
	 */
	_log(message, level = 'log'){
		this._executeInRenderer(
			// RENDERER CODE BEGIN
			function(message, level){
				console[level]('%c[Glasstron] %c' + message, 'color:#ff00ff;font-weight:bold', 'color:inherit;font-weight:normal;');
			}
			// RENDERER CODE END
		, message, level);
	}
	
	// stolen from zack senpai
	_executeInRenderer(method, ...params) {
		if(method.name.length !== 0)
			method = method.toString().replace(method.name, "function").replace("function function", "function");
		else method = method.toString();
		return this.win.webContents.executeJavaScript(`(${method})(...${JSON.stringify(params)});`);
	}
}

