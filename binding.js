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

const execFile = require("util").promisify(require("child_process").execFile);
const fs = require("fs").promises;
const _path = require("path");

async function bindings(){
	if(await fs.stat(_path.resolve(__dirname, "build", "Release", "dwm.node"))){
		console.log("Glasstron's native DWM addon was built. Cleaning up...");
	}else{
		try{
			await execFile("npx", ["node-gyp", "rebuild"], {cwd: __dirname});
		}catch(err){
			console.log("Error while compiling the native addon.");
			throw err;
		}
			console.log("Node-gyp finished. Cleaning up...");
	}

	await fs.rename(_path.resolve(__dirname, "build", "Release", "dwm.node"), _path.resolve(__dirname, "native", "dwm.node"));
	await removeRecursive(_path.resolve(__dirname, "build"));
	console.log("Done!");
}

async function removeRecursive(path){
	const stat = await fs.stat(path);
	if(stat.isDirectory()){
		const sub = await fs.readdir(path);
		for(let subpath of sub){
			await removeRecursive(_path.join(path, subpath));
		}
		await fs.rmdir(path);
	}else
		await fs.unlink(path);
}

bindings();
