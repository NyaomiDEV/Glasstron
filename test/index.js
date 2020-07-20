"use strict";

const glasstron = require('..');
const electron = require('electron');

let win;

electron.app.commandLine.appendSwitch("enable-transparent-visuals");
electron.app.on('ready', () => {
	setTimeout(
		spawnWindow,
		process.platform == "linux" ? 1000 : 0
	);
});

function spawnWindow(){
	const win = new glasstron.BrowserWindow({
		width: 800,
		height: 600,
	});
	
	win.webContents.loadURL('about:blank');
	win.webContents.insertCSS('html { background-color: transparent; }');
	
	win.blurType = "blurbehind";
	win.setBlur(true);
	
	return win;
}
