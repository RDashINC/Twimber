function getHashTagDef(hashtag) {
	var resp = ajax('http://api.tagdef.com/one.'+hashtag+'.json?lang=en', 'GET');
	console.log('[functions] getHashTagDef: Got---: '+resp);
	var resp_parse = JSON.parse(resp);
	return resp_parse.defs.def.text;
}

function createHashTag(hashtag) {
	console.log("[functions] createHashTag: Hashtag = "+hashtag);
	console.log("[functions] createHashTag: Attempting too create a '"+hashtag+"'");
	var text = getHashTagDef(hashtag);
	if(typeof(text)==="undefined") {
		var text = "Definition not available.";
	}
	$("#container").append(' <a href="https://twitter.com/search?q=%23'+hashtag+'" title="'+text+'">#'+hashtag+'</a> ');
	console.log("[functions] createHashTag: Finished.");
}

function chtw() {
	var ht = document.getElementById('ht').value;
	createHashTag(ht);
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

function reload()
{
	console.log("[functions] reload: Attempting too reload.");
	document.getElementById("tweet-ctr").innerHTML="<img style=\"display: block;margin-left:auto;margin-right:auto;\" src=\"engine/public/img/ajax-loader.gif\"></img>";
	$.get("index.php", function(data) {
		document.getElementById("tweet-ctr").innerHTML=data;
	});
}

var func_ver = "1.1";
console.log("[functions] Functions V"+func_ver+" Loaded");