<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title>Top Bait</title>
    <link rel="stylesheet" href="css/style.css">
    <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyClHis2qtmUmPhWf7CPxt_M4eCHqLxWwxE&libraries=geometry"></script>
  </head>
  <body>
    <div id="googleMap"></div>
    <div id = "box">
      <div id = "tweet">
        <span>
          <input id="tokenKey" placeholder="Token Key"></input>
        </span>
        <br/>
        <br/>
        <textarea id="tweetText" rows = "5" placeholder="Tweet Text"></textarea>
        <br/>
        <input id="tweetBtn" type="button" value="Tweet"></input>
        <div id="status"></div>
      </div>
      <div id = "tweetResult">
      </div>
    </div>
    <script src = "js/jquery.js"></script>
    <script src = "js/map.js"></script>
  </body>
</html>
