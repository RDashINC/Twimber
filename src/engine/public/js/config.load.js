function loadUser(user, dir) {
	var data = fs.readFileSync(dir+"/config."+user+".js", { encoding: 'utf8' }, function(err, data) { 
		if (err) throw err; 
	});
	return data;
}

var path = require('path');
var appdata = path.resolve(process.cwd(), config_dir);
var base_dir = appdata+"/RDashINC/vTweet";
window.base_dir=base_dir;

var file_exists = fs.existsSync(base_dir);

if (file_exists === false) {
	window.config = {
		consumer_key: ck,
		consumer_secret: cs,
		config_dir: config_dir,
		picture_dir: picture_dir
	}
} else {
	var data = loadUser("main", base_dir);
	/**
   	 * Decrypt Config File
     *
     *  TODO: Don't use globals. Ew. No. :D
     **/
	if(typeof(global.pwd)==='undefined') {
		console.log("global.pwd is undefined. Ignoring. This could be a bug. Loading minimal config.");
		window.config = {
			consumer_key: ck,
			consumer_secret: cs,
			config_dir: config_dir,
			picture_dir: picture_dir
		}	
	} else {
		window.saved_config=data;
		window.saved_config = CryptoJS.AES.decrypt(window.saved_config, global.pwd);
		window.saved_config = window.saved_config.toString(CryptoJS.enc.Utf8);
		if(window.saved_config) {
			window.saved_config = JSON.parse(window.saved_config);
			window.config = {
				consumer_key: ck,
				consumer_secret: cs,
				access_token: window.saved_config.access_token,
				access_token_secret: window.saved_config.access_token_secret,
				screen_name: window.saved_config.screen_name,
				config_dir: config_dir,
				picture_dir: picture_dir
			};
		} else {
			throw "Incorrect Password";
		}
	}
}