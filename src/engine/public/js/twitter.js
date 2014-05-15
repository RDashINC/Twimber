/**
 * Starts inital streams
 *
 * @return none
 **/
function initStream() {
	/**
	 * This is essentially the beginning function. (for twitter).
	**/
	document.getElementById("tweet-ctr").innerHTML="<img style=\"display: block;margin-left:auto;margin-right:auto;\" src=\"engine/public/img/ajax-loader.gif\"></img>";
	var Twit = require('twitter');
	var T = new Twit(window.config);
	
	if(typeof(global.user_stream_started)==='undefined') {
		try {
			var T = new Twit(window.config);
			global.user_stream = T.stream('user');
		} catch(err) {
			return true;
		}
	} else {
		global.user_stream.stop();
	}
	/** Check Creds **/
	T.get('account/verify_credentials', function(err, data, response) {
		if(err) {
			parseTwitterError(err);
		}
		console.log("[twitter] /initStream/ => [checkCreds]: Got a response from Twitter");
		console.log(data);
	});
	
	T.get('statuses/home_timeline', { count: "150" }, function (err, data, response) {
		if(err) {
			parseTwitterError(err);
		}
		var tweets = data;
		document.getElementById("tweet-ctr").innerHTML="";
		var num = 0;
		tweets.forEach(function(tweet) {
			var num = num + 1;
			if(num == 1) {
				var tcrb = createFormattedTweet(tweet, true, true);
				document.getElementsByClassName('tweet')[1].id="first_tweet";
			} else {
				var tcrb = createFormattedTweet(tweet, true);
			}
		});
		data = "";
		if(typeof(global.user_stream_started)==='undefined') {
			global.user_stream_started = true;
			console.log("[twitter] Initial stream started");
			reload(false);
		} else {
			console.log("[twitter] Old Stream Found, trying to kill");
			global.user_stream.stopStallAbortTimeout();
			global.user_stream.removeAllListeners();
			global.user_stream.request.res._dump();
			global.user_stream.request.socket.destroy();
			global.user_stream.request.abort();
			delete global.user_stream.request;
			reload(true);
		}
		setInterval(function(){
			console.log("[twitter] (): Updating tweet times <3");
			$('.timestamp').each(function(i, obj) {
				obj.innerHTML = relative_time(obj.title);
			});
		}, 5000);
	});
}

/**
 * Posts stand-alone status to twitter, with {string} text.
 *
 * @return {bool} Success/Failure.
 **/
function postStatus(status) {
	console.log("[twitter] postStatus: attempting to post status '"+status+"'");
	var Twit = require('twitter');
	var T = new Twit(window.config);
	T.post('statuses/update', { status: status }, function(err, data, response) {
		if(err) {
			parseTwitterError(err);
		}
		console.log("[twitter] postStatus: Response "+data);
	});
	
	postTwitterSuccess("Tweet: Posted Successfully!");
	
	return true;
}

/**
 * Logs current user out, and terminates Stream(s)
 *
 * @return none
 **/
function logout() {
	/** Anything Logout based goes here **/
	global.user_stream.stopStallAbortTimeout();
	global.user_stream.removeAllListeners();
	global.user_stream.request.res._dump();
	global.user_stream.request.socket.destroy();
	global.user_stream.request.abort();
	delete global.user_stream.request;
	window.location.replace("login.html#users");
}

/**
 * Replys to {int} id, with {string} status.
 *
 * @return {bool} Success/Failure
 **/
function doReply(id, status) {
	console.log("[twitter] doReply: attempting to post status '"+status+"', in reply to the ID '"+id+"'");
	var Twit = require('twitter');
	var T = new Twit(window.config);
	T.post('statuses/update', { status: status, in_reply_to_status_id: id }, function(err, data, response) {
		if(err) {
			parseTwitterError(err);
		}
		console.log("[twitter] doReply: Response "+err);
	});
	
	return true;
}

/**
 * Takes {int} lastid and attempts to get 50 more tweets from the past.
 *
 * @return none
 **/
