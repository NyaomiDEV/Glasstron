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

module.exports = class X11Utils {
	
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

	static encodeFromTypeName(typeName, data) {
		switch (typeName) {
			default:
				throw new Error("Unsupported type " + typeName);
			case "WINDOW":
			case "CARDINAL":
			case "ATOM":
			case "INTEGER":
				return this.encodeNumbers(data);
			case "UTF8_STRING":
				return this.encodeUTF8String(data);
			case "WM_STATE":
				return this.encodeWmState(data);
		}
	}

	static encodeNumbers(data) {
		let result = [];
		if (data.length > 0) {
			result = Buffer.alloc(4 * data.length);
			data.forEach((element, index) => {
				result.writeUInt32LE(element, 4 * index);
			});
		}
		return result;
	}

	static encodeUTF8String(data, null_terminated = false) {
		let _data = [];
		let length = 0;
		data.forEach((element, index) => {
			_data.push(Buffer.from(element));
			length += element.length;
			if ((index !== data.length - 1) || null_terminated) {
				_data.push(Buffer.from([0]));
				++length;
			}
		});
		return Buffer.concat(_data, length);
	}

	static encodeWmState(data) {
		let result = Buffer.alloc(8);
		result.writeUInt32LE(data.state, 0);
		if (!data.icon)
			data.icon = 0;
		result.writeUInt32LE(data.icon, 4);
		return result;
	}

};
