<?php
header("Content-Type:application/json");
require("config.php");
require("oauth/twitteroauth.php");
$twitter = new TwitterOAuth(CONSUMER_KEY, CONSUMER_SECRET, ACCESS_TOKEN, ACCESS_TOKEN_SECRET);
$keyword = "%23CM0677 Top Bait";
$tweets = $twitter->get("https://api.twitter.com/1.1/search/tweets.json?q=".$keyword."&lang=en&result_type=recent&count=10");
echo json_encode($tweets);
?>
