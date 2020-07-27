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
		resizable: true,
		title: "Glasstron test window",
		autoHideMenuBar: true,
		frame: false, // this is a requirement for transparent windows it seems
		show: false,
		webPreferences: {
			nodeIntegration: true
		}
	});
	
	win.webContents.loadURL(`file://${__dirname}/index.html`);
	
	if(process.platform === "win32"){
		win.blurType = "blurbehind";
		electron.ipcMain.on("blurTypeChange", (e, value) => {
		const win = electron.BrowserWindow.fromWebContents(e.sender);
			if(win !== null){
				console.log("blurTypeChange", value);
				win.blurType = value;
				e.sender.send("blurTypeChanged", win.blurType);
			}
		});
	}

	win.setBlur(true);

	electron.ipcMain.on("blurToggle", async (e, value) => {
		const win = electron.BrowserWindow.fromWebContents(e.sender);
		if(win !== null){
			await win.setBlur(value);
			e.sender.send("blurToggled", await win.getBlur());
		}
	});
	
	electron.ipcMain.on("close", () => {
		electron.app.quit()
	});
	electron.ipcMain.on("minimize", (e) => {
		const win = electron.BrowserWindow.fromWebContents(e.sender);
		win.minimize();
	});

	win.show();

	return win;
}