function loadMoreTweets(lastid) {
	$( "#tweet-ctr" ).append("<img style=\"display: block;margin-left:auto;margin-right:auto;\" src=\"engine/public/img/tweet-load.gif\"></img>");
	console.log("[twitter] loadMoreTweets: Getting more tweets from before id '"+lastid+"'");
	var Twit = require('twitter');
	var T = new Twit(window.config);
	T.get('statuses/home_timeline', { count: "50", max_id: lastid  }, function (err, data, response) {
		if(err) {
			parseTwitterError(err);
		}
		var tweets = data;
		document.getElementById("tweet-ctr").innerHTML="";
		tweets.forEach(function(tweet) {
			var returns = createFormattedTweet(tweet, true);
		});
	});
}
/**
 * Requests pin for {string} user, from twitter.
 *
 * @return none
 **/
function requestPin(user) {
	console.log("[twitter] requestPin: Attempting to start an OAuth PIN Req.");
		var options = {
			consumerKey: window.config.consumer_key,
			consumerSecret: window.config.consumer_secret
		};
		var requestParams;
		var accessParams;
 
		var oauth = OAuth(options);
 
		oauth.get('https://twitter.com/oauth/request_token',
 
			function(data) {
				console.dir(data);
				window.open('https://twitter.com/oauth/authorize?'+data.text+"&screen_name="+user+"&force_login=true");
				requestParams = data.text;
				window.location.replace('login.html#'+requestParams);
			},
 
			function(data) { alert('darn'); console.dir(data); }
		);
	console.log("[twitter] requestPin: Done");
}

/**
 * Starts main user stream
 *
 * @return none
 **/
function reload(doReconnect) {
	console.log("[twitter] reload: Attempting to reload.");
	
	if(doReconnect === true) {
		console.log("Was told to restart the stream");
		console.log("[twitter] /stream/ => reload: Start stream again.");
		var T = new Twit(window.config);
		delete global.user_stream;
		global.user_stream = T.stream('user');
	}
	
	global.user_stream.on('tweet', function (tweet) {
		console.log("[twitter]: /stream/ => reload: Stream updating.");
		console.log(tweet);
		console.log("[twitter] /stream/ => reload: Updating old tweets time.");
		$('.timestamp').each(function(i, obj) {
			obj.innerHTML = relative_time(obj.title);
		});
		var returns = createFormattedTweet(tweet);
	});
	global.user_stream.on('disconnect', function(dc_msg) {
		parseTwitterError({ message: "You've been disconnected from the stream! :(" });
		global.user_stream.stop();
	});
	global.user_stream.on('close', function(dc_msg) {
		parseTwitterError({ message: "You've been disconnected from the stream! :(" });
		global.user_stream.stop();
	});
}

/**
 * Processes {text} twitter links, i.e @name #hashtag http://someurl/
 *
 * @return {string} Processed Text.
 **/
function processTweetLinks(text) {
    var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;.]*[-A-Z0-9+&@#\/%=~_|])/i;
    text = text.replace(exp, "<a href='$1' target='_blank'>$1</a>");
    exp = /(^|\s)#(\w+)/g;
    text = text.replace(exp, "$1<a href='http://search.twitter.com/search?q=%23$2' target='_blank' class='tweet hashtag' id='$2'>#$2</a>");
    exp = /(^|\s)@(\w+)/g;
    text = text.replace(exp, "$1<a href='#id=null&action=lookup&un=$2'>@$2</a>");
    return text;
}

/**
 * Get DMs for current user
 *
 * @return none
 **/
function getDms() {
	var Twit = require('twitter');
	var T = new Twit(window.config);
	T.get('direct_messages', { count: "200"}, function (err, data, response) {
		if(err) {
			parseTwitterError(err);
		}
		console.log(data);
	});
}

/**
 * A special function adapted for geting users images from avail configs in config_dir
 *
 * @return none
 **/
function getUsersImages(div, link) {
	var fs = require('fs');
	var path = require('path');
	eval(getConfigFile());
	var Twit = require('twitter');
	var T = new Twit(window.config);
	var files = fs.readdirSync(window.base_dir);
	global.final_text = "";
	files.forEach(function(file) {
		if(path.extname(file) === ".js") {
			var user = file.split('.')[1];
			T.get('users/show', { screen_name: user } , function(err, data, response) {
				if(err) {
					parseTwitterError(err);
				}
				var config = decryptConfig(data.screen_name, window.base_dir);
				var profile_image = data.profile_image_url;
				global.final_text = "<img class='login_image' onclick='doLoginNoInput(\""+user+"\")' src='"+profile_image+"' alt='"+user+"'>";
				$(div).prepend(global.final_text);
			});
		}
	});
}

