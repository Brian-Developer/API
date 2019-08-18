$(document).ready(function(){
  var DefaultLocation = new google.maps.LatLng(54.978377, -1.617765);
  var count = 0;
  var restaurant_data = [];
  var currentLocation;
  var Restaurant_Amount;
  var map;
  var currentLat;
  var currentLgt;

  function init(){
    var DisplayMap = {
      center: DefaultLocation,
      zoom: 12,
      mapTypeId : google.maps.MapTypeId.ROADMAP
    };
    var googleMap = document.getElementById('googleMap');
    map = new google.maps.Map(googleMap,DisplayMap);
  }

  function DisplayLocation(){
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(
        function(pos){
          currentLat = pos.coords.latitude;
          currentLgt = pos.coords.longitude;
          currentLocation = new google.maps.LatLng(currentLat, currentLgt);
        }   
        ,errors,
        {
          enableHighAccuracy: true,
          timeout: 5000
        })
    }
    else
      alert('Your browser does not support HTML5 Geolocation');
    return false;
  }

  var errors = function(error){
    if(error.code==1)
    {
      alert('User denied location access');
    }
    if(error.code==2)
    {
      alert('No internet connection');
    }
    if(error.code==3)
    {
      alert('Access timeout');
    }
  }

  DisplayLocation();    

  $.getJSON("FHRS_json.json", function(data){
    restaurants = data.FHRSEstablishment.EstablishmentCollection.EstablishmentDetail;

    for(var i = 0; i < restaurants.length; i++){
      if(restaurants[i].Geocode){
        var location = new google.maps.LatLng(restaurants[i].Geocode.Latitude, restaurants[i].Geocode.Longitude);
        var distance = getDistance(DefaultLocation, location);
        restaurants[i].distance = distance;
      }
    }
    GetRestaunrat_Rating();
    DropRestaurant_Details();
  });

  function DropRestaurant_Details(){
    for(var i = 0; i< restaurant_data.length; i++){
        Restaurant_Details(restaurant_data[i]);
    }
  }

  function GetRestaunrat_Rating(){
    for( Rating_Star = 0; Rating_Star < 6; Rating_Star++){
        Restaurant_Amount = 1;
        getRestaurant(restaurants);
        count++;
    }
  }

  function getDistance(user_location, restaurant_location){
    var result = google.maps.geometry.spherical.computeDistanceBetween(user_location, restaurant_location);
    return result;
  }

  function getRestaurant(){
    $.each(restaurants,function(index, value){
      if(value.distance && value.RatingValue){
        if(value.RatingValue == Rating_Star){
          if(Restaurant_Amount < 6 ){
            restaurant_data.push(value);
            Restaurant_Amount++;
          }
          else{
            Restaurant_Amount = 0;
            return false;
          }
        }
      }
    });
  }

  function Restaurant_Details(restaurant){
    var title   = restaurant.BusinessName;
    var address = "<p>" + restaurant.AddressLine1 + "</p>" + 
                  "<p><b>Area:</b> " + restaurant.AddressLine2 + "</p>" + 
                  "<p><b>PostCode:</b> " + restaurant.PostCode + "</p>";
    if(restaurant.Scores){
      if(restaurant.Scores.Hygiene){
        var rate = restaurant.RatingValue;
      }
    }  
    var position = {
      lat : parseFloat(restaurant.Geocode.Latitude),
      lng : parseFloat(restaurant.Geocode.Longitude)
    };
    content = "<b>Name : </b>" + title
            + "<br><b>Address : </b>" + address
            + "<b>Hygiene Rating : </b>" + rate;
    addMarker(position, title, content);
  }

  function addMarker(position, title, content, icon=null){
    var marker = new google.maps.Marker({
      position : position,
      map : map,
      title : title,
      icon : icon,
      animation : google.maps.Animation.DROP
    });

    var infowindow = new google.maps.InfoWindow();

    marker.addListener('mouseover',function(){
      DisplayLocation();
      var ShowDistance_String = "";
      if(currentLat != null && currentLgt != null){
        var distance = parseFloat(getDistance(marker.position, currentLocation)).toFixed(2); 
        ShowDistance_String ="Distance: " + distance + " meters";
      }
      var contentString = "<p>" + content + "<p><br/><b><i>" + ShowDistance_String + "</i></b>" ;
      infowindow.setContent(contentString);
      infowindow.open(map,marker);
    });

    marker.addListener('mouseout',function(){
      infowindow.close(map,marker);
    });
  }

  $('#tweetBtn').click(function(){
    var tokenKey = $('#tokenKey').val();
    var tweetText =  $.trim($('#tweetText').val());

    if(tweetText != "" && tokenKey == ""){
      var tweetURL = "login_twitter.php?tweetText=" + tweetText + "&lat=" + currentLat + "&lgt=" + currentLgt;
      window.open(tweetURL, "width=300, height=300");
      $('#status').html("");
    }
    else if(tweetText != "" && tokenKey != ""){
      $.get(
        "twitter_oauth.php",
         {oauth_verifier: tokenKey},
         function(data){
          if(data == "Success"){
            alert("Message Tweeted!");
          }
          else{
            alert("Invalid Token Key! Please try to tweet again!");
          }
        }
      );    }
    else if (tweetText == ""){
      alert("Please enter the message");
    }
    else if (tokenKey == ""){
      alert("Token Key must be fulfilled!");
    }
  });

  function displayTweet()
  {
    var url = "searchTweet.php";
    $.post(url, {}, function(tweets){
      $('#tweetResult').html("");
      
      var parseStr = "<table>";
      parseStr += "<tr class = 'headerStyle'>";
      parseStr += "<th>Profile Image</th>";
      parseStr += "<th>Username</th>";
      parseStr += "<th>Tweet Message</th>";
      parseStr += "<th>Date Posted</th>";
      parseStr += "<th>Location</th>";
      parseStr += "</tr>";
      for(var i=0; i<tweets.statuses.length;i++)
      {
        parseStr +="<tr ";
        if(i%2==0)
        {
          parseStr +="class=oddRow>";
        }
        else
        {
          parseStr +="class=evenRow>";
        }
        parseStr +="<td>";
        parseStr += "<img src = '" + tweets.statuses[i].user.profile_image_url + "'/>";
        parseStr +="</td>";

        parseStr +="<td>";
        parseStr += tweets.statuses[i].user.screen_name;
        parseStr +="</td>";

        parseStr +="<td>";
        parseStr += tweets.statuses[i].text;
        parseStr +="</td>";

        parseStr +="<td>";
        parseStr += tweets.statuses[i].created_at;
        parseStr +="</td>";

        parseStr +="<td>";
        if(tweets.statuses[i].user.location != '')//Base location
        {
          parseStr += tweets.statuses[i].user.location;
        }
        else if(tweets.statuses[i].user.geo_enabled)//Current location
        {
          var placeName = tweets.statuses[i].place;
          if(placeName!=null)
          {
            parseStr += placeName.name + ", " + placeName.country;
            if(placeName.bounding_box)
            {
              if(placeName.bounding_box.coordinates[0])
              {
                var tweetLat = placeName.bounding_box.coordinates[0][0][1];
                var tweetLgt = placeName.bounding_box.coordinates[0][0][0];
                var icon = {
                  url: 'image/tweet_icon.png',
                  size: new google.maps.Size(71, 71),
                  origin: new google.maps.Point(0, 0),
                  anchor: new google.maps.Point(17, 34),
                  scaledSize: new google.maps.Size(50, 50)
                };
                var p = {
                  lat: parseFloat(tweetLat),
                  lng: parseFloat(tweetLgt)
                };
                addMarker(p, tweets.statuses[i].user.screen_name, tweets.statuses[i].user.screen_name, icon);
              }
            }
          }
          else
          {
            parseStr += "Not found";
          }
        }//end if
        else
        {
          parseStr += "Not available";
        }
        parseStr +="</td>";

        parseStr +="</tr>";
      }//end for loop
      parseStr += "</table>";
      $('#tweetResult').html(parseStr);
    });
  }//end function
  displayTweet();
google.maps.event.addDomListener(window,"load",init);
});
