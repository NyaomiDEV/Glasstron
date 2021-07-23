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
const EventEmitter = require("events").EventEmitter;

module.exports = class X11 extends EventEmitter {

	display = undefined;

	createConnection(){
		return new Promise((resolve, reject) => {
			if(this.display) resolve();

			x11.createClient((err, display) => {
				if (err) console.error(err);
				this.display = display;
				this.emit("connected");
				resolve();
			}).on("error", reject);
		})
	}

	closeConnection(){
		if(this.display.client){
			this.display.client.close();
			this.emit("disconnected");
		}
	}

	awaitConnection() {
		return new Promise(resolve => {
			if (this.display) resolve();
			else this.once('connected', resolve);
		})
	}

	getPropertyData(id, prop){
		return new Promise((resolve, reject) => {
			if(!this.display) reject(new Error('display is undefined'));

			if (typeof id === "undefined")
				id = this.display.screen[0].root;

			this.display.client.GetProperty(0, id, prop, 0, 0, 10000000, (err, propData) => {
				if(err) console.error(err);

				this.display.client.GetAtomName(propData.type, (err, typeName) => {
					if(err) console.error(err);

					propData.typeName = typeName;
					resolve(propData);
				});

			});
	
		});
	}

	setPropertyData(id, prop, type, format, data){
		return new Promise((resolve, reject) => {
			if (!this.display) reject(new Error('display is undefined'));

			if(typeof id === "undefined")
				id = this.display.screen[0].root;
				
			this.display.client.ChangeProperty(0, id, prop, type, format, data);
			resolve();
		});
	}

	deleteProperty(id, prop){
		return new Promise((resolve, reject) => {
			if (!this.display) reject(new Error('display is undefined'));

			if(typeof id === "undefined")
				id = this.display.screen[0].root;
				
			this.display.client.DeleteProperty(id, prop);
			resolve();
		});
	}

	getAtomID(string){
		return new Promise((resolve, reject) => {
			if (!this.display) reject(new Error('display is undefined'));

			this.display.client.InternAtom(false, string, (err, propId) => {
				if(err) console.error(err);

				resolve(propId);
			});
		});
	}

};
