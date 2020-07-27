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

const Platform = require("./_platform.js");

const x11 = require("../native/linux_x11/linux_x11.js");

module.exports = class Linux extends Platform {

	static async setBlur(win, bool){
		const wm = await Linux._getXWindowManager();
		switch(wm){
			case "KWin":
				return this._kwin_setBlur(win, bool);
				break;
			default:
				break;
		}
	}

	static async getBlur(win){
		const wm = await Linux._getXWindowManager();
		switch(wm){
			case "KWin":
				return this._kwin_getBlur(win);
				break;
			default:
				break;
		}
	}

	/**
	 * This method returns us the current X window manager used
	 */
	static _getXWindowManager(){
		if(process.env.XDG_SESSION_TYPE == "x11")
			return x11.getXWindowManager();
		return Promise.resolve(null);
	}

	/**
	 * This method handles blurring on KWin
	 * Sorry, Wayland users (for now) :C
	 */
	static _kwin_setBlur(win, bool){
		if(bool)
			return x11.changeXProperty(
				win.getNativeWindowHandle().readUInt32LE(),
				"_KDE_NET_WM_BLUR_BEHIND_REGION",
				"CARDINAL",
				32,
				[0]
			);
		return x11.deleteXProperty(
			win.getNativeWindowHandle().readUInt32LE(),
			"_KDE_NET_WM_BLUR_BEHIND_REGION"
		);
	}

	static async _kwin_getBlur(win){
		const value = await x11.getXProperty(
			win.getNativeWindowHandle().readUInt32LE(), "_KDE_NET_WM_BLUR_BEHIND_REGION"
		);
		if(typeof value !== "undefined")
			return true;
		return false;
	}

}
