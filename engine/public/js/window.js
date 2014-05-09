function checkCommand() {
	console.log("[functions] checkCommand: Attempting too call command");
	var id = getHashValue("id");
	var action = getHashValue("action");
	$.get("doAction.php?id="+id+"&action="+action, function(data) {
		var response = data;
		console.log("Server Returned Action Result: "+response);
	});
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