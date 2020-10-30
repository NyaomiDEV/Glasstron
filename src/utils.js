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

const path = require("path");
const fs = require("fs");
const electron = require("electron");

const savepath = path.join(electron.app.getPath("appData"), "glasstron");

module.exports = class Utils {

	static getSavePath(){
		return savepath;
	}

	static copyToPath(innerFile, outerFilename = null, flags = fs.constants.COPYFILE_EXCL){
		if(!fs.existsSync(savepath)) fs.mkdirSync(savepath);
		return fs.copyFileSync(innerFile, path.resolve(Utils.getSavePath(), (outerFilename || path.basename(innerFile))), flags);
	}

	static removeFromPath(filename){
		return fs.unlinkSync(path.resolve(Utils.getSavePath(), filename));
	}

	static isInPath(filename){
		return fs.existsSync(path.resolve(Utils.getSavePath(), filename));
	}
	
	static getPlatform(){
		if(typeof this.platform === "undefined"){
			try {
				this.platform = require(`./platforms/${process.platform}.js`);
			}catch(e){
				console.error("It seems your platform is not supported by Glasstron!", e);
				this.platform = require("./platforms/_platform.js"); // serves as dummy anyway
			}
		}
		return this.platform;
	}
	
	static parseKeyValString(string, keyvalSeparator = "=", pairSeparator = ":"){
		let obj = {};
		for(let pair of string.split(pairSeparator)){
			const val = pair.split(keyvalSeparator);
			const key = val.shift();
			obj[key] = val.join(keyvalSeparator);
		}
		return obj;
	}
	
	static makeKeyValString(object, keyvalSeparator = "=", pairSeparator = ":"){
		let strArr = [];
		for(let key in object)
			strArr.push(key + keyvalSeparator + object[key]);
		
		return strArr.join(pairSeparator);
	}

	static getRegions(x, y, width, height, radius){
		const f = (x) => x === 1 ? 0 : 1 - Math.sqrt(1 - (x - 1)**2);
		const regions = [
			[x + radius, y, width - (radius * 2), height]
		];
		for(let i = 0; i < radius; i++){
			const pad = Math.round(f(i / radius) * radius);
			regions.push([x + i, y + pad, 1, height - (pad * 2)]);
			regions.push([x + width - i - 1, y + pad, 1, height - (pad * 2)]);
		}
		return regions;
	}
};
