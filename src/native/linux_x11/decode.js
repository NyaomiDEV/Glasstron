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

module.exports = class X11Decode {
	
	static decodeFromTypeName(typeName, buffer){
		switch(typeName){
			default:
				throw new Error("Unsupported type " + typeName);
			case "WINDOW":
			case "CARDINAL":
			case "ATOM":
			case "INTEGER":
				return this.decodeNumbers(buffer);
			case "UTF8_STRING":
				return this.decodeUTF8String(buffer);
			case "WM_STATE":
				return this.decodeWmState(buffer);
		}
	}
	
	static decodeNumbers(buffer){
		let result = [];
		for (let i = 0; i < buffer.length; i += 4)
			result.push(buffer.readUInt32LE(i));
		
		return result;
	}

	static decodeUTF8String(buffer){
		let result = [];
		let init = 0;
		for (let i = 0; i < buffer.length; ++i) {
			if (buffer[i] === 0) {
				result.push(buffer.toString("utf8", init, i));
				init = i + 1;
			}
		}
		if (init < buffer.length) 
			result.push(buffer.toString("utf8", init));
		
		return result;
	}
	
	static decodeWmState(buffer){
		if (buffer.length !== 8)
			throw new Error("WTF IS THIS WM STATE?");
		return {
			state: buffer.readUInt32LE(0),
			icon: buffer.readUInt32LE(4)
		};
	}

};
