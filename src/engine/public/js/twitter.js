function getUserStream() {
	console.log("[twitter] getUserStream: is deprecated.");
}

function initStream() {
	/**
	 * This is essentially the beginning function. (for twitter).
	**/
	document.getElementById("tweet-ctr").innerHTML="<img style=\"display: block;margin-left:auto;margin-right:auto;\" src=\"engine/public/img/ajax-loader.gif\"></img>";
	var Twit = require('twitter');
	var T = new Twit(window.config);
	
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
				createFormattedTweet(tweet, true, true);
				document.getElementsByClassName('tweet')[1].id="first_tweet";
			} else {
				createFormattedTweet(tweet, true);
			}
		});
		data = "";
		if(typeof(global.user_stream)==='undefined') {
			console.log("[twitter] Initial stream started");
		} else {
			console.log("[twitter] Old Stream Found, trying to kill");
			global.user_stream.stop();
		}
		reload();
		setInterval(function(){
			console.log("[twitter] (): Updating tweet times <3");
			$('.timestamp').each(function(i, obj) {
				obj.innerHTML = relative_time(obj.title);
			});
		}, 5000);
	});
}

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

function logout() {
	/** Anything Logout based goes here **/
	var Twit = require('twitter');
	var T = new Twit(window.config);
	global.user_stream.stop();
	window.location.replace("login.html#users");
}

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
			createFormattedTweet(tweet, true);
		});
	});
}

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


function reload() {
	console.log("[twitter] reload: Attempting to reload.");
	var Twit = require('twitter');
	var T = new Twit(window.config);

	global.user_stream = T.stream('user');	
	global.user_stream.on('tweet', function (tweet) {
		console.log("[twitter]: /stream/ => reload: Stream updating.");
		console.log(tweet);
		console.log("[twitter] /stream/ => reload: Updating old tweets time.");
		$('.timestamp').each(function(i, obj) {
			obj.innerHTML = relative_time(obj.title);
		});
		createFormattedTweet(tweet);
	});
}

function processTweetLinks(text) {
    var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;.]*[-A-Z0-9+&@#\/%=~_|])/i;
    text = text.replace(exp, "<a href='$1' target='_blank'>$1</a>");
    exp = /(^|\s)#(\w+)/g;
    text = text.replace(exp, "$1<a href='http://search.twitter.com/search?q=%23$2' target='_blank' class='tweet hashtag' id='$2'>#$2</a>");
    exp = /(^|\s)@(\w+)/g;
    text = text.replace(exp, "$1<a href='#id=null&action=lookup&un=$2'>@$2</a>");
    return text;
}

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

function getMainUser() {
	var fs = require('fs');
	var data = fs.readFileSync(dir+"/main.json", { encoding: 'utf8' }, function(err, data) { 
		if (err) throw err; 
	});
	return JSON.parse(data);
}

function userExists(user) {
	var fs = require('fs');
	var file_exists = fs.existsSync(base_dir+"/config."+user+".js");
	return file_exists;
}

function loadUser(user, dir) {
	var fs = require('fs');
	var data = fs.readFileSync(dir+"/config."+user+".js", { encoding: 'utf8' }, function(err, data) { 
		if (err) throw err; 
	});
	return data;
}

function setMain(user) {
	writeToConfig('{ "main":"'+user+'"}', "main.json");
	console.log("[twitter] Set '"+user+"' as main user");
}

function createFormattedTweet(tweet, ap, first) {
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
	console.log(favorited);
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
	
	var final_text = "<div class='tweet item'>";
	var final_text = final_text+"	<img style='float:left;padding:0 1ex 1ex 0; margin-bottom:5px;' src='"+profile_image_url+"'>";
	var final_text = final_text+"	<a class='from_user' href='http://twitter.com/"+screenname+"'>["+name+"] @"+screenname+"</a>";
	var final_text = final_text+processTweetLinks("	<p id='tweet-text' class='contents'> "+text+" </p>");
	var final_text = final_text+"	<span title='"+created_orig+"' class='timestamp'>"+created+"</span> - ";
	if(favorited === true) {
		var final_text = final_text+"	<a id='"+id+"-fav' class='favourited' href='#'><i class='fa fa-heart' style='color:red;'></i></a>&nbsp;";
	} else {
		var final_text = final_text+"	<a id='"+id+"-fav' class='favourite' href='#id="+id+"&action=fav'><i class='fa fa-heart-o'></i></a>&nbsp;";
	}
	if(retweeted === true) {
		var final_text = final_text+"	<a id='"+id+"-rt' class='retweeted' href='#'><i class='fa fa-retweet'></i>'d</a>&nbsp;";
	} else {
		var final_text = final_text+"	<a id='"+id+"-rt' class='retweet' href='#id="+id+"&action=rt'><i class='fa fa-retweet'></i></a>&nbsp;";
	}
	var final_text = final_text+"	<a id='"+id+"-reply' class='reply' href='#id="+id+"&action=reply&un="+screenname+"'><i class='fa fa-reply'></i></a>&nbsp;–&nbsp;";
	var final_text = final_text+"	<a class='src'>"+source+"</a>";
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
}

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

function parseTwitterError(err) {
	$("#twitter_success").prepend("<div id='error' class='alert alert-danger'>"+message+"</div>");
}

function postTwitterSuccess(message) {
	$("#twitter_success").prepend("<div id='success' class='alert alert-success'>"+message+"</div>");
}

function fav(id) {
	console.log("[twitter] fav: Attempting to fav tweet with id of '"+id+"'");
	var Twit = require('twitter');
	var T = new Twit(window.config);
	T.post('favorites/create', { id: id }, function (err, data, response) {
		if(err) {
			parseTwitterError(err);
		}
		console.log(data);
	});
	document.getElementById(id+"-fav").value="";
	document.getElementById(id+"-fav").innerHTML="<span class='tweet favourited'><i class='fa fa-heart' style='color:red;'></i></span>";
	postTwitterSuccess("Tweet: Favorited Successfully!");
}

function rt(id) {
	console.log("[twitter] rt: Attempting to RT tweet with id of '"+id+"'");
	var Twit = require('twitter');
	var T = new Twit(window.config);
	T.post('statuses/retweet/:id', { id: id }, function (err, data, response) {
		if(err) {
			parseTwitterError(err);
		}
		console.log(data);
	});
	document.getElementById(id+"-rt").value="";
	document.getElementById(id+"-rt").innerHTML="<span class='tweet retweeted'><i class='fa fa-retweet'></i>'d</span>";
	postTwitterSuccess("Tweet: Retweeted Successfully!");
}

function del(id) {
	console.log("[twitter] del: Attempting to del your tweet with an id of '"+id+"'");
	var Twit = require('twitter');
	var T = new Twit(window.config);
	T.post('statuses/delete/:id', { id: id }, function (err, data, response) {
		if(err) {
			parseTwitterError(err);
		}
		console.log(data);
	});
	postTwitterSuccess("Tweet: Retweeted Successfully!");
}

var twit_ver="1.1-dev";
console.log("[twitter] Loaded Version: "+twit_ver);