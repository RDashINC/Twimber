function getUserStream() {
	console.log("[twitter] getUserStream: is deprecated.");
}

function initStream() {
	/**
	 * This is essentially the beginning function. (for twitter).
	**/
	
	document.getElementById("tweet-ctr").innerHTML="<img style=\"display: block;margin-left:auto;margin-right:auto;\" src=\"engine/public/img/ajax-loader.gif\"></img>";
	var Twit = require('twitter')
	var T = new Twit(window.config)
	T.get('statuses/home_timeline', { count: "150" }, function (err, data, response) {
		var tweets = data;
		document.getElementById("tweet-ctr").innerHTML="";
		tweets.forEach(function(tweet) {
			createFormattedTweet(tweet, true);
		});
		var data = "";
		reload();
	})
}

function postStatus(status) {
	console.log("[twitter] postStatus: attempting too post status '"+status+"'");
	var Twit = require('twitter')
	var T = new Twit(window.config)
	T.post('statuses/update', { status: status }, function(err, data, response) {
		console.log("[twitter] postStatus: Response "+err)
	})
	
	return true;
}

function logout() {
	/** Anything Logout based goes here **/
	var Twit = require('twitter')
	var T = new Twit(window.config)
	window.stream.stop();
	window.location.replace("login.html");
}

function doReply(id, status) {
	console.log("[twitter] doReply: attempting too post status '"+status+"', in reply too the ID '"+id+"'");
	var Twit = require('twitter')
	var T = new Twit(window.config)
	T.post('statuses/update', { status: status, in_reply_to_status_id: id }, function(err, data, response) {
		console.log("[twitter] doReply: Response "+err)
	})
	
	return true;
}

function loadMoreTweets(lastid) {
	$( "#tweet-ctr" ).append("<img style=\"display: block;margin-left:auto;margin-right:auto;\" src=\"engine/public/img/tweet-load.gif\"></img>");
	console.log("[twitter] loadMoreTweets: Getting more tweets from before id '"+lastid+"'");
	var Twit = require('twitter')
	var T = new Twit(window.config)
	T.get('statuses/home_timeline', { count: "50", max_id: lastid  }, function (err, data, response) {
		var tweets = data;
		document.getElementById("tweet-ctr").innerHTML="";
		tweets.forEach(function(tweet) {
			createFormattedTweet(tweet, true);
		});
	});
}

function requestPin(user) {
	console.log("[twitter] requestPin: Attempting too start an OAuth PIN Req.");
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
				window.open('https://twitter.com/oauth/authorize?'+data.text+"&screen_name="+user);
				requestParams = data.text;
				window.location.replace('login.html#'+requestParams);
			},
 
			function(data) { alert('darn'); console.dir(data); }
		);
	console.log("[twitter] requestPin: Done");
}


function reload() {
	console.log("[twitter] reload: Attempting too reload.");
	var Twit = require('twitter');
	var T = new Twit(window.config);

	window.stream = T.stream('user');

	window.stream.on('tweet', function (tweet) {
		console.log("[twitter]: /stream/ => reload: Stream updating.");
		console.log(tweet);
		createFormattedTweet(tweet);
	});
}

function processTweetLinks(text) {
    var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;.]*[-A-Z0-9+&@#\/%=~_|])/i;
    text = text.replace(exp, "<a href='$1' target='_blank'>$1</a>");
    exp = /(^|\s)#(\w+)/g;
    text = text.replace(exp, "$1<a href='http://search.twitter.com/search?q=%23$2' target='_blank' class='tweet hashtag' id='$2'>#$2</a>");
    exp = /(^|\s)@(\w+)/g;
    text = text.replace(exp, "$1<a href='http://www.twitter.com/$2' target='_blank'>@$2</a>");
    return text;
}

function getDms() {
	var Twit = require('twitter')
	var T = new Twit(window.config)
	T.get('direct_messages', { count: "200"}, function (err, data, response) {
		console.log(data);
	})
}

function createFormattedTweet(tweet, ap) {
	var text = tweet.text;
	var screenname = tweet.user.screen_name;
	var name = tweet.user.name;
	var source = tweet.source;
	var id = tweet.id_str; 
	var profile_image_url = tweet.user.profile_image_url;
	var protect = tweet.user.protected;
	var created= tweet.created_at;
	
	var final_text = "<div class='tweet'>";
	var final_text = final_text+"	<img style='float:left;padding:0 1ex 1ex 0; margin-bottom:5px;' src='"+profile_image_url+"'>";
	var final_text = final_text+"	<a class='tweet from_user' href='http://twitter.com/"+screenname+"'>"+name+" - @"+screenname+"</a>";
	var final_text = final_text+processTweetLinks("	<p id='tweet-text' class='tweet contents'> "+text+" </p>");
	var final_text = final_text+"	<span class='tweet timestamp'>"+created+"</span>";
	var final_text = final_text+"	<a id='"+id+"-fav' class='tweet favourite' href='#id="+id+"&action=fav'>Favourite</a>&nbsp;";
	var final_text = final_text+"	<a id='"+id+"-rt' class='tweet retweet' href='#id="+id+"&action=rt'>Retweet</a>&nbsp;";
	var final_text = final_text+"	<a id='"+id+"-reply' class='tweet reply' href='#id="+id+"&action=reply&un="+screenname+"'>Reply</a>&nbsp;|&nbsp;";
	var final_text = final_text+"	<a class='tweet src'>"+source+"</a>";
	var final_text = final_text+"</div>";
	var final_text = final_text+"<hr>";
	if(typeof(ap)!=='undefined') {
		if(ap === true) {
			$( "#tweet-ctr" ).append(final_text);
		}
	} else {
		$( "#tweet-ctr" ).prepend(final_text);
	}
	$("#tweet-text").linkify();
	
	var elements = document.getElementsByClassName('tweet hashtag');
	for (var i = 0; i < elements.length; i++) { 
		if(elements[i].title == "") {
			var hashtag = elements[i].innerHTML.replace( /#/, "" );
			console.log("[twitter] createFormattedTweet: Replacing Hashtag '"+hashtag+"' with def.");
			elements[i].title=getHashTagDef(hashtag);
		}
	}
}

function fav(id) {
	console.log("[twitter] fav: Attempting too fav tweet with id of '"+id+"'");
	var Twit = require('twitter');
	var T = new Twit(window.config);
	T.post('favorites/create', { id: id }, function (err, data, response) {
		console.log(err)
	})
	document.getElementById(id+"-fav").value="";
	document.getElementById(id+"-fav").innerHTML="<span class='tweet favourited'>Favourited</span>";
}

function rt(id) {
	console.log("[twitter] rt: Attempting too RT tweet with id of '"+id+"'");
	var Twit = require('twitter');
	var T = new Twit(window.config);
	T.post('statuses/retweet', { id: id }, function (err, data, response) {
		console.log(err)
	})
	document.getElementById(id+"-rt").value="";
	document.getElementById(id+"-rt").innerHTML="<span class='tweet retweeted'>Retweeted</span>";
}

var twit_ver="1.1-dev";
console.log("[twitter] Loaded Version: "+twit_ver);