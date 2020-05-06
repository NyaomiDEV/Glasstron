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

const util = require("util");
const exec = util.promisify(require("child_process").exec);
const execFile = util.promisify(require("child_process").execFile);

module.exports = class Linux{

	static update(win, values){
		if(typeof values.requestBlur === "boolean"){
			Linux._getXWindowManager().then(res => {
				switch(res){
					case "KWin":
						this._kwin_requestBlur(win, values.requestBlur);
						break;
					default:
						break;
				}
			});
		}
	}
	
	/**
	 * This method returns us the current X window manager used
	 */
	static _getXWindowManager(){
		if(process.env.XDG_SESSION_TYPE == "x11"){
			return execFile("which", ["xprop"]).then(res => {
				if(res.error){
					return null;
				}
				this._xprop = res.stdout.trim();
				
				const shCommand = `${this._xprop} -id $(${this._xprop} -root -notype | awk '$1=="_NET_SUPPORTING_WM_CHECK:"\{print $5\}') -notype -f _NET_WM_NAME 8t | grep "_NET_WM_NAME = " | cut --delimiter=' ' --fields=3 | cut --delimiter='"' --fields=2`;
				return execFile("sh", ["-c",shCommand]).then(res => {
					if(res.error) return null;
					return res.stdout.trim();
				});
			});
		}
		return Promise.resolve(null);
	}
	
	/**
	 * This method handles blurring on KWin
	 * Sorry, Wayland users (for now) :C
	 */
	static _kwin_requestBlur(win, mode){
		if(!this._xprop) return;
		if(process.env.XDG_SESSION_TYPE != "x11") return;
		const xid = "0x" + win.getNativeWindowHandle().readUInt32LE().toString(16);
		const shCommand = this._xprop + " -f _KDE_NET_WM_BLUR_BEHIND_REGION 32c " + (mode ? "-set" : "-remove") + " _KDE_NET_WM_BLUR_BEHIND_REGION " + (mode ? "0" : "") + " -id " + xid;
		return exec(shCommand);
	}
}
