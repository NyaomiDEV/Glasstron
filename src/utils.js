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
'use strict';

const path = require('path');
const fs = require('fs');
const electron = require('electron');

const savepath = path.join(electron.app.getPath('appData'), 'glasstron');

class Utils{

	static getSavePath(){
		return savepath;
	}

	static copyToPath(innerFile, outerFilename = null, flags = fs.constants.COPYFILE_EXCL){
		if(!fs.existsSync(savepath)) fs.mkdirSync(savepath);
		return fs.copyFileSync(innerFile, Utils.getSavedPath(outerFilename || path.basename(innerFile)), flags);
	}

	static removeFromPath(filename){
		return fs.unlinkSync(Utils.getSavedPath(filename));
	}

	static isInPath(filename){
		return fs.existsSync(Utils.getSavedPath(filename));
	}

}

module.exports = Utils;
