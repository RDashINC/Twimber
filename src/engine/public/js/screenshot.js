function captureVisibleScreen() {
	var gui = require('nw.gui');
	var win = gui.Window.get();
	var fs = require('fs');
	var path = require('path');
	var appdata = path.resolve(process.cwd(), window.config_dir);
	var base_dir = appdata+window.picture_dir;
	
	/** Check DIRS **/
	var exists = fs.existsSync(appdata+"/RDashINC");
	if (exists === false) { fs.mkdir(path.resolve(process.cwd(), window.config_dir+"/RDashINC")); }
	var exists = fs.existsSync(appdata+"/RDashINC/Twimber");
	if (exists === false) {fs.mkdir(path.resolve(process.cwd(), window.config_dir+"/RDashINC/Twimber"));}
	var exists = fs.existsSync(base_dir);
	if (exists === false) {fs.mkdir(path.resolve(process.cwd(), window.config_dir+"/"+window.picture_dir));}
	
	console.log("[window] captureVisibleScreen: Taking screenshot of '"+window.location+"'");
	var date = Date.now();
    win.capturePage(function(img) {
		var base64Data = img.replace(/^data:image\/(png|jpg|jpeg);base64,/, "");
		require("fs").writeFile(base_dir+"/Twimber-"+date+".png", base64Data, 'base64', function(err) {
			console.log(err);
		});
	}, 'png');
	console.log("[window] captureVisibleScreen: Screenshot saved at---:'"+base_dir+"/Twimber-"+date+".png"+"'");
}

/** Keyboard Shortcuts **/
$(document).bind('keydown', 'ctrl+m', captureVisibleScreen);