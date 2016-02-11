//initialize the google map, center it on the city of Ufa, set zoom
function initAutocomplete() {
    var ufa = {lat: 54.771073, lng: 56.027924};
    var map = new google.maps.Map(document.getElementById('map'), {
      center: ufa,
      zoom: 11
    });

    var siteInfo = {
      aviationUni:"This is the Aviation University.",
      guestYard:"This is the Guest Yard.",
      kashPark:"This is Kashkadan Park.",
      yakPark:"This is Park Yakutova.",
      lala:"This is the Lala Tulpan Mosque.",
      cityCouncil:"This is the City Council.",
      bashTheater:"This is the Bashkir Drama Theater.",
      salavat:"This is Park Salavat Ulayev.",
      tatTheater:"This is the Tatar Drama Theater.",
      victory:"This is Victory Park.",
      congress:"This is the Congress Hall.",
      whiteHouse:"This is the White House.",
      friendship:"This is the Friendship Monument.",
      bgu:"This is Bashkir State University.",
      ballet:"This is the Ballet & Opera Theater."
    };

//Set up point object to receive all info about map locations
    function point(map, name, lat, long, text, img) {
      var marker;

      this.name = ko.observable(name);
      this.lat = ko.observable(lat);
      this.long = ko.observable(long);
      this.text = ko.observable(text);
      this.img = ko.observable(img);

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

      marker = new google.maps.Marker({
        position: new google.maps.LatLng(lat, long),
        title: name,
        map: map,
        draggable: true,
        animation: google.maps.Animation.DROP
      });

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
}
//instantiate new point objects inside an array
    var viewModel = function() {
      var self = this;

      self.points = ko.observableArray([
        new point(map, 'Aviation University', 54.725494, 55.941314, siteInfo.aviationUni, "<img src='img/aviation.jpg'</img>"),
        new point(map, 'Guest Yard', 54.724807, 55.944055, siteInfo.guestYard, "<img src='img/guest.jpg'</img>"),
        new point(map, 'Kashkadan Park', 54.773513, 56.060225, siteInfo.kashPark, "<img src='img/kashkadan.jpg'</img>"),
        new point(map, 'Yakutova Park', 54.741144, 55.951269, siteInfo.yakPark, "<img src='img/yakutova.jpg'</img>"),
        new point(map, 'Lala Tulpan Mosque', 54.819552, 56.05573, siteInfo.lala, "<img src='img/lala.jpg'</img>"),
        new point(map, 'City Council', 54.770293, 56.020652, siteInfo.cityCouncil, "<img src='img/gorsoviet.jpg'</img>"),
        new point(map, 'Bashkir Drama Theater', 54.718773, 55.940926, siteInfo.bashTheater, "<img src='img/bash-drama.jpg'</img>"),
        new point(map, 'Salavat Ulayev Park', 54.716619, 55.92667, siteInfo.salavat, "<img src='img/salavat-ulayev.jpg'</img>"),
        new point(map, 'Tatar Drama Theater', 54.748657, 56.019359, siteInfo.tatTheater, "<img src='img/tatar-theater.jpg'</img>"),
        new point(map, 'Victory Park', 54.81438, 56.057187, siteInfo.victory, "<img src='img/victory.jpg'</img>"),
        new point(map, 'Congress Hall', 54.721032, 55.928579, siteInfo.congress, "<img src='img/congress.jpg'</img>"),
        new point(map, 'White House', 54.716501, 55.940882, siteInfo.whiteHouse, "<img src='img/white-house.jpg'</img>"),
        new point(map, 'Friendship Monument', 54.712937, 55.963894, siteInfo.friendship, "<img src='img/friendship.jpg'</img>"),
        new point(map, 'Bashkir State University', 54.720188, 55.93605, siteInfo.bgu, "<img src='img/bgu.jpg'</img>"),
        new point(map, 'Ballet & Opera Theater', 54.722521, 55.944974, siteInfo.ballet, "<img src='img/ballet-theater.jpg'</img>")
      ]);

      self.query = ko.observable("");

//create filter function so user can narrow the number of points in the list and on the map

      self.filterPoints = ko.computed(function() {
        var search = self.query().toLowerCase();
        return ko.utils.arrayFilter(self.points(), function(point) {
          var doesMatch = point.name().toLowerCase().indexOf(search) >= 0;
          point.isVisible(doesMatch);
          return doesMatch;
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