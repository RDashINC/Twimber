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
	 // Debug
	ini_set("display_errors", 1);
	ini_set("track_errors", 1);
	ini_set("html_errors", 1);
	error_reporting(E_ALL);

	require_once('engine/config.php');
	require 'engine/classes/Twitter.php';

	if(!isset($Twitter)) {
		require 'engine/classes/OAuth.php';
		$Twitter = new Twitter(CONSUMER_KEY, CONSUMER_SECRET, AT, ASECRET);
	}
	
	// Test
	$tweets = $Twitter->load(Twitter::ME_AND_FRIENDS | Twitter::RETWEETS, 20);
	foreach($tweets as $tweet) {
		// Pre Process Text.
		$final_text = $tweet->text;
		$final_text = preg_replace('/https?:\/\/[\w\-\.!~#?&=+\*\'"(),\/]+/','<a href="$0">$0</a>',$final_text);
		$final_text = preg_replace('/([^a-zA-Z0-9-_&])@([0-9a-zA-Z_]+)/',"$1<a href=\"http://twitter.com/$2\" target=\"_blank\" rel=\"nofollow\">@$2</a>", $final_text);
		
		echo "<div class='tweet'>";
		echo "	<a class='tweet from_user' href='http://twitter.com/".$tweet->user->screen_name."'>@".$tweet->user->screen_name."</a>";
		echo "	<p class='tweet contents'>".$final_text."</p>";
		echo "	<a class='tweet favourite' href='#id=".$tweet->id_str."&action=fav'>Favourite</a>&nbsp;";
		echo "	<a class='tweet retweet' href='#id=".$tweet->id_str."&action=rt'>Retweet</a>&nbsp;";
		echo "	<a class='tweet reply' href='#id=".$tweet->id_str."&action=reply'>Reply</a>&nbsp;|&nbsp;";
		echo "	<a class='tweet src'>".$tweet->source."</a>";
		echo "</div>";
		echo "<hr>";
		unset($id);
		unset($final_text);
	}
	echo "<br />";
	echo "<a href='index.html'>Return</a>";
?>