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

module.exports = class X11Internals {
	
	static _internal_getPropertyData(id, prop, callback){
		return x11.createClient(function(err, display) {
			let X = display.client;
			if(typeof id === "undefined")
				id = display.screen[0].root;

			X.InternAtom(false, prop, function(err, propId) {
				X.GetProperty(0, id, propId, 0, 0, 10000000, function(err, propData){
					X.GetAtomName(propData.type, function(err, typeName){
						propData.typeName = typeName;
						X.close();
						callback(propData);
					});
				});
			});
		});
	}

	static _internal_setPropertyData(id, prop, type, format, data, callback){
		return x11.createClient(function(err, display) {
			let X = display.client;
			if(typeof id === "undefined")
				id = display.screen[0].root;
		
			X.ChangeProperty(0, id, prop, type, format, data);
			X.close();
			callback();
		});
	}

	static _internal_deleteProperty(id, prop, callback){
		return x11.createClient(function(err, display) {
			let X = display.client;
			if(typeof id === "undefined")
				id = display.screen[0].root;
		
			X.DeleteProperty(id, prop);
			X.close();
			callback();
		});
	}

	static _internal_getAtomID(string, callback){
		return x11.createClient(function(err, display) {
			let X = display.client;
			X.InternAtom(false, string, (err, propId) => {
			X.close();
			callback(propId);
		});
	});
	}
	
}

