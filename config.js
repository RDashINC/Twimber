/** Config **/
var ck = ""; /** Consumer Key **/
var cs = ""; /** Consumer Secret **/
var config_dir="../../../Local"; /** Dir too store creds in, creates /RDashINC/Twimber **/
var picture_dir="/RDashINC/Twimber/Screenshots"


/** DO NOT MODIFY BELOW **/
var fs = require('fs');
var config_load = fs.readFileSync("engine/public/js/config.load.js", { encoding: 'utf8' }, function(err, data) { 
	if (err) throw err; 
});
eval(config_load);