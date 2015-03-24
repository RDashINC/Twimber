/**
 * (c) 2014 RDashINC
 *
 * Provides an easy interface too twit, and etc.
 *
 * @author RainbowDashDC
 * @copyright GNUGPLv2
 * @link http://github.com/RDashINC/Twimber/master/js/twitter.js
 * @see RDashINC - http://rdashinc.github.io/
 * @see Twit, backend - https://github.com/ttezel/twit
 * @see Twitter API - http://dev.twitter.com/docs
 **/

/** Add To String Object **/
String.prototype.contains = function(it) { return this.indexOf(it) != -1; };

/**
 * Twitter Object construct, you should put anything that will be used across <all> functions here,
 * in such format: this.whatever = value
 *
 * @constructor
 *
 **/
function twitter() {
	/** Initialize, for OAuth. **/
	this.consumer_key=null;
	this.consumer_secret=null;

	/** Config, change these. **/
	this.consumer_key="JD2Wrm4Rug4Lgk9K7twruAx0I";
	this.consumer_secret="iOGbBw4JWWF33apUbg3DvMe23pk6I81HZQrEZPyuCtlajeaGxT";

	/** Set config file **/
	this.config="./src/cfg/config.json"

	/** Initialize OAuth **/
	var options = {
		consumerKey: this.consumer_key,
		consumerSecret: this.consumer_secret
	};
	this.oauth = OAuth(options);

	/** Initialize apis **/
	this.fs = require('fs');
	this.form_data = require('form-data');
	this.utf8 = require('utf8');
	this.request = require('request');

	delete options;

	console.log("[twitter.js] Twitter API Library initalized.");
}

/**
 * Use the Twitter Rest API too obtain a users tweets
 *
 * @return none
 **/
twitter.prototype.getTweets = function(user, cb_div, cb) {
	console.log("[twitter.js] /getTweets/ => call: Gettings 100 tweets for'"+user+"'");
	ths = this

	this.T.get("statuses/user_timeline", { screen_name: user, count: 100}, function(err, data, response) {
		var parsed_obj = ths.createFormattedTweet(data);
		$(cb_div).html(parsed_obj);

		if(cb!==undefined) {
			cb();
		}
	})
};

/**
 * Use the Twitter Rest API too obtain a users mentions
 *
 * @return none
 **/
twitter.prototype.getMentions = function(cb_div, cb) {
	console.log("[twitter.js] /getMentions/ => call: Gettings 100 mentions. ["+cb_div+"]");
	ths = this

	this.T.get("statuses/mentions_timeline", { count: 100}, function(err, data, response) {
		var parsed_obj = ths.createFormattedTweet(data);
		$(cb_div).html(parsed_obj);

		if(cb!==undefined) {
			cb();
		}
	})
};

/**
 * Use the Twitter Rest API too obtain your direct messages
 *
 * @return none
 **/
twitter.prototype.getDMs = function(cb_div, cb) {
	ths = this;

	this.T.get("direct_messages", { count: 100 }, function(err, data, response) {
		$(cb_div).html(ths.createFormattedDm(data));

		if(cb!==undefined) {
			cb();
		}
	})
};

twitter.prototype.lookUpUser = function(user, cb) {
	if(cb===undefined) {
		throw "Needs a callback";
	}

	console.log("[twitter.js] /lookUpUser/ => call: Getting user obj for '"+user+"'");

	this.T.get("users/show", { screen_name: user }, function(err, data, response) {
		if(err) {
			index.throwError("Couldn't look up user:"+user);
			return false;
		}

		cb(data);
	})
}

/**
 * Kill the Main Stream
 *
 * @return none
 **/
twitter.prototype.killStream = function() {
	/** @see Issue #2 on http://github.com/RDashINC/Twimber, fixes tlib.stop(); issues. **/
	global.user_stream.stopStallAbortTimeout();
	global.user_stream.removeAllListeners();
	global.user_stream.request.res._dump();
	global.user_stream.request.socket.destroy();
	global.user_stream.request.abort();
	delete global.user_stream.request;
	delete global.uss;
	console.log("[twitter.js] /stream/ => kill");
}

/**
 * Display Twitter Stream API lag.
 *
 * @return none;
 **/
