function checkCommand() {
	var scr = document.body.scrollTop;
	console.log("[functions] checkCommand: Attempting too call command");
	var id = getHashValue("id");
	var action = getHashValue("action");
	
	if(action == "fav") {
		fav(id);
	} else if (action == "rt") {
		rt(id);
	} else if(action == "reply") {
		var user_name = getHashValue("un"); // of tweet
		window.reply = true;
		document.getElementById("tweet-send").value="@"+user_name+" ";
		window.tweetid = id;
		console.log("[window] checkCommand: window.reply set too true");
		$( "#tweet-send" ).focus();
	} else if(action == "clear") {
		window.reply = false;
		document.getElementById("tweet-send").value="";
		console.log("[window] checkCommand: window.reply set too false, tweet-send cleared, hash reset.");
		location.hash="#";
	}
	location.hash="";
	document.body.scrollTop = scr;
}


function getHashValue(key) {
  return location.hash.match(new RegExp(key+'=([^&]*)'))[1];
}

function locationHashChanged(url) {
	if(location.hash === "") {
		console.log("Hash: null, ignoring.");
		return false;
	} else {
		checkCommand();
		return true;
	}
}

window.onhashchange = function () {
	locationHashChanged(location.hash);
};

function tryToPost(id) {
	var tag_name = $(document.activeElement).prop("tagName");
	console.log("[window] tryToPost: ctrl+return event fired on a '"+tag_name+"'");
	if(tag_name == "INPUT") {
		var func_to_exec = $("#"+id).attr("onclick");
		console.log("[window] tryToPost: Trying too execute function '"+func_to_exec+"'");
		eval(func_to_exec);
		console.log("[window]: tryToPost: Attempt Made");
	}
}

var window_ver = "1.4.2";
console.log("[window]: Loaded Version "+window_ver);