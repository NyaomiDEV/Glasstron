# Glasstron

A simple and reliable API to achieve blur and transparency across platforms (Windows/Linux/MacOS), so you don't have to panic with Electron bugs and messy code! Plus, it's really simple!

[![npm](https://img.shields.io/npm/dt/glasstron?logo=npm&style=for-the-badge)](https://www.npmjs.com/package/glasstron)
[![version](https://img.shields.io/npm/v/glasstron?label=version&style=for-the-badge)](https://www.npmjs.com/package/glasstron)
[![indev version](https://img.shields.io/github/package-json/v/arytonex/glasstron?label=indev%20version&style=for-the-badge)](https://github.com/AryToNeX/Glasstron/tree/master)
[![ko-fi](https://img.shields.io/badge/donate-on%20ko--fi-29ABE0?logo=ko-fi&style=for-the-badge&logoColor=FFFFFF)](https://ko-fi.com/K3K3D0E0)
[![patreon](https://img.shields.io/badge/pledge-on%20patreon-FF424D?logo=patreon&style=for-the-badge&logoColor=FFFFFF)](https://patreon.com/arytonex)
[![paypal](https://img.shields.io/badge/donate-on%20paypal-0079CD?logo=paypal&style=for-the-badge)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=Y7ZAFZ2H56FD4)
[![discord](https://img.shields.io/discord/696696149301657640?color=7289DA&label=chat&logo=discord&logoColor=ffffff&style=for-the-badge)](https://discord.gg/vtswnGC4tH)

## Quickstart
```bash
$ npm install glasstron
- OR -
$ yarn add glasstron
```
```js
const glasstron = require('glasstron');
const electron = require('electron');
electron.app.commandLine.appendSwitch("enable-transparent-visuals");
electron.app.on('ready', () => {
	setTimeout(
		spawnWindow,
		process.platform == "linux" ? 1000 : 0
		// Electron has a bug on linux where it
		// won't initialize properly when using
		// transparency. To work around that, it
		// is necessary to delay the window
		// spawn function.
	);
});

function spawnWindow(){
	win = new glasstron.BrowserWindow({
		width: 800,
		height: 600,
		// ...
	});
	win.blurType = "acrylic";
	//              ^~~~~~~
	// Windows 10 1803+; for older versions you
	// might want to use 'blurbehind'
	win.setBlur(true);
	// ...
	return win;
}

// ...
```

**NOTICE for projects using Webpack and similar:** Glasstron uses `__dirname` internally, so you have to define it as an external module, or else it won't work on Windows.

## Why Glasstron?

### The problem
Let's face it: achieving composition effects on Electron is painful. For reference, here's quick summary of the amount of problems that arise when trying to blur the background of a window while keeping cross-compatibility.
- On Windows: There are plenty of Node bindings, but this means having to recompile them everytime a new Electron version comes out (and there's a chance you relied on unmaintained bindings, so you'll have to switch to a new project). Plus, you lose Aero Snap features if you aren't careful enough.
- On macOS: Achieving transparency and vibrancy on a window means that the `backgroundColor` window option must be set to transparent. Then, you must not call `win.setBackgroundColor()` or else it all breaks. (Tested on Electron 7.1.11 -- I hope this changed with more recent versions of it)
- On Linux: there's literally nothing to request blurriness. No bindings at all. Nothing.

### The solution
Glasstron takes care of those problems and it also aims to support composition effects on Linux. Its ease of use is a distinct feature, so it can be adopted in both new and running projects. It supports Electron 7.1+ without any problem (that's a bold claim, if I am wrong please open an issue).

## Design and features
Glasstron provides a custom version of Electron's `BrowserWindow` export that's capable to deal with the common problems discussed earlier on its own. This means that it's simple to adopt and it doesn't break existing code as every call to broken methods is wrapped so nothing bad happens.

It also replaces the functionality of `win.setBackgroundColor()`: since there's no way to set a background color without breaking vibrancy materials on macOS, it will set the background color as injected CSS on the `:root` CSS selector. It can be overridden by CSS stylesheets, so be careful! (this was intended -- check the other project [Glasscord](https://github.com/AryToNeX/Glasscord) to know why).

Note that Glasstron cannot do all the hard work (as with it prototype pollution will occur).
Please look inside `src/hacks.js` to see common problems Glasstron used to solve automagically up until version 0.0.3.

## I want to contribute to this madness!
Did you find a bug? File it in the issues section!
Do you know how to fix stuff? Make a pull request!
Or perhaps you want to send me a hug and a coffee? You can do so [here](https://ko-fi.com/arytonex)!

## Awesome applications using Glasstron
- [Android Messages](https://github.com/katacarbix/android-messages) by katacarbix
- [Terminus](https://github.com/Eugeny/terminus) by Eugeny
- [Soundglass](https://github.com/pixldev/soundglass) by pixldev
- [Lightcord](https://github.com/Lightcord/Lightcord) by Lightcord
- Want yours featured? Issue a PR!

## Projects related to Glasstron
- [Glasscord](https://github.com/AryToNeX/Glasscord) uses Glasstron to inject composition in any* Electron app.
- [blur-provider](https://github.com/CorvetteCole/blur-provider) is used by Glasstron to request blurring of windows to the GNOME Shell.

## License
### Glasstron is licensed under the Apache 2.0 License
```
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
```
