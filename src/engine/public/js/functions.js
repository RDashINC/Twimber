function getHashTagDef(hashtag) {
	console.log("[functions] getHashTagDef: "+hashtag);
	var resp = ajax('http://api.tagdef.com/one.'+hashtag+'.json?lang=en', 'GET');
	console.log('[functions] getHashTagDef: Got---: '+resp);
	var resp_parse = JSON.parse(resp);
	var text = resp_parse.defs.def.text;
	if(typeof(text)==="undefined") {
		var text = "Definition not available.";
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
	console.log('[functions] modifyDiv: Changing '+id+'\'s title');
	document.getElementById(id).title=content;
	return true;
}

var func_ver = "1.1";
console.log("[functions] Functions V"+func_ver+" Loaded");