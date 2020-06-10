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
const execFile = require("util").promisify(require("child_process").execFile);
const Utils = require("../../utils.js");

module.exports = class SWCAExec {

	constructor(){
		this._p = Promise.resolve();
		if(!Utils.isInPath("swca.exe"))
			Utils.copyToPath(path.resolve(__dirname, "..", "..", "..", "build", "swca.exe"), "swca.exe");

		this.swca = path.resolve(Utils.getSavePath(), "swca.exe");
	}

	setWindowCompositionAttribute(hwnd, mode, tint){
		return this._p = this._p.then(() => {return execFile(this.swca, [hwnd, mode, tint])});
	}

}
