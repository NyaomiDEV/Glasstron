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
const Utils = require("../utils.js");

const x11 = require("../native/linux_x11/linux_x11.js");

// CorvetteCole's Blur Provider extension -- constants
const sigmaKey = "blur-provider";
const sigmaMin = 0;
const sigmaMax = 111;

module.exports = class Linux extends Platform {

	static async setBlur(win, bool){
		const wm = await Linux._getXWindowManager();
		switch(wm){
			case "KWin":
				return this._kwin_setBlur(win, bool);
				break;
			case "GNOME Shell":
				return this._blurProvider_setSigma(win, bool ? 100 : 0); // TODO: find a suitable sigma
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
			case "GNOME Shell":
				return this._blurProvider_getBlur(win);
				break;
			default:
				break;
		}
	}

	/**
	 * This method returns us the current X window manager used
	 * Note for Wayland: XWayland is X11 under Wayland: this'll work too
	 * This is now cached!
	 */
	static async _getXWindowManager(){
		if(typeof this._xWindowManager === "undefined")
			this._xWindowManager = await x11.getXWindowManager();
		return this._xWindowManager;
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
			win.getNativeWindowHandle().readUInt32LE(),
			"_KDE_NET_WM_BLUR_BEHIND_REGION"
		);
		if(typeof value !== "undefined")
			return true;
		return false;
	}

	/**
	 * Integration with CorvetteCole's Blur Provider extension
	 * for GNOME Shell
	 */
	static async _blurProvider_getBlur(win){
		const sigma = await this._blurProvider_getSigma(win);
		if(typeof sigma !== "undefined" && sigma > 0)
			return true;
		return false;
	}

	static async _blurProvider_getSigma(win){
		const hints = await this._mutter_getHints(win);
		if(hints[sigmaKey])
			return parseInt(sigmaKey);
		return undefined;
	}

	static async _blurProvider_setSigma(win, sigma){
		const hints = await this._mutter_getHints(win);
		if(sigma != 0)
			hints[sigmaKey] = (Math.min(sigmaMax, Math.max(sigmaMin, sigma))).toString();
		else
			delete hints[sigmaKey];
		return this._mutter_setHints(win, hints);
	}

	/**
	 * Helper methods for setting and retrieving Mutter hints
	 * for GNOME Shell extensions
	 */
	static async _mutter_getHints(win){
		const value = await x11.getXProperty(
			win.getNativeWindowHandle().readUInt32LE(),
			"_MUTTER_HINTS"
		);
		if(typeof value === "undefined")
			return {};
		
		return Utils.parseKeyValString(value);
	}
	
	static async _mutter_setHints(win, hints){
		return x11.changeXProperty(
			win.getNativeWindowHandle().readUInt32LE(),
			"_MUTTER_HINTS",
			"UTF8_STRING",
			8,
			Utils.makeKeyValString(hints)
		);
	}
}
