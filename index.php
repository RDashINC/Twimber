<?php
    /**
	 *
	 * vTweet - The PHP Cross-Platform Twitter client, using TideSDK.
	 *		- Runs off pony labor.
	 *
	 * @author RainbowDashDC
	 * @license GNUGPLv3
	 * @link http://github.com/RDashINC/vTweet
	 *
	 **/
	
	// First of all, load the engine configuration file. (Config options may be needed for whatever reason).
	require_once('engine/config.php');
	 
	// Provides an "autoloader" for any and all classes.
	require_once('engine/autoLoad.php');
	
	require 'engine/classes/OAuth.php';
	require 'engine/classes/Twitter.php';

	$Twitter = new Twitter(CONSUMER_KEY, CONSUMER_SECRET, AT, ASECRET);
	
	// Test
	echo "PHP V:".phpversion()."<br />";
	echo $Twitter->load();