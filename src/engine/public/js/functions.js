function getHashTagDef(hashtag) {
	if(typeof(window.hashtag)==='undefined') {
		window.hashtag = new Object;
	}
	console.log("[functions] getHashTagDef: "+hashtag);
	var a = hashtag;
	if(typeof(window.hashtag[a])==='undefined') {
		var resp = ajax('http://api.tagdef.com/one.'+hashtag+'.json?lang=en', 'GET');
		console.log('[functions] getHashTagDef: Got---: '+resp);
		var resp_parse = JSON.parse(resp);
		var text = resp_parse.defs.def.text;
		if(typeof(text)==="undefined") {
			var text = "Definition not available.";
		}
		window.hashtag[a] = text;
	} else {
		console.log("[twitter] getHashTagDef: Using cached hashtag def.");
		var text = window.hashtag[a];
	}
	return text;
}

function modifyDiv(id, content) {
	console.log('[functions] modifyDiv: Changing '+id);
	document.getElementById(id).innerHTML=content;
	document.getElementById(id).value=content;
	return true;
}
function modifyTitle(id, content) {
	console.log('[functions] modifyTitle: Changing '+id+'\'s title');
	document.getElementById(id).title=content;
	return true;
}

function writeTooConfig(array, file) {
	console.log("[functions] writeTooConfig: Writing: '"+array+"' too config.");
	var array = 'window.saved_config='+array;
	var fs = require('fs');
	var path = require('path');
	var appdata = path.resolve(process.cwd(), window.config_dir);
	var base_dir = appdata+"/RDashINC/vTweet";
	
	var exists = fs.existsSync(appdata+"/RDashINC");
	if (exists === false) { fs.mkdir(path.resolve(process.cwd(), window.config_dir+"/RDashINC")); }
	var exists = fs.existsSync(base_dir);
	if (exists === false) {fs.mkdir(path.resolve(process.cwd(), window.config_dir+"/RDashINC/vTweet"));}
	
	// Write Too Config
	var error = fs.writeFileSync(base_dir+"/"+file, array);
	if(error) throw error;
	console.log("[functions] writeTooConfig: Done.");
}

function doLoadThing(id) {
	modifyDiv(id, "<img src='engine/public/img/load.gif'>");
}
	

var func_ver = "1.2.1";
console.log("[functions] Functions V"+func_ver+" Loaded");