twitter.prototype.showLag = function(lag) {
	$("#lag").attr("title", "Streaming API Latency: "+lag+"ms");
	$("#lag-num").attr("title", "Streaming API Latency: "+lag+"ms");
	if(lag < 50 || lag == 50) {
		$("#lag").css("color", "green");
	} else if (lag == 51 || 51 < lag && lag < 150 || lag == 150) {
		$("#lag").css("color", "yellow");
	} else if (lag > 151 || lag == 151) {
		$("#lag").css("color", "red");
	} else {
		$("#lag").css("color", "#000");
		$("#lag-num").html("--");
		$("#lag").attr("title", "");
		$("#lag-nums").attr("title", "");
	}
}

/**
 * Initialize the main stream
 *
 * @return none
 **/
twitter.prototype.startStream = function(cb_div) {
		/**
		 * This is essentially the beginning function. (for twitter).
		**/

		var ths = this;

		if(typeof(global.uss)==='undefined') {
			try {
				global.user_stream = this.T.stream('user');
				global.uss = true;
			} catch(err) {
				index.throwError(err);
			}
		} else {
			this.killStream();

			return false;
		}

		global.user_stream.on('tweet', function (tweet) {
			if(global.lag===undefined) {
				global.lag="N/A"
			}
			console.log("[twitter.js]: /stream/ => event: Tweet");
			var parse_tweet = new Date().getTime();

			/** If we just posted a tweet, measure the time it takes too receieve it **/
			if(global.measure_tweet===true) {
				global.recieved_tweet = new Date().getTime();
				global.measure_tweet = false;
				global.lag = global.recieved_tweet-global.tweet_posted
				console.log("[twitter.js] /stream/ => time: Streaming API Lag is at "+global.lag+"ms");

				ths.showLag(global.lag);

				global.measure_tweet=false; // secondary precaution
				delete global.measure_tweet;
				delete global.recieved_tweet;
			}

			var tweet_text = tweet.text

			/** Prepend new Tweet **/
			if(tweet_text.contains(ths.user.screen_name)===true) {
				$('#mentions-tweets').prepend(ths.createFormattedTweet(tweet));
			}

			/** Append Tweet to main stream, aka a home tab **/
			$(cb_div).prepend(ths.createFormattedTweet(tweet));

			/** Measure time /we/ take too parse the tweet. **/
			var finish_parse_tweet = new Date().getTime();
			var lag_parse = finish_parse_tweet-parse_tweet;

			/** Display (old, or new) LAG+Parse lag **/
			console.log("[twitter.js] /stream/ => time: Parse Lag is at "+lag_parse+"ms");
			$("#lag-num").html(global.lag+"ms (+"+lag_parse+")");

			/** Clean up **/
			global.measure_tweet=false;
			delete global.tweet_posted;
			delete finish_parse_tweet;
		});
		global.user_stream.on('disconnect', function(dc_msg) {
			index.throwError("[twitter.js] /stream/ => event: Disconnect");
			ths.killStream();
		});
		global.user_stream.on('favorite', function(response) {
			console.log("[twitter.js] /stream/ => event: Favorite");
			$(cb_div).prepend(ths.createFavoriteTweet(response));
		});
		global.user_stream.on('close', function(dc_msg) {
			index.throwError("[twitter.js] /stream/ => event: Close");
			ths.killStream();
		});

		setInterval(function(){
			console.log("[twitter.js] /setInterval/ => call: RelativeTime");
			$('.timestamp').each(function(i, obj) {
				$(obj).html(ths.relativeTime($(obj).attr("title")));
			});
		}, 7500);

		console.log("[twitter.js] /stream/ => init");

		return null;
}

/**
 * Formats Hashtags, markdown, etc.
 *
 * @return str
 **/
twitter.prototype.formatBody = function(text) {
	if(typeof(text)==='undefined') {
		// Fallback to original text.
		return "<span style='color:red;'>[Twimber Error] empty text</span>";
	}
	text = "<div class='tweet-body'>"+text;
	var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;.]*[-A-Z0-9+&@#\/%=~_|])/i;
	text = text.replace(exp, "[$1](#)");
	exp = /(^|\s)#(\w+)/g;
	text = text.replace(exp, "$1[#$2](#)");
	exp = /(^|\s|.)@(\w+)/g;
	text = text.replace(exp, "$1[@$2](#)");

	// initial markdown
	text = marked(text);

	//text = text.replace(/^\<\p\>/g, "<p class='tweet-body'>"); // make regex more sound, could cause a bug

	text = text+"</div>";

	return text; // markdown parser causes weird issues
}

