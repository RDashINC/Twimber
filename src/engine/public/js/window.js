function checkCommand() {
	console.log("[functions] checkCommand: Attempting too call command");
	var id = getHashValue("id");
	var action = getHashValue("action");
	
	if(action == "fav") {
		fav(id);
	} else if (action == "rt") {
		rt(id);
	}
}


function getHashValue(key) {
  return location.hash.match(new RegExp(key+'=([^&]*)'))[1];
}

function locationHashChanged(url) {
	if(location.hash == "") {
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