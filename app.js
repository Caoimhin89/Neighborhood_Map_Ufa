//initialize the google map, center it on the city of Ufa, set zoom
var map;
function continueFor(action, duration) {
  setTimeout(action, duration);
}
function initAutocomplete() {
    var ufa = {lat: 54.771073, lng: 56.027924};
    map = new google.maps.Map(document.getElementById('map'), {
      center: ufa,
      zoom: 11
    });
    google.maps.event.addDomListener(window, "resize", function() {
      var center = map.getCenter();
      google.maps.event.trigger(map, "resize");
      map.setCenter(center);
    });

    var viewModel = function() {
      var self = this;

//Set up point object to receive all info about map locations
      self.point = function(map, name, lat, long, text, img, markerType) {
        var point = this;
        point.marker;

        point.name = ko.observable(name);
        point.lat = ko.observable(lat);
        point.long = ko.observable(long);
        point.text = ko.observable(text);
        point.img = ko.observable(img);
        point.markerType = ko.observable(markerType);

  //Define how information will be displayed in infowindows
        point.infowindow = new google.maps.InfoWindow({
          position: new google.maps.LatLng(lat, long),
          content: "<strong>" + name + "</strong>" + "<br>" + text + "<br>" + img
        });

  //create markers to display points on map
        if(markerType === "hotel") {
          point.marker = new google.maps.Marker({
            position: new google.maps.LatLng(lat, long),
            icon: "img/hotel-icon.png",
            title: name,
            map: map,
            draggable: false,
            animation: google.maps.Animation.DROP
          });
        } else {
          point.marker = new google.maps.Marker({
            position: new google.maps.LatLng(lat, long),
            title: name,
            map: map,
            draggable: false,
            animation: google.maps.Animation.DROP
          });
        }

  //set initial visibility so that users can change visibility of markers by using a filter function that will be defined later
        point.isVisible = ko.observable(false);
        point.isVisible.subscribe(function(currentState) {
          if (currentState) {
            point.marker.setMap(map);
          } else {
            point.marker.setMap(null);
          }
        });
        point.isVisible(true);

  //display infowindows when user clicks the map marker
        point.openInfoWindow = function() {
          point.infowindow.open(map, point.marker);
        }
        point.marker.addListener('click', point.openInfoWindow);
        point.marker.addListener('click', toggleBounce);

        function toggleBounce() {
          if (point.marker.getAnimation() !== null) {
            point.marker.setAnimation(null);
          } else {
            point.marker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function() {
              point.marker.setAnimation(null);
            }, 1520);
          }
        }
        point.toggleBounce = toggleBounce;
      }

//instantiate new point objects inside an array
      self.points = ko.observableArray([]).extend({deferred: true});

//populate array with data from FourSquare API
      $.getJSON('https://api.foursquare.com/v2/venues/explore?venuePhotos=1&client_id=FNWBF2MX5O1B5NHTVVOOUECAYBWMX01QOKJ1LL3PYFWI2BWA&client_secret=3NOEIJLZMJRFGPBNPVBJSDDY0RJKD2TQ25UHF5TUT1IAB51W&v=20130815&ll=54.771073,56.027924&query=hotels',
        function(data) {
          $.each(data.response.groups[0].items, function(items, items) {
            console.log(items);
            var hotelDescription;
            if(items.tips != undefined) {
              hotelDescription = "This is a hotel. Click " + "<a href='" + items.tips[0].canonicalUrl + "'>here</a> to learn more about this hotel"
            } else {
              hotelDescription = "This is a hotel."
            }
            self.points.push(new self.point(map, items.venue.name, items.venue.location.lat, items.venue.location.lng, hotelDescription, "<img src='" + items.venue.featuredPhotos.items[0].prefix + "300x300" + items.venue.featuredPhotos.items[0].suffix + "'></img>", "hotel"));
          });
        });

        $.getJSON('https://api.foursquare.com/v2/venues/explore?venuePhotos=1&client_id=FNWBF2MX5O1B5NHTVVOOUECAYBWMX01QOKJ1LL3PYFWI2BWA&client_secret=3NOEIJLZMJRFGPBNPVBJSDDY0RJKD2TQ25UHF5TUT1IAB51W&v=20130815&ll=54.771073,56.027924&query=landmarks',
          function(data) {
            $.each(data.response.groups[0].items, function(items, items) {
              console.log(items);
              var landmarkDescription;
              if(items.tips != undefined) {
                landmarkDescription = items.tips[0].text + ' Click ' + "<a href='" + items.tips[0].canonicalUrl + "'>here</a> to learn more about this landmark."
              } else {
                landmarkDescription = "This is a popular landmark."
              }
              if(items.venue.featuredPhotos != undefined) {
                self.points.push(new self.point(map, items.venue.name, items.venue.location.lat, items.venue.location.lng, landmarkDescription, "<img src='" + items.venue.featuredPhotos.items[0].prefix + "300x300" + items.venue.featuredPhotos.items[0].suffix + "'></img>", "poi"));
              } else {
                self.points.push(new self.point(map, items.venue.name, items.venue.location.lat, items.venue.location.lng, landmarkDescription, "<img src='img/landmark.jpg'></img>", "poi"));
              }
            });
          });


      self.query = ko.observable("");
      self.displayCategories = ko.observableArray(["hotel", "poi"]);
      var doesMatch = false;
      var selected = false;
      var i = 1;

//create filter function so user can narrow the number of points in the list and on the map

self.filterPoints = ko.computed(function() {
     var search = self.query().toLowerCase();
     return ko.utils.arrayFilter(self.points(), function(point) {
       isSelected = false;
       doesMatch = false;
       self.displayCategories().forEach(function(selection) {
         if(point.markerType() === selection) {
           doesMatch = point.name().toLowerCase().indexOf(search) >= 0;
         }
       });
         point.isVisible((doesMatch));
         return (doesMatch);
       });
    });

//create Google Maps infowindows for each point on the map

      self.openInfoWindow = function(point) {
        point.infowindow.open(map, point.marker);
        point.toggleBounce();
        console.log(point);
      };

    };

    ko.applyBindings(new viewModel());
}