/**
 * Creates a string of tweets in HTML
 *
 * @return str
 **/
twitter.prototype.createFormattedTweet = function(tweet_objs) {
	var t = "";
	ths = this

	if(tweet_objs===undefined) {
		return false;
	}

	if(tweet_objs.user!==undefined) {
		console.log("[twitter.js] /createFormattedTweet/ => parse: One Object Given.");
		t = this.createaFormattedTweet(tweet_objs);
	} else {
		console.log("[twitter.js] /createFormattedTweet/ => parse: Multi objs given.");
		$.each(tweet_objs, function(index, value) {
			t += ths.createaFormattedTweet(value);
		});
	}

	return t;
}

/**
 * Creates a mentions favorite event tweet.
 *
 * @return null
 **/
twitter.prototype.createFavoriteTweet = function() {
	index.throwError("Not implemented");
	return false;
}

/**
 * Creates a string of tweets in HTML
 *
 * @return str
 **/
twitter.prototype.createaFormattedTweet = function(tobj) {
	var retweeted_status=false;
	if(typeof(tobj.retweeted_status)!=='undefined') {
		console.log("[twitter] createFormattedTweet: Got a Retweet, formatting values.");

		// hijack tobj object to be transparent.
		tobj.user.screen_name = tobj.retweeted_status.user.screen_name;
		tobj.user.name = tobj.retweeted_status.user.name;
		tobj.user.profile_image_url = tobj.retweeted_status.user.profile_image_url;
		tobj.source = tobj.retweeted_status.source;
		tobj.created_at = tobj.retweeted_status.created_at;
		tobj.text = tobj.text.replace('RT @'+tobj.retweeted_status.user.screen_name+': ', ''); // little hack to remvove RT @<name>:
		tobj.id = tobj.retweeted_status.id;

		retweeted_status=true;
	}

	var t = "";
	t += "<div class='media tweet' data-id='"+tobj.id+"' id='"+tobj.id+"-tweet'>";
	t +="  <a class='pull-left' href='#'>";
	t +="    <img class='media-object tweet-pimg' src='"+tobj.user.profile_image_url.replace("_normal", "")+"'>";
	t +="  </a>";
	t +="  <div class='media-body'>";
	t +="    <h4 class='media-heading'><span class='tweet-screen_name'>"+tobj.user.name+"</span> - <a class='tweet-at' href='http://twitter.com/"+tobj.user.screen_name+"'>@"+tobj.user.screen_name+"</a></h4>";
	t +=     this.formatBody(tobj.text);
	t +="  </div>";
	t +="  <span class='media-actions'>";
	t +="    <i class='glyphicon glyphicon-star' onclick=\"tlib.favorite('"+tobj.id+"', $(this));\"></i>";
	t +="    &nbsp;";
	t +="    <i class='glyphicon glyphicon-retweet' onclick=\"tlib.retweet('"+tobj.id+"', $(this));\"></i>";
	t +="    &nbsp;";
	t +="    <i class='glyphicon glyphicon-share-alt'></i>";
	t +="  </span>";
	t +="  <span class='tweet-info'>via "+tobj.source+" - <span class='timestamp' title='"+tobj.created_at+"'>"+this.relativeTime(tobj.created_at)+"</span></span>";
	t +="</div>";
	t +="<hr />";

	return t;
}

/**
 * Creates a string of /your/ direct messages.
 *
 * @return str
 **/
twitter.prototype.createFormattedDm = function(tweet_objs) {
	var t = "";
	that = this;
	$.each(tweet_objs, function(index, value) {
		t += "<div class='media tweet' id='"+value.id+"-dm'>";
		t +="  <a class='pull-left' href='#'>";
		t +="    <img class='media-object tweet-pimg' src='"+value.sender.profile_image_url.replace("_normal", "")+"'>";
		t +="  </a>";
		t +="  <div class='media-body'>";
		t +="    <h4 class='media-heading'><span class='tweet-screen_name'>"+value.sender.name+"</span> - <a class='tweet-at' href='http://twitter.com/"+value.sender.screen_name+"'>@"+value.sender.screen_name+"</a></h4>";
		t +=     that.formatBody(value.text);
		t +="  </div>";
		t +="  <span class='media-actions'>";
		t +="  </span>";
		t +="  <span class='tweet-info'><span class='timestamp' title='"+value.created_at+"'>"+that.relativeTime(value.created_at)+"</span></span>";
		t +="</div>";
		t +="<hr />";
	});

	if(t==="") {
		t="<h2>Nothing!</h2>"
	}
	return t;
}


