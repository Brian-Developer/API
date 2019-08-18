<?php
require("oauth/twitteroauth.php");
require("config.php");
//twitter oauth
session_start();
$tweetText= $_SESSION['tweet'];
$lat= $_SESSION['lat'];
$lgt= $_SESSION['lgt'];
// $lat = 54.978377;
// $lgt = -1.617765;
if(!empty($_GET['oauth_verifier']) && !empty($_SESSION['oauth_token']) && !empty($_SESSION['oauth_token_secret'])){
	// We've got everything we need
} else {
	// Something's missing, go back to square 1
	header('Location: login_twitter.php');
}

// TwitterOAuth instance, with two new parameters we got in twitter_login.php
$twitteroauth = new TwitterOAuth(CONSUMER_KEY, CONSUMER_SECRET, $_SESSION['oauth_token'], $_SESSION['oauth_token_secret']);
// Let's request the access token
$access_token = $twitteroauth->getAccessToken($_GET['oauth_verifier']);
// Save it in a session var
$_SESSION['access_token'] = $access_token;
// Let's get the user's info
$user_info = $twitteroauth->get('account/verify_credentials');



if(isset($user_info->error)){
	// Something's wrong, go back to square 1
	header('Location: login_twitter.php');
} else {
	if(strlen($tweetText) ==0){
		echo 'Tweet failed because length is 0';
		header('Location: member.php?action=tweetNotSuccessful');
	}
	else{
	$result = $twitteroauth->post('statuses/update', array('status' => $tweetText,'lat'=>$lat,'long'=>$lgt,'display_coordinates'=>true));
	if (isset($result->errors)) {
			// Tweet failed
		// echo 'Tweet to be updated. Error message:'. $result->errors;
		print_r($result->errors);
//		header('Location: member.php?action=tweetNotSuccessful');
	} else {
		echo "Success";
	}
	}
}
?>