/**
 * Decrypts a {string} user's config file in {string} dir.
 *
 * @return {json} config, or throws error.
 **/
function decryptConfig(user, dir) {
	var config = loadUser(user, dir);
	config = CryptoJS.AES.decrypt(config, global.pwd);
	config = config.toString(CryptoJS.enc.Utf8);
	if(config) {
		return JSON.parse(config);
	} else {
		throw "Failed Too Decrypt User '"+user+"' config, Wrong Password?";
	}
}

/**
 * Looks up {string} user and returns object.
 *
 * @return {obj} twitter user's api callback.
 **/
function getTwitterUserInfo(user) {
	var Twit = require('twitter');
	eval(getConfigFile());
	var T = new Twit(window.config);
	T.get('users/show', { screen_name: user } , function(err, data, response) {
		if(err) {
			parseTwitterError(err);
		}
		console.log("[twitter] /twitter/ => [user/show]: Looked up user: "+user);
		console.log(data);
		return data;
	});
}

/**
 * Get's main user's config file.
 *
 * @return {array}
 **/
function getMainUser() {
	var fs = require('fs');
	var data = fs.readFileSync(dir+"/main.json", { encoding: 'utf8' }, function(err, data) { 
		if (err) throw err; 
	});
	return JSON.parse(data);
}

/**
 * Check if {string} user exists in config_dir
 *
 * @return {bool} Success/Failure
 **/
function userExists(user) {
	var fs = require('fs');
	var file_exists = fs.existsSync(base_dir+"/config."+user+".js");
	return file_exists;
}

/**
 * Return raw {string} user config in {string} dir.
 *
 * @return {string} config
 **/
function loadUser(user, dir) {
	var fs = require('fs');
	var data = fs.readFileSync(dir+"/config."+user+".js", { encoding: 'utf8' }, function(err, data) { 
		if (err) throw err; 
	});
	return data;
}

/**
 * Set {string} user, as the main user in main.json
 *
 * @return none
 **/
function setMain(user) {
	writeToConfig('{ "main":"'+user+'"}', "main.json");
	console.log("[twitter] Set '"+user+"' as main user");
}

/**
 * Processes {obj} obj, and filters out wanted/unwanted tweets
 *
 * @return {bool} Use/Ignore
 **/
function runThroughFilter(obj) {
	var at_names = [ "Pinachuu69" ]
	var hashs = ["#yolo", "#wcw"]
	if(typeof(obj)==='undefined') {
		return true;
	}
	var text = obj.text;
	var tagslistarr = text.split(' ');
	var hashtags=[];
	$.each(tagslistarr,function(i,val){
	    if(tagslistarr[i].indexOf('#') == 0){
	      hashtags.push(tagslistarr[i]);  
	    }
	});
	hashtags.forEach(function(entry) {
		var ig = $.inArray(entry, hashs);
		console.log(entry+" = "+hashs)
		if(ig >= 0 ) { var ignore = true; }
	});
	if(ignore === true ) { return true; }
	var ignore = $.inArray(obj.user.screen_name, at_names);
	if(ignore >= 0 ) { return true; }

	return false;
}

/** 
 * This can literally handle anything tweet related.
 * Every single tweet is passed through here.
 *
 * @return {boolean} Success/Failure
 **/
