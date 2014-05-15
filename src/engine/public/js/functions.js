function getHashTagDef(hashtag) {
	if(global.hashtag_db_loaded === false) {
		var hashtag_db = loadSavedFile('hashtags.json');
		if(hashtag_db !== false) {
			console.log('[functions] Loaded Hashtag definition database.');
			global.hashtag = new Object();
			global.hashtag = JSON.parse(hashtag_db);
			global.hashtag_db_loaded= true;
		}
	}
	if(typeof(global.hashtag)==='undefined') {
		console.log('[functions] Starting new hashtag object.')
		global.hashtag = new Object;
	}
	console.log("[functions] getHashTagDef: "+hashtag);
	var a = hashtag;
	if(typeof(global.hashtag[a])==='undefined') {
		var resp = ajax('http://api.tagdef.com/one.'+hashtag+'.json?lang=en', 'GET');
		console.log('[functions] getHashTagDef: Got---: '+resp);
		var resp_parse = JSON.parse(resp);
		var text = resp_parse.defs.def.text;
		if(typeof(text)==="undefined") {
			var text = "Definition not available.";
		}	
		global.hashtag[a] = text;
		var toWrite = JSON.stringify(global.hashtag);
		writeToConfig(toWrite, "hashtags.json");
	} else {
		console.log("[functions] getHashTagDef: Using cached hashtag def.");
		var text = global.hashtag[a];
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

function writeToConfig(array, file) {
	console.log("Writing: '"+array+"' to configuration.");
	var fs = require('fs');
	var path = require('path');
	var appdata = path.resolve(process.cwd(), window.config_dir);
	var base_dir = window.base_dir;
	
	var exists = fs.existsSync(appdata+"/RDashINC");
	if (exists === false) { fs.mkdir(path.resolve(process.cwd(), window.config_dir+"/RDashINC")); }
	var exists = fs.existsSync(base_dir);
	if (exists === false) {fs.mkdir(path.resolve(process.cwd(), window.config_dir+"/RDashINC/Twimber"));}
	
	// Write Too Config
	var error = fs.writeFileSync(base_dir+"/"+file, array, { encoding: "utf8" });
	if(error) throw error;
	console.log("The configuration has been successfully written.");
}

/**
 * Loads a file in the config_dir
 *
 * @return {string} file contents
 **/
function loadSavedFile(file) {
	var fs = require('fs');
	var exists = fs.existsSync(window.base_dir+"/"+file);
	if (exists === false) { return false };
	var file_contents = fs.readFileSync(window.base_dir+"/"+file, { encoding: 'utf8' });
	
	return file_contents;
}

function getConfigFile() {
	var fs = require('fs');
	var config_file = fs.readFileSync("engine/public/js/config.js", { encoding: 'utf8' }, function(err, data) { 
		if (err) throw err; 
	});
	
	return config_file;
}

function doLoadThing(id) {
	modifyDiv(id, "<img src='engine/public/img/load.gif'>");
}

function attemptToInclude(file) {
	var fs = require('fs');
	var config_file = fs.readFileSync("engine/public/js/"+file, { encoding: 'utf8' }, function(err, data) { 
		if (err) throw err; 
	});
	return file;
}
	

var func_ver = "1.2.1";
console.log("[functions] Functions V"+func_ver+" Loaded");