<?php
	// First of all, load the engine configuration file. (Config options may be needed for whatever reason).
	 // Debug
	ini_set("display_errors", 1);
	ini_set("track_errors", 1);
	ini_set("html_errors", 1);
	error_reporting(E_ALL);

	require 'engine/config.php';
	require 'engine/classes/Twitter.php';

	if(!isset($Twitter)) {
		require 'engine/classes/OAuth.php';
		$Twitter = new Twitter(CONSUMER_KEY, CONSUMER_SECRET, AT, ASECRET);
	}
	
	if(!isset($_GET["id"])) {
		$data = $_POST;
	} else {
		$data = $_GET;
	}
	
	if(empty($data)) {
		die(json_encode(array("false", "internal server error: 'data'")));
	}
	
	/** Checks **/
	if(empty($data["id"])) {
		die(json_encode(array("false", "empty id")));
	}
	if(empty($data["action"])) {
		die(json_encode(array("false", "empty action")));
	}
	
	if($data["action"]=="rt") {
		$Twitter->retweet($data["id"]);
		die($data["id"]);
	} elseif($data["action"]=="fav") {
		$Twitter->favourite($data["id"]);
		die($data["id"]);
	}elseif($data["action"]=="send") {
		if(empty($data["message"])) {
			die(json_encode(array("false", "empty message")));
		}
		$data["message"] = utf8_encode($data["message"]);
		$Twitter->send($data["message"]);
		die($data["id"]);
	} else {
		die(json_encode(array("false", "invaild command")));
	}
