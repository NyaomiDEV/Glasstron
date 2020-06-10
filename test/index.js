const glasstron = require('..');
glasstron.init();

const electron = require('electron');
let win;

electron.app.on('ready', () => {
	win = new electron.BrowserWindow({
		width: 800,
		height: 600,
  });

  win.webContents.loadURL('about:blank');
  
  win.webContents.insertCSS('html { background-color: transparent; }');

	glasstron.update(win, {
		windows: {blurType: 'acrylic'},
		macos: {vibrancy: 'fullscreen-ui'},
		linux: {requestBlur: true}
	});
});