function createFormattedTweet(tweet, ap, first) {
	if(runThroughFilter(tweet) === true) {
		console.log("[twitter] createFormattedTweet: Was told to filter tweet.")
		return false;
	}
	var text = tweet.text;
	var screenname = tweet.user.screen_name;
	var name = tweet.user.name;
	var source = tweet.source;
	var id = tweet.id_str; 
	var profile_image_url = tweet.user.profile_image_url;
	var protect = tweet.user.protected;
	var created= tweet.created_at;
	var created_orig = created;
	var retweeted = tweet.retweeted;
	var favorited = tweet.favorited;
	if(typeof(tweet.retweeted_status)==='undefined') {
		var retweeted_stat=false;
	} else {
		console.log("[twitter] createFormattedTweet: Got a Retweet, formatting values.");
		var retweeted_stat=true;
		screenname = tweet.retweeted_status.user.screen_name;
		name = tweet.retweeted_status.user.name;
		source = tweet.retweeted_status.source;
		profile_image_url = tweet.retweeted_status.user.profile_image_url;
		created = tweet.retweeted_status.created_at;
		created_orig = created;
		retweeted = tweet.retweeted;
	}
	created = relative_time(created);
	if(source == "web") { source="<a href='http://twitter.com/' target='_blank'>Web</a>" }
	
	var final_text = "<div class='media item'>";
	var final_text = final_text+"	<a class='pull-left' href='#'>";
	var final_text = final_text+"		<img class='media-object' src='"+profile_image_url+"'>";
	var final_text = final_text+"	</a>";
	var final_text = final_text+"	<div class='media-body'>";
	var final_text = final_text+"		<p class='media-heading' style='font-size:16px;margin-bottom:10px;'><span style='color:#FFF !important;'>"+name+"</span> (@"+screenname+")";
	var final_text = final_text+"		– <span title='"+created_orig+" - "+id+"' class='timestamp'>"+created+"</span></p>";
	var final_text = final_text+processTweetLinks("		<p id='tweet-text' class='contents'> "+text+" </p>");
	var final_text = final_text+"<div class='pull-right'>";
	if(favorited === true) {
		var final_text = final_text+"		<a id='"+id+"-fav' class='favourited' href='#'><i class='fa fa-heart' style='color:red;'></i></a>&nbsp;<span id='"+id+"-fc'>"+tweet.favorite_count+"</span>&nbsp;";
	} else {
		var final_text = final_text+"		<a id='"+id+"-fav' class='favourite' href='#id="+id+"&action=fav'><i class='fa fa-heart-o'></i></a>&nbsp;<span id='"+id+"-fc'>"+tweet.favorite_count+"</span>&nbsp;";
	}
	if(retweeted === true) {
		var final_text = final_text+"		<a id='"+id+"-rt' class='retweeted' href='#'><i class='fa fa-retweet' style='color:green'></i></a>&nbsp;<span id='"+id+"-rc'>"+tweet.retweet_count+"</span>&nbsp;";
	} else {
		var final_text = final_text+"		<a id='"+id+"-rt' class='retweet' href='#id="+id+"&action=rt'><i class='fa fa-retweet'></i></a>&nbsp;<span id='"+id+"-rc'>"+tweet.retweet_count+"</span>&nbsp;";
	}
	var final_text = final_text+"		<a id='"+id+"-reply' class='reply' href='#id="+id+"&action=reply&un="+screenname+"'><i class='fa fa-reply'></i></a>&nbsp;–&nbsp;";
	var final_text = final_text+"		<a class='src'>"+source+"</a>";
	if(retweeted_stat === true) {
		console.log(tweet);
		var final_text = final_text+"		<span> / Retweeted by: "+processTweetLinks('@'+tweet.user.screen_name)+"</span>";
	}
	var final_text = final_text+"	</div>";
	var final_text = final_text+"	</div>";
	var final_text = final_text+"</div>";
	if(typeof(ap)!=='undefined') {
		if(ap === true) {
			$( "#tweet-ctr" ).append(final_text);
		}
	} else {
		if(first === true) {
			console.log("[twitter] createFormattedTweet: Got a first tweet");
			$('#tweet-ctr').prepend(final_text);
		} else {
			$('#tweet-ctr').prepend(final_text);
		}
	}
	$("#tweet-text").linkify();
	
	var elements = document.getElementsByClassName('tweet hashtag');
	for (var i = 0; i < elements.length; i++) { 
		if(elements[i].title === "") {
			var hashtag = elements[i].innerHTML.replace( /#/, "" );
			console.log("[twitter] createFormattedTweet: Replacing Hashtag '"+hashtag+"' with def.");
			elements[i].title=getHashTagDef(hashtag);
		}
	}
	
	return true;
}

/**
 * Get relative time to a tweets post.
 *
 * @return {string} time
 **/
function relative_time(time) {
	var tdate = time;
    var system_date = new Date(Date.parse(tdate));
    var user_date = new Date();
    if (K.ie) {
        system_date = Date.parse(tdate.replace(/( \+)/, ' UTC$1'));
    }
    var diff = Math.floor((user_date - system_date) / 1000);
    if (diff <= 1) {return "just now";}
    if (diff < 20) {return diff + " seconds ago";}
    if (diff < 40) {return "half a minute ago";}
    if (diff < 60) {return "less than a minute ago";}
    if (diff <= 90) {return "one minute ago";}
    if (diff <= 3540) {return Math.round(diff / 60) + " minutes ago";}
    if (diff <= 5400) {return "1 hour ago";}
    if (diff <= 86400) {return Math.round(diff / 3600) + " hours ago";}
    if (diff <= 129600) {return "1 day ago";}
    if (diff < 604800) {return Math.round(diff / 86400) + " days ago";}
    if (diff <= 777600) {return "1 week ago";}
    return "on " + system_date;
}

// from http://widgets.twimg.com/j/1/widget.js
var K = function () {
    var a = navigator.userAgent;
    return {
        ie: a.match(/MSIE\s([^;]*)/)
    };
}();

/**
 * "Nicely" displays twitter errors.
 *
 * @return none
 **/
function parseTwitterError(err) {
	$("#twitter_errors").prepend("<div id='error' class='alert alert-danger'>Twitter Reported an Error: "+err.message+"</div>");
}

/**
 * "Nicely" displays twitter success, or anything really.
 *
 * @return none
 **/
function postTwitterSuccess(message) {
	$("#twitter_success").prepend("<div id='success' class='alert alert-success'>"+message+"</div>");
}

/**
 * Attempts to favorite a tweet with {int} id.
 *
 * @return none
 **/
function fav(id) {
	console.log("[twitter] fav: Attempting to fav tweet with id of '"+id+"'");
	var Twit = require('twitter');
	var T = new Twit(window.config);
	T.post('favorites/create', { id: id }, function (err, data, response) {
		if(err) {
			parseTwitterError(err);
		} else {
			postTwitterSuccess("Tweet: Favorited Successfully!");
		}
		console.log(data);
	});
	document.getElementById(id+"-fav").value="";
	document.getElementById(id+"-fc").innerHTML=Math.floor(parseInt(document.getElementById(id+"-fc").innerHTML)+1);
	document.getElementById(id+"-fav").innerHTML="<span class='tweet favourited'><i class='fa fa-heart' style='color:red;'></i></span>";
}

/**
 * Attempts to retweet a tweet with {int} id.
 *
 * @return none
 **/
function rt(id) {
	console.log("[twitter] rt: Attempting to RT tweet with id of '"+id+"'");
	var Twit = require('twitter');
	var T = new Twit(window.config);
	T.post('statuses/retweet/:id', { id: id }, function (err, data, response) {
		if(err) {
			parseTwitterError(err);
		} else {
			postTwitterSuccess("Tweet: Retweeted Successfully!");
		}
		console.log(data);
	});
	document.getElementById(id+"-rt").value="";
	document.getElementById(id+"-rc").innerHTML=Math.floor(parseInt(document.getElementById(id+"-rc").innerHTML)+1);
	document.getElementById(id+"-rt").innerHTML="<span class='tweet retweeted'><i class='fa fa-retweet' style='color:green;'></i></span>";
}

/**
 * Attempts to delete a tweet with {int} id.
 *
 * @return none
 **/
function del(id) {
	console.log("[twitter] del: Attempting to del your tweet with an id of '"+id+"'");
	var Twit = require('twitter');
	var T = new Twit(window.config);
	T.post('statuses/delete/:id', { id: id }, function (err, data, response) {
		if(err) {
			parseTwitterError(err);
		} else {
			postTwitterSuccess("Tweet: Deleted Successfully!");
		}
		console.log(data);
	});
}

var twit_ver="1.1-dev";
console.log("[twitter] Loaded Version: "+twit_ver);