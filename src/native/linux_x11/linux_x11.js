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

const x11 = require("./x11_promisify.js");
const decoder = require("./decode.js");
const encoder = require("./encode.js");

module.exports = class LinuxX11 {

	static async getXWindowManager(){
		const wmCheckProp = await x11.getAtomID("_NET_SUPPORTING_WM_CHECK");
		const wmCheck = await x11.getPropertyData(undefined, wmCheckProp);
		const wmid = decoder.decodeNumbers(wmCheck.data)[0];
		const wmNameProp = await x11.getAtomID("_NET_WM_NAME");
		const data = await x11.getPropertyData(wmid, wmNameProp);
		return decoder.decodeUTF8String(data.data)[0];
	}

	static async getXProperty(xid, propName){
		const prop = await x11.getAtomID(propName);
		const data = await x11.getPropertyData(xid, prop);
		if(typeof data.typeName === "undefined")
			return undefined;
		
		return decoder.decodeFromTypeName(data.typeName, data.data);
	}

	static async changeXProperty(xid, propName, typeName, format, data){
		const prop = await x11.getAtomID(propName);
		const type = await x11.getAtomID(typeName);
		const _encoded = encoder.encodeFromTypeName(typeName, data);
		return x11.setPropertyData(xid, prop, type, format, _encoded);
	}

	static async deleteXProperty(xid, propName){
		const prop = await x11.getAtomID(propName);
		return x11.deleteProperty(xid, prop);
	}

};
