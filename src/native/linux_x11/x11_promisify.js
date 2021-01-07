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

const x11 = require("x11");

module.exports = class X11Promisify {

	static getPropertyData(id, prop){
		return new Promise((resolve) => {
			x11.createClient((err, display) => {
				let X = display.client;
				if(typeof id === "undefined")
					id = display.screen[0].root;

				X.GetProperty(0, id, prop, 0, 0, 10000000, (err, propData) => {
					X.GetAtomName(propData.type, (err, typeName) => {
						propData.typeName = typeName;
						X.close();
						resolve(propData);
					});
				});
			}).on("error", () => {
				resolve({
					type: undefined,
					bytesAfter: undefined,
					data: undefined,
					typeName: undefined
				});
			});
		});
	}

	static setPropertyData(id, prop, type, format, data){
		return new Promise((resolve) => {
			x11.createClient((err, display) => {
				let X = display.client;
				if(typeof id === "undefined")
					id = display.screen[0].root;
				
				X.ChangeProperty(0, id, prop, type, format, data);
				X.close();
				resolve();
			});
		});
	}

	static deleteProperty(id, prop){
		return new Promise((resolve) => {
			x11.createClient((err, display) => {
				let X = display.client;
				if(typeof id === "undefined")
					id = display.screen[0].root;
				
				X.DeleteProperty(id, prop);
				X.close();
				resolve();
			});
		});
	}

	static getAtomID(string){
		return new Promise((resolve) => {
			x11.createClient((err, display) => {
				let X = display.client;
				X.InternAtom(false, string, (err, propId) => {
					X.close();
					resolve(propId);
				});
			});
		});
	}

};
