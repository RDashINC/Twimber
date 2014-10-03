/**
 * (c) 2014 RDashINC
 *
 * Generates tabs
 *
 **/

function genTab(type, user) {
	if(type == "home") {
		genHomeTab();
		resizeTabs("home");
		tlib.getTimeline("#user-home-tweets", function() {
			tlib.startStream("#user-home-tweets");
			resizeTabs("home");
		});
	} else if(type == "user") {
		genBlankTab(user, user+"/tweets");
		tlib.lookUpUser(user, function(tl) {
			// Fill Initial One.
			var content = genUserTab(tl, user);
			console.log(user);
			$("#"+user+"-tab").html(content);

			// Fill Tab
			tlib.getTweets(user, "#"+user+"-t-tweets");
			
			// Fill Header Image
			$("#"+user).backstretch(tl.profile_banner_url);
			resizeTabs("user", user);

			delete content;
		});
	} else if(type == "dm") {
		genMessageTab();
		resizeTabs("dm");
	} else if(type=="mentions") {
		genMentionsTab();
		tlib.getMentions("#mentions-tweets")
		resizeTabs("mentions");
	}
	fixTweetContent();
}

function genHomeTab(dry) {
	var new_tab = "<div class='section-wrapper home-tab' id='home-tab'>";
	new_tab +="	<div class='section-header'>";
	new_tab +="			<div class='section-icon'>";
	new_tab +="				<i class='fa fa-home'></i>";
	new_tab +="			</div>";
	new_tab +="			<div class='section-header-text'>";
	new_tab +="				"+tlib.user.screen_name+"/home";
	new_tab +="			</div>";
	new_tab +="			<div class='section-icon-settings'>";
	new_tab +="				<i class='fa fa-times' onclick='tlib.killStream();$(\"#home-tab\").remove();'></i>";
	new_tab +="			</div>";
	new_tab +="		</div>";
	new_tab +="		<div class='section-body' id='home-tab-body'>";
	new_tab +="			<div class='section-tweets' id='user-home-tweets'>";
	new_tab +="				<div class='loading-gif-wrapper'><img class='loading-gif' src='img/load.gif' /></div>";
	new_tab +="			</div>";
	new_tab +="		</div>";
	new_tab +="	</div>";

	// Gen new obj
	$(".content").prepend(new_tab);
	resizeTabs("home");
}

function genMentionsTab(dry) {
	var new_tab = "<div class='section-wrapper home-tab' id='mentions-tab'>";
	new_tab +="	<div class='section-header'>";
	new_tab +="			<div class='section-icon'>";
	new_tab +="				<i class='fa fa-bell'></i>";
	new_tab +="			</div>";
	new_tab +="			<div class='section-header-text'>";
	new_tab +="				"+tlib.user.screen_name+"/mentions";
	new_tab +="			</div>";
	new_tab +="			<div class='section-icon-settings'>";
	new_tab +="				<i class='fa fa-times' onclick='$(\"#mentions-tab\").remove();'></i>";
	new_tab +="			</div>";
	new_tab +="		</div>";
	new_tab +="		<div class='section-body' id='mentions-tab-body'>";
	new_tab +="			<div class='section-tweets' id='mentions-tweets'>";
	new_tab +="				<div class='loading-gif-wrapper'><img class='loading-gif' src='img/load.gif' /></div>";
	new_tab +="			</div>";
	new_tab +="		</div>";
	new_tab +="	</div>";

	// Gen new obj
	$(".content").prepend(new_tab);
	resizeTabs("home");
}


function genBlankTab(user, name) {
	var new_tab = "<div class='section-wrapper' id='"+user+"-tab'>";
	new_tab +="	<div class='section-header'>";
	new_tab +="			<div class='section-icon'>";
	new_tab +="				<i class='fa fa-home'></i>";
	new_tab +="			</div>";
	new_tab +="			<div class='section-header-text'>";
	new_tab +="				"+name;
	new_tab +="			</div>";
	new_tab +="			<div class='section-icon-settings'>";
	new_tab +="				<i class='fa fa-times' onclick='$(\"#"+user+"-tab\").remove();'></i>";
	new_tab +="			</div>";
	new_tab +="		</div>";
	new_tab +="		<div class='section-body' id='section-body-"+user+"'>";
	new_tab +="			<div class='section-tweets' id='user-home-tweets'>";
	new_tab +="				<div class='loading-gif-wrapper'><img class='loading-gif' src='img/load.gif' /></div>";
	new_tab +="			</div>";
	new_tab +="		</div>";
	new_tab +="	</div>";

	// Gen new obj
	$(".content").prepend(new_tab);
	resizeTabs("home");
}

function initTabs() {
	var fs = require('fs');
	var cfg = fs.readFileSync('./src/cfg/config.json');
	var cfg = JSON.parse(cfg);
	var workspace = cfg.workspace;

	$.each(cfg.workspaces, function(i, l) {
		if(l.name!==undefined) {
			if(l.name===workspace) {
				$.each(cfg.workspaces[i].tabs, function(i2, l2) {
					if(l2.name!==undefined) {
						console.log("[tab.js] init: Generating '"+l2.type+"' with name '"+l2.name+"'");
						genTab(l2.type, l2.name);
					} else {
						if(l2.type!==undefined) {
							console.log("[tab.js] init: Generating "+l2.type);
						}
						genTab(l2.type);
					}
				});
			}
		}
	});
}

