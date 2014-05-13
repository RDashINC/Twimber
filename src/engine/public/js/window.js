jQuery.fn.putCursorAtEnd = function() {

  return this.each(function() {

    $(this).focus()

    // If this function exists...
    if (this.setSelectionRange) {
      // ... then use it (Doesn't work in IE)

      // Double the length because Opera is inconsistent about whether a carriage return is one character or two. Sigh.
      var len = $(this).val().length * 2;

      this.setSelectionRange(len, len);
    
    } else {
    // ... otherwise replace the contents with itself
    // (Doesn't work in Google Chrome)

      $(this).val($(this).val());
      
    }

    // Scroll to the bottom, in case we're in a tall textarea
    // (Necessary for Firefox and Google Chrome)
    this.scrollTop = 999999;

  });

};

function checkCommand() {
	var scr = document.body.scrollTop;
	console.log("[functions] checkCommand: Attempting to call command");
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
		console.log("[window] checkCommand: window.reply set to true");
		$( "#tweet-send" ).putCursorAtEnd();
	} else if(action == "clear") {
		window.reply = false;
		
		// Reset Counter
		resetCharLimit();
		
		console.log("[window] checkCommand: window.reply set to false, tweet-send cleared, hash reset.");
		location.hash="#";
	}
	location.hash="";
	document.body.scrollTop = scr;
}

function resetCharLimit() {
	var txt =  $('textarea[id$=tweet-send]');
	$('#char-left').text(140);
	$('#tweet-send').val("");
	$('#tweet-send').focus();
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
	if(tag_name == "TEXTAREA") {
		var func_to_exec = $("#"+id).attr("onclick");
		console.log("[window] tryToPost: Trying to execute function '"+func_to_exec+"'");
		eval(func_to_exec);
		console.log("[window]: tryToPost: Attempt Made");
	}
}

var window_ver = "1.4.2";
console.log("[window]: Loaded Version "+window_ver);