/**
 * Get relative time to a tweets post.
 *
 * @param {string} time - Twitter formatted Time.
 * @return {string} time
 **/
twitter.prototype.relativeTime = function (time) {
	var tdate = time;
    var system_date = new Date(Date.parse(tdate));
    var user_date = new Date();
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

/**
 * Use the Twitter Rest API too obtain your timeline.
 *
 * @return none
 **/
twitter.prototype.getTimeline = function(cb_div, cb) {
	ths = this

	this.T.get("statuses/home_timeline", { count: 100 }, function(err, data, response) {
		var parsed_obj = ths.createFormattedTweet(data);
		$(cb_div).html(parsed_obj);

		/** Callback, for stream **/
		if(cb!==undefined) {
			console.log("[twitter.js] /getTimeline/ => exit: Calling cb");
			cb();
		}
	});
};

/**
 * Start the Twit API wrapper, with access_token (at), and access_token_secret (ats)
 *
 * @return bool
 **/
twitter.prototype.initializeTwit = function(at, ats) {
	var Twit = require('twit');
	this.T = new Twit({
		consumer_key:         this.consumer_key,
		consumer_secret:      this.consumer_secret,
		access_token:         at,
		access_token_secret:  ats
	});

	global.ck  = this.consumer_key;
	global.cs  = this.consumer_secret;
	global.at  = at;
	global.ats = ats;

	return true;
}

/**
 * Sets the consumer_key and consumer_secret
 *
 * @return none
 **/
twitter.prototype.setConsumer = function(ck, cs) {
	this.consumer_key = ck;
	this.consumer_secret = cs;
}

/**
 * Cleans up
 *
 * @return none
 **/
twitter.prototype.clean = function() {
	/** Remove the Consumer keys **/
	delete this.consumer_secret;
	delete this.consumer_key;
	delete global.ck;
	delete global.cs;
	delete global.at;
	delete global.ats;
}

twitter.prototype.getConfigObj = function(){
	return (JSON.parse(this.fs.readFileSync(this.config, "utf8")));
}

/**
 * Check if credentials are "legit"
 *
 * @return index.throwError on error, and index.isDone(); when done.
 **/
twitter.prototype.checkCredentials = function(cb) {
	var ths = this;
	this.T.get('account/verify_credentials', function(err, data, response) {
		if(err) {
			index.throwError("Auth token provided didn't work. Please try again, if this occurs again, please submit a bug report.");
			console.log(response);
			ths.user={};
		} else {
			/** Construct Local User obj **/
      ths.user = {};
			ths.user.screen_name = data.screen_name;
			ths.user.user_id = data.user_id;
			ths.user.name = data.name;
			ths.user.profile_image_url = data.profile_image_url.replace("_normal", "");

			/** Write things too config **/
			var file = ths.getConfigObj()

			file["name"] = data.screen_name;
			file["desc"] = data.description;
			file["profile_image_url"] = data.profile_image_url.replace("_normal", "");

			var filestringify=JSON.stringify(file);
			ths.fs.writeFileSync(ths.config, filestringify);

			/** Move ths object to the actual this **/
			this.user = ths.user;

			console.log("AUTHSUCCESS")

			/** Signigfy success **/
			if(cb!==undefined) {
				cb();
			} else {
				index.isDone();
			}
		}
	});
}

/**
 * Obtain a oauth token from a previously obtained pin.
 *
 * @return none
 **/
twitter.prototype.getAuthToken = function(pin, auth) {
	var ths = this
	this.oauth.get('https://twitter.com/oauth/access_token?oauth_verifier='+pin+'&'+auth, function(data) {
		console.dir(data);

		/** "Explode" the query string as needed. **/
		var accessParams = {};
		var qvars_tmp = data.text.split('&');
		for (var i = 0; i < qvars_tmp.length; i++) {
		var y = qvars_tmp[i].split('=');
			accessParams[y[0]] = decodeURIComponent(y[1]);
		}

		/** Start the Twit OBJ **/
		if(ths.initializeTwit(accessParams.oauth_token, accessParams.oauth_token_secret)!==true) {
			index.throwError("Couldn't initalize Twit");
		}

		/** create objects **/
		tp = {};
		tp[accessParams.screen_name] = {};
		tp[accessParams.screen_name].access_token = accessParams.oauth_token;
		tp[accessParams.screen_name].access_token_secret = accessParams.oauth_token_secret;

		/** write this too config **/
		var file = ths.getConfigObj()

		file["credentials"] = tp;

		var filestringify=JSON.stringify(file);
		ths.fs.writeFileSync(ths.config, filestringify);

		/** clean up **/
		delete tp;
		delete global.tmpuser;

		ths.checkCredentials();
	}, function(data) {
		index.throwError("Couldn't log you in, please try again later.");
	});
};

/**
 * Requests pin from Twitter.
 *
 * @param {string} user - Username to fill in Twitter Username feild.
 * @return none
 **/
twitter.prototype.requestPin = function (user) {
	console.log("[twitter] /deprecated/ requestPin: Attempting to start an OAuth PIN Req.");
		this.oauth.get('https://twitter.com/oauth/request_token',

			function(data) {
				console.dir(data);
				window.open('https://twitter.com/oauth/authorize?'+data.text+"&screen_name="+user+"&force_login=true");
				global.requestParams = data.text;
			},

			function(data) {
				index.throwError("Couldn't get a OAuth token.")
			}
		);
	console.log("[twitter] /deprecated/ requestPin: Done");
}

/**
 * Attempts too post a status too Twitter.
 *
 * @return index.throwError(err);
 **/
twitter.prototype.postStatus = function(status, cb) {
	console.log("[twitter.js] /postStatus/ => post: Posting '"+status+"'");
	this.T.post('statuses/update', { status: status }, function(err, data, response) {
	  if(err) {
	  	index.throwError("Couldn't post status");s
	  }

	  global.measure_tweet = true;
	  global.tweet_posted = new Date().getTime();

	  if(cb!==undefined) {
	  	console.log("[twitter.js] /postStatus/ => exit: Calling cb");
	  	cb();
	  }
	});
};

/**
 * Attempts to retweet a tweet of :id
 *
 * @return undefined
 **/
twitter.prototype.favorite = function(id, obj) {
	console.log("[twitter] fav: Attempting to fav tweet with id of '"+id+"'");
	this.T.post('favorites/create', { id: id }, function (err, data, response) {
		if(err) {
			index.throwError(err);
			console.log(response);
		} else {
			$(obj).addClass("favorited");
		}

		//  DEBUG: output object
		console.log(data);
	});
}

/**
 * Attempts to favourite a tweet of :id
 *
 * @return undefined
 **/
twitter.prototype.retweet = function(id, obj) {
	console.log("[twitter] fav: Attempting to fav tweet with id of '"+id+"'");
	this.T.post('statuses/retweet/:id', { id: id }, function (err, data, response) {
		if(err) {
			index.throwError(err);
		} else {
			// should be a this object
			$(obj).addClass("retweeted");
		}

		// DEBUG: Output object
		console.log(data);
	});
}

/**
 * Attempts too post <file> as an image too twitter, with <status>
 *
 * @return to callback, error (if present), res, and body.
 **/
twitter.prototype.postStatusWithMedia = function(status, file, cb) {
	/** Encode the status in UTF-8 as per the Twitter API guidelines **/
	status = this.utf8.encode(status);

	// Construct a multipart/form-data request with node-form-data
	var form = new this.form_data();
	form.append('status', status);
	form.append('media[]', this.fs.createReadStream(file));

	// Twitter OAuth
	form.getLength(function(err, length){
		if (err) {
			return requestCallback(err);
		}
		var oauth = {
			consumer_key: global.ck,
			consumer_secret: global.cs,
			token: global.at,
			token_secret: global.ats
		};

		var r = this.request.post({url:"https://api.twitter.com/1.1/statuses/update_with_media.json", oauth:oauth, host: "api.twitter.com", protocol: "https:"}, requestCallback);
		r._form = form;
		r.setHeader('content-length', length);
	});

	/** why this? **/
	function requestCallback(err, res, body) {
		cb(err, res, body)
	}
}

/** Is now changeable **/
tlib = new twitter();