function genUserTab(tl, name) {
	var new_tab ="	<div class='section-header'>";
	new_tab +="			<div class='section-icon'>";
	new_tab +="				<i class='fa fa-user'></i>";
	new_tab +="			</div>";
	new_tab +="			<div class='section-header-text'>";
	new_tab +="				@"+tl.screen_name+"/tweets";
	new_tab +="			</div>";
	new_tab +="			<div class='section-icon-settings'>";
	new_tab +="				<i class='fa fa-times' onclick='$('></i>";
	new_tab +="			</div>";
	new_tab +="		</div>";
	new_tab +="		<div class='info' id='"+tl.screen_name+"'>";
	new_tab +=" 	  <div class='"+name+"-bkg' id='info-background' style='z-index:200;'></div>";
	new_tab +=" 	  <div class='info-wrapper' style='z-index:1000;'>";
	new_tab +=" 	    <img src='"+tl.profile_image_url.replace('_normal', '')+"'/>";
	new_tab +=" 	    <br />";
	new_tab +=" 	    <div class='entities-username'>"+tl.name+"</div>";
	new_tab +=" 	    <a class='entities-at' href='http://twitter.com/"+tl.screen_name+"'>@"+tl.screen_name+"</a>";
	new_tab +=" 	    <p class='entities-bio'>"+tl.description+"</p>";
	new_tab +=" 	 </div>";
	new_tab +="		</div>";
	new_tab +="		<div class='rollup rb' id='"+tl.screen_name+"-rlup' onclick='hide(\""+tl.screen_name+"\")'><i class='fa fa-chevron-up rollup-btn'></i></div>";
	new_tab +="		<div id='section-body-"+tl.screen_name+"' class='section-body'>";
	new_tab +="			<div class='section-tweets' id='"+name+"-t-tweets'>";
	new_tab +="				<div class='loading-gif-wrapper'><img class='loading-gif' src='img/load.gif' /></div>";
	new_tab +="			</div>";
	new_tab +="		</div>";

	return new_tab;
}

function hide(usr) {
	var nh = $("#"+usr).height()+$("#"+usr+"-rlup").height()+$("#section-body-"+usr).height();
	$("#"+usr).slideUp("fast");
	$("#"+usr+"-rlup").html("<i class='fa fa-chevron-down rollup-btn'></i>");
	$("#"+usr+"-rlup").attr("onclick", "show('"+usr+"')");

	console.log(usr+"/"+nh);
	var nh = $(window).height() - $(".section-header").height() - 40-13;
	$("#section-body-"+usr).height(nh);
}

function show(usr) {
	var nh = $("#section-body-"+usr).height()-275-40;
	$("#"+usr).slideDown("fast", function() {
		resizeTabs("home");
		resizeTabs("user", usr);
	});
	$("#"+usr+"-rlup").html("<i class='fa fa-chevron-up rollup-btn'></i>");
	$("#"+usr+"-rlup").attr("onclick", "hide('"+usr+"')");
}

function genMessageTab() {
	var new_tab = "<div class='section-wrapper dm-tab'>";
	new_tab +="	<div class='section-header'>";
	new_tab +="			<div class='section-icon'>";
	new_tab +="				<i class='fa fa-envelope'></i>";
	new_tab +="			</div>";
	new_tab +="			<div class='section-header-text'>";
	new_tab +="				Direct Messages";
	new_tab +="			</div>";
	new_tab +="			<div class='section-icon-settings'>";
	new_tab +="				<i class='fa fa-times' onclick='$(\"#dm-tab\").remove();'></i>";
	new_tab +="			</div>";
	new_tab +="		</div>";
	new_tab +="		<div class='section-body' id='dm-tab-body'>";
	new_tab +="			<div class='section-tweets' id='user-dms-tweets'>";
	new_tab +="				<div class='loading-gif-wrapper'><img class='loading-gif' src='img/load.gif' /></div>";
	new_tab +="			</div>";
	new_tab +="		</div>";
	new_tab +="	</div>";

	// Gen new obj
	$(".content").prepend(new_tab);
	resizeTabs("dm");

	// Fill Tab
	tlib.getDMs("#user-dms-tweets");
}

function removeTab(tab) {
	$("."+tab+"-tab").remove();
}

function removeAllTabs() {
	$(".section-wrapper").remove();
	tlib.killStream();
}

function resizeTabs(type, param, gap) {
	if(type===undefined) {
		type=false;
	} else if(gap===undefined) {
		gap=0
	}

	var nhs = $(window).height() - $(".section-header").height();

	// For Middle Element of sliders
	if(type=="user") {
		nhs = nhs - $("#"+param).height() - $("#"+param+"-rlup").height();
		console.log("[tab.js] /resizeTabs/ => resize: [user] "+param+"/"+nhs);
		$("#section-body-"+param).height(nhs-13);
	} else if(type==="home") {
		$("#home-tab-body").height(nhs-13);
	} else if(type==="dm") {
		$("#dm-tab-body").height(nhs-13);
	} else if(type==="mentions") {
		$("#mentions-tab-body").height(nhs-13);
	}
}