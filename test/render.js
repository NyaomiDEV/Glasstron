const electron = require("electron");

const wb = new (require('windowbar'))(
	{
		style: 'mac',
		title: "Glasstron",
		transparent: true
	})
	.on('close', () => electron.ipcRenderer.send("close"))
	.on('minimize', () => electron.ipcRenderer.send("minimize"))
	.appendTo(document.getElementById("windowbar"));

let toggled = null;
electron.ipcRenderer.send("blurQuery");

electron.ipcRenderer.on("blurStatus", (e, res) => {
	toggled = res;
	document.getElementById("toggle").innerHTML = "Toggle " + (toggled ? "off" : "on");
});

document.getElementById("toggle").onclick = function(){
	electron.ipcRenderer.send("blurToggle", !toggled);
};

if(process.platform === "win32"){
	document.getElementById("win32-select").onchange = function(){
		electron.ipcRenderer.send("blurTypeChange", document.getElementById("win32-select").value);
	}

	electron.ipcRenderer.on("supportsAcrylic", () => {
		const acrylic = document.createElement("option");
		acrylic.value = "acrylic";
		acrylic.innerHTML = "acrylic";
		document.getElementById("win32-select").appendChild(acrylic);
	});

	electron.ipcRenderer.on("blurTypeChanged", (e, res) => {
		document.getElementById("win32-p").innerHTML = "Current blur type: " + res.toString();
	});

	document.getElementById("win32").classList.remove("hidden");
}
