"use strict";

const glasstron = require("..");
const electron = require("electron");
electron.app.commandLine.appendSwitch("enable-transparent-visuals");
electron.app.on("ready", () => {
	setTimeout(
		spawnWindow,
		process.platform === "linux" ? 1000 : 0
	);
	electron.nativeTheme.on("updated", checkDarkTheme);
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
		blur: true,
		blurType: "blurbehind",
		blurGnomeSigma: 100,
		blurCornerRadius: 20,
		vibrancy: "fullscreen-ui",
		webPreferences: {
			nodeIntegration: true
		}
	});
	
	win.webContents.loadURL(`file://${__dirname}/index.html`);
    
	if(process.platform === "linux"){
		win.on("resize", () => {
			win.webContents.send("maximized", !win.isNormal());
		});
	}
	
	win.on("ready-to-show", () => {
		checkDarkTheme(win);
		if(process.platform === "linux") win.webContents.send("maximized", !win.isNormal());
		if(process.platform === "win32" && win.getDWM().supportsAcrylic()){
			acrylicWorkaround(win, 60);
			win.webContents.send("supportsAcrylic");
		}
		win.show();
	});

	if(process.platform === "win32"){
		electron.ipcMain.on("blurTypeChange", (e, value) => {
			const win = electron.BrowserWindow.fromWebContents(e.sender);
			if(win !== null){
				win.blurType = value;
				e.sender.send("blurTypeChanged", win.blurType);
			}
		});
	}

	electron.ipcMain.on("blurToggle", async (e, value) => {
		const win = electron.BrowserWindow.fromWebContents(e.sender);
		if(win !== null){
			await win.setBlur(value);
			e.sender.send("blurStatus", await win.getBlur());
		}
	});
	
	electron.ipcMain.on("blurQuery", async (e) => {
		e.sender.send("blurStatus", await win.getBlur());
	});
	
	electron.ipcMain.on("close", () => {
		electron.app.quit();
	});

	electron.ipcMain.on("minimize", (e) => {
		const win = electron.BrowserWindow.fromWebContents(e.sender);
		win.minimize();
	});

	electron.ipcMain.on("wmQuery", async (e) => {
		if(process.platform !== "linux") return;
		e.sender.send("wmString", await glasstron.getPlatform()._getXWindowManager());
	});

	electron.ipcMain.on("gnomeSigma", async (e, res) => {
		if(process.platform !== "linux") return;
		if(await glasstron.getPlatform()._getXWindowManager() !== "GNOME Shell") return;
		win.blurGnomeSigma = res;
	});

	return win;
}

function checkDarkTheme(win){
	win.webContents.send("darkTheme", electron.nativeTheme.shouldUseDarkColors);
}

function acrylicWorkaround(win, pollingRate = 60){
	// Replace window moving behavior to fix mouse polling rate bug
	win.on("will-move", (e) => {
		if(win.blurType !== "acrylic")
			return;
		
		e.preventDefault();

		// Track if the user is moving the window
		if(win._moveTimeout)
			clearTimeout(win._moveTimeout);

		win._moveTimeout = setTimeout(
			() => {
				win._isMoving = false;
				clearInterval(win._moveInterval);
				win._moveInterval = null;
			}, 1000/pollingRate);

		// Start new behavior if not already
		if(!win._isMoving){
			win._isMoving = true;
			if(win._moveInterval)
				return false;

			// Get start positions
			win._moveLastUpdate = 0;
			win._moveStartBounds = win.getBounds();
			win._moveStartCursor = electron.screen.getCursorScreenPoint();

			// Poll at (refreshRate * 10) hz while moving window
			win._moveInterval = setInterval(() => {
				const now = Date.now();
				if(now >= win._moveLastUpdate + (1000/pollingRate)){
					win._moveLastUpdate = now;
					const cursor = electron.screen.getCursorScreenPoint();

					// Set new position
					win.setBounds({
						x: win._moveStartBounds.x + (cursor.x - win._moveStartCursor.x),
						y: win._moveStartBounds.y + (cursor.y - win._moveStartCursor.y),
						width: win._moveStartBounds.width,
						height: win._moveStartBounds.height
					});
				}
			}, 1000/(pollingRate * 10));
		}
	});

	// Replace window resizing behavior to fix mouse polling rate bug
	win.on("will-resize", (e) => {
		if(win.blurType !== "acrylic")
			return;

		const now = Date.now();
		if(!win._resizeLastUpdate)
			win._resizeLastUpdate = 0;

		if(now >= win._resizeLastUpdate + (1000/pollingRate))
			win._resizeLastUpdate = now;
		else
			e.preventDefault();
	});
}
