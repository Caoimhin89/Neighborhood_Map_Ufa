//initialize the google map, center it on the city of Ufa, set zoom
var map;
function initAutocomplete() {
    var ufa = {lat: 54.771073, lng: 56.027924};
    map = new google.maps.Map(document.getElementById('map'), {
      center: ufa,
      zoom: 12
    });
    google.maps.event.addDomListener(window, "resize", function() {
      var center = map.getCenter();
      google.maps.event.trigger(map, "resize");
      map.setCenter(center);
    });


    var siteInfo = {
      aviationUni:"This is the Aviation University. It was founded in 1932 and is now one of the leading universities in Russia.",
      guestYard:"This is the Guest Yard. At its center is a modestly-sized shopping mall which sits beside a popular scenic park with statues of famous locals and surrounded by restaurants, hotels, and various company headquarters.",
      kashPark:"This is Kashkadan Park. Built in 2002, the park sits on the shoreline of lake Kashkadan and provides a place of leisure and entertainment for locals and tourists.",
      yakPark:"This is Park Yakutova. The park is situated in the center of the city. In the summer it has festival rides and attractions and is frequently used for holidays and cultural events. It is one of the most popular parks in Ufa.",
      lala:"This is the Lala Tulpan Mosque. One of the most iconic buildings in Ufa, it is located just outside Victory Park in the northern part of the city. One of the largest mosques in Russia, it can hold up to a thousand worshippers and stands at 53 meters in height. It's twin minarets are designed to resemble blooming tulips.",
      cityCouncil:"This is the City Council building. It is located along the city's main street and just across from one of the most prominent parks in the city. It is the home of the city's legislature.",
      bashTheater:"This is the Bashkir Drama Theater. It holds various cultural events such as musical concerts, live-action plays, and poetry readings all in the Bashkir language.",
      salavat:"This is Park Salavat Ulayev. This is the main and most popular park in the city. It is situated just a short walk from the seat of government of the Bashkir Republic, the television station, and the main university. It features a statue of its namesake, Salavat Ulayev, a Bashkir folk hero and one of the leaders of the Pugachev rebellion.",
      tatTheater:"This is the Tatar Drama Theater. It hosts a wide array of cultural events and theatrical performances in the Tatar language.",
      victory:"This is Victory Park. It was built to comemorate the soviet triumph over Nazi Germany in the Second World War.",
      congress:"This is the Congress Hall. It is used to host a wide number of important events for the city of Ufa. It was recently used to host the BRICS economic summit.",
      whiteHouse:"This is the White House. It is the seat of government of the Republic of Bashkortostan.",
      friendship:"This is the Friendship Monument. It was built in 1965 to celebrate the 400-year anniversary of Bashkiria's accession to the Russian Empire and the friendship between the Russian and Bashkir peoples.",
      bgu:"This is Bashkir State University. It is the main university in Ufa and is situated on the main street. This is where I studied from September, 2012 through June, 2013.",
      ballet:"This is the Ballet & Opera Theater. Situated in the center of the city, it hosts many classical and contemporary Russian and European spectacles."
    };

//Set up point object to receive all info about map locations
    function point(map, name, lat, long, text, img, markerType) {
      var marker;

      this.name = ko.observable(name);
      this.lat = ko.observable(lat);
      this.long = ko.observable(long);
      this.text = ko.observable(text);
      this.img = ko.observable(img);
      this.markerType = ko.observable(markerType);

//Define how information will be displayed in infowindows

      this.infowindow = new google.maps.InfoWindow({
        position: new google.maps.LatLng(lat, long),
        content: "<strong>" + name + "</strong>" + "<br>" + text + "<br>" + img
      });

      var info = new google.maps.InfoWindow({
        position: new google.maps.LatLng(lat, long),
        content: "<strong>" + name + "</strong>" + "<br>" + text + "<br>" + img
      });
//create markers to display points on map
      if(markerType === "hotel") {
        marker = new google.maps.Marker({
          position: new google.maps.LatLng(lat, long),
          icon: "img/hotel-icon.png",
          title: name,
          map: map,
          draggable: true,
          animation: google.maps.Animation.DROP
        });
      } else {
        marker = new google.maps.Marker({
          position: new google.maps.LatLng(lat, long),
          title: name,
          map: map,
          draggable: true,
          animation: google.maps.Animation.DROP
        });
      }

//set initial visibility so that users can change visibility of markers by using a filter function that will be defined later

      this.isVisible = ko.observable(false);
      this.isVisible.subscribe(function(currentState) {
        if (currentState) {
          marker.setMap(map);
        } else {
          marker.setMap(null);
        }
      });

      this.isVisible(true);

//display infowindows when user clicks the map marker

      marker.addListener('click', function() {
        info.open(map, marker);
        console.log(marker.title);
      });

      marker.addListener('click', toggleBounce);

      function toggleBounce() {
        if (marker.getAnimation() !== null) {
          marker.setAnimation(null);
        } else {
          marker.setAnimation(google.maps.Animation.BOUNCE);
          setTimeout(function() {
            marker.setAnimation(null);
          }, 1520);
        }
      }
    }

//instantiate new point objects inside an array
    var viewModel = function() {
      var self = this;

      self.points = ko.observableArray([
        new point(map, 'Aviation University', 54.725494, 55.941314, siteInfo.aviationUni, "<img src='img/aviation.jpg'</img>", "poi"),
        new point(map, 'Guest Yard', 54.724807, 55.944055, siteInfo.guestYard, "<img src='img/guest.jpg'</img>", "poi"),
        new point(map, 'Kashkadan Park', 54.773513, 56.060225, siteInfo.kashPark, "<img src='img/kashkadan.jpg'</img>", "poi"),
        new point(map, 'Yakutova Park', 54.741144, 55.951269, siteInfo.yakPark, "<img src='img/yakutova.jpg'</img>", "poi"),
        new point(map, 'Lala Tulpan Mosque', 54.819552, 56.05573, siteInfo.lala, "<img src='img/lala.jpg'</img>", "poi"),
        new point(map, 'City Council', 54.770293, 56.020652, siteInfo.cityCouncil, "<img src='img/gorsoviet.jpg'</img>", "poi"),
        new point(map, 'Bashkir Theater', 54.718773, 55.940926, siteInfo.bashTheater, "<img src='img/bash-drama.jpg'</img>", "poi"),
        new point(map, 'Salavat Ulayev Park', 54.716619, 55.92667, siteInfo.salavat, "<img src='img/salavat-ulayev.jpg'</img>", "poi"),
        new point(map, 'Tatar Theater', 54.748657, 56.019359, siteInfo.tatTheater, "<img src='img/tatar-theater.jpg'</img>", "poi"),
        new point(map, 'Victory Park', 54.81438, 56.057187, siteInfo.victory, "<img src='img/victory.jpg'</img>", "poi"),
        new point(map, 'Congress Hall', 54.721032, 55.928579, siteInfo.congress, "<img src='img/congress.jpg'</img>", "poi"),
        new point(map, 'White House', 54.716501, 55.940882, siteInfo.whiteHouse, "<img src='img/white-house.jpg'</img>", "poi"),
        new point(map, 'Friendship Monument', 54.712937, 55.963894, siteInfo.friendship, "<img src='img/friendship.jpg'</img>", "poi"),
        new point(map, 'Bashkir State University', 54.720188, 55.93605, siteInfo.bgu, "<img src='img/bgu.jpg'</img>", "poi"),
        new point(map, 'Ballet & Opera Theater', 54.722521, 55.944974, siteInfo.ballet, "<img src='img/ballet-theater.jpg'</img>", "poi")
      ]);

      self.hotels = ko.observableArray([
        $.getJSON('https://api.foursquare.com/v2/venues/explore?client_id=FNWBF2MX5O1B5NHTVVOOUECAYBWMX01QOKJ1LL3PYFWI2BWA&client_secret=3NOEIJLZMJRFGPBNPVBJSDDY0RJKD2TQ25UHF5TUT1IAB51W&v=20130815&ll=54.771073,56.027924&query=hotels',
          function(data) {
            $.each(data.response.groups[0].items, function(items, items) {
              console.log(items);
              var hotelDescription;
              if(items.tips != undefined) {
                hotelDescription = "This is a hotel. Click " + "<a href='" + items.tips[0].canonicalUrl + "'>here</a> to learn more about this hotel"
              } else {
                hotelDescription = "This is a hotel."
              }
              self.points.push(new point(map, items.venue.name, items.venue.location.lat, items.venue.location.lng, hotelDescription, "<img src='img/hotel.jpg'></img>", "hotel"));
            });
          })
        ]);


      self.query = ko.observable("");
      self.displayCategories = ko.observableArray(["hotel", "poi"]);
      var isDisplayed = false;

//create filter function so user can narrow the number of points in the list and on the map

      self.filterPoints = ko.computed(function() {
        var search = self.query().toLowerCase();
        return ko.utils.arrayFilter(self.points(), function(point) {
          var doesMatch = point.name().toLowerCase().indexOf(search) >= 0;
          if(doesMatch) {
            if(self.displayCategories().length > 0) {
              if(point.markerType === self.displayCategories()[0]) {
                console.log("markerType: " + point.markerType);
                console.log("displayCategory: " + self.displayCategories()[0]);
                isDisplayed = true;
              }
              if(self.displayCategories().length > 1) {
                if(point.markerType === self.displayCategories()[1]) {
                  console.log("markerType: " + point.markerType);
                  console.log("displayCategory: " + self.displayCategories()[1]);
                  isDisplayed = true;
                }
              }
            } else {
              isDisplayed = false;
            }
          }
            point.isVisible(isDisplayed);
            return isDisplayed;
        });
      });

//create Google Maps infowindows for each point on the map

      self.openInfoWindow = function(point) {
        point.infowindow.open(map, point.marker);
        console.log(point);
      };

    };

    ko.applyBindings(new viewModel());
}
