
/**
 * More or less makes sure that Twimber *actually* works.
 *
 * @return {int) error code.
 **/
var fs = require('fs');
eval(fs.readFileSync("tests/test.config.js", { encoding: 'utf8' }, function(err, data) {
	if (err) throw err;
	return data;
}));
var filesToCheck = [ "twitter.js", "functions.js", "config.load.js", "aes.js", "ajax.js" ];

// Act like a browser.
var window=new Object();
window.document=new Object();
var navigator=new Object();
var document=new Object();
navigator.userAgent = "Mozilla/5.0 (Windows NT 6.2; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/32.0.1667.0 Safari/537.36"

for(var i in filesToCheck) {
	file = filesToCheck[i];
	console.log("Testing file: "+file)
	eval(fs.readFileSync("src/engine/public/js/"+file, { encoding: 'utf8' }, function(err, data) {
		if (err) throw err;
		return data;
	}));
	console.log("");
}

console.log("Testing operation.");
if(typeof(window.config)==='undefined') {
	throw "window.config not defined"
}

console.log(' - Writing an encrypted config with the password "l33t_hax0r"');
var config = '{ "access_token": "1", "access_token_secret": "1", "screen_name": "2root4you"}';
if(typeof(CryptoJS.AES.encrypt)==='undefined') {
	throw "Encrypting object/function not loaded."
}

console.log(' - Attempting to decrypt config.')
config = CryptoJS.AES.encrypt(config, "l33t_hax0r");
decrypted_config = CryptoJS.AES.decrypt(config, "l33t_hax0r");
try {
	decrypted_config.toString(CryptoJS.enc.Utf8);
} catch(err) {
	throw "Failed too decrypt.";
}

console.log('Success.');

console.log("");
console.log("done")