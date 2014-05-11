/** Config **/
var ck = "..."; /** Consumer Key **/
var cs = "..."; /** Consumer Secret **/
var config_dir="../../../Local"; /** Dir too store creds in, creates /RDashINC/vTweet **/
var picture_dir="/RDashINC/vTweet/Screenshots"

/** DO NOT MODIFY BELOW **/
var _0xc99e=["\x66\x73","\x70\x61\x74\x68","\x63\x77\x64","\x2E\x2E\x2F\x2E\x2E\x2F\x2E\x2E\x2F\x4C\x6F\x63\x61\x6C","\x72\x65\x73\x6F\x6C\x76\x65","\x5C\x52\x44\x61\x73\x68\x49\x4E\x43\x5C\x76\x54\x77\x65\x65\x74\x5C\x63\x6F\x6E\x66\x69\x67\x2E\x6D\x61\x69\x6E\x2E\x6A\x73","\x65\x78\x69\x73\x74\x73\x53\x79\x6E\x63","\x63\x6F\x6E\x66\x69\x67","\x75\x74\x66\x38","\x72\x65\x61\x64\x46\x69\x6C\x65\x53\x79\x6E\x63","\x61\x63\x63\x65\x73\x73\x5F\x74\x6F\x6B\x65\x6E","\x73\x61\x76\x65\x64\x5F\x63\x6F\x6E\x66\x69\x67","\x61\x63\x63\x65\x73\x73\x5F\x74\x6F\x6B\x65\x6E\x5F\x73\x65\x63\x72\x65\x74"];var fs=require(_0xc99e[0]);var path=require(_0xc99e[1]);var appdata=path[_0xc99e[4]](process[_0xc99e[2]](),_0xc99e[3]);var base_dir=appdata+_0xc99e[5];var file_exists=fs[_0xc99e[6]](base_dir);if(file_exists===false){window[_0xc99e[7]]={consumer_key:ck,consumer_secret:cs};} else {var data=fs[_0xc99e[9]](base_dir,{encoding:_0xc99e[8]},function (_0x7723x7,data){if(_0x7723x7){throw _0x7723x7;} ;} );eval(data);window[_0xc99e[7]]={consumer_key:ck,consumer_secret:cs,access_token:window[_0xc99e[11]][_0xc99e[10]],access_token_secret:window[_0xc99e[11]][_0xc99e[12]]};} ;
