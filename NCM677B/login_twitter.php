<?php

require("oauth/twitteroauth.php");
require("config.php");
session_start();
$tweetText= isset($_REQUEST['tweetText']) ? $_REQUEST['tweetText']:null;
$lat= isset($_REQUEST['lat']) ? $_REQUEST['lat']:null;
$lgt= isset($_REQUEST['lgt']) ? $_REQUEST['lgt']:null;
// $lat = 54.978377;
// $lgt = -1.617765;
$tweet = sprintf('%s %s', '#CM0677 Top Bait', $tweetText);
$_SESSION['tweet']= $tweet;
$_SESSION['lat']= $lat;
$_SESSION['lgt']= $lgt;

// The TwitterOAuth instance
$twitteroauth = new TwitterOAuth(CONSUMER_KEY, CONSUMER_SECRET);
// Requesting authentication tokens, the parameter is the URL we will be redirected to
$request_token = $twitteroauth->getRequestToken(OAUTH_CALLBACK);

echo "<pre>";
print_r($request_token);
echo "</pre>";

// Saving them into the session
$_SESSION['oauth_token'] = $request_token['oauth_token'];
$_SESSION['oauth_token_secret'] = $request_token['oauth_token_secret'];

// If everything goes well..
if($twitteroauth->http_code==200){
	// Let's generate the URL and redirect
	$url = $twitteroauth->getAuthorizeURL($request_token['oauth_token']);

	header('Location: '. $url) ;

} else {
	// It's a bad idea to kill the script, but we've got to know when there's an error.
	die('Something wrong happened.');
}

?>
