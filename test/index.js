"use strict";

const glasstron = require("..");
const electron = require("electron");
const path = require("path");

electron.app.commandLine.appendSwitch("enable-transparent-visuals");
electron.app.on("ready", () => {
	setTimeout(
		spawnWindow,
		process.platform == "linux" ? 1000 : 0
	);
});

function spawnWindow(){
	const win = new glasstron.BrowserWindow({
		width: 800,
		height: 600,
		backgroundColor: "#00000000",
		transparent: true,
		title: "Glasstron test window",
		webPreferences: {
			nodeIntegration: true
		}
	});
	
	win.webContents.loadURL(`file://${__dirname}/index.html`);
	
	win.blurType = "blurbehind";
	win.setBlur(true);
	
	electron.ipcMain.on("blurToggle", async (e, value) => {
		const win = electron.BrowserWindow.fromWebContents(e.sender);
		if(win !== null){
			await win.setBlur(value);
			e.sender.send("blurToggled", await win.getBlur());
		}
	});
	
	return win;
}
