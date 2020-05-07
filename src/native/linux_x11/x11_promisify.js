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

const x11 = require("./x11_internals.js");

module.exports = class X11Promisify{

	static async getPropertyData(id, prop){
		let promise = await new Promise((resolve, reject) => {
			x11._internal_getPropertyData(id, prop, (data) => {
				resolve(data);
			});
		}).catch(err => {throw err});

		return promise;
	}

	static async setPropertyData(id, prop, type, format, data){
		let promise = await new Promise((resolve, reject) => {
			x11._internal_setPropertyData(id, prop, type, format, data, () => {
				resolve();
			});
		}).catch(err => {throw err});

		return promise;
	}

	static async deleteProperty(id, prop){
		let promise = await new Promise((resolve, reject) => {
			x11._internal_deleteProperty(id, prop, () => {
				resolve();
			});
		}).catch(err => {throw err});

		return promise;
	}

	static async getAtomID(string){
		let promise = await new Promise((resolve, reject) => {
			x11._internal_getAtomID(string, (data) => {
				resolve(data);
			});
		}).catch(err => {throw err});

		return promise;
	}

}
