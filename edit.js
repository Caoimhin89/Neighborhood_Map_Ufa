function initAutocomplete() {
    var ufa = {lat: 54.7355, lng: 55.991982};
    var map = new google.maps.Map(document.getElementById('map'), {
      center: ufa,
      zoom: 12
    }); 

    function point(name, lat, long) {
      this.name = name;
      this.lat = ko.observable(lat);
      this.long = ko.observable(long);

      var infowindow = new google.maps.InfoWindow({
        position: new google.maps.LatLng(lat, long),
        content: name
      });

      var marker = new google.maps.Marker({
        position: new google.maps.LatLng(lat, long),
        title: name,
        map: map,
        draggable: true
      });

      marker.addListener('click', function() {
        infowindow.open(map, marker);
        console.log(marker.title);
      }); 
    }

    var viewModel = function() {
      var self = this;
      self.points = ko.observableArray([
        new point('Aviation University', 54.725494, 55.941314),
        new point('Guest Yard', 54.724807, 55.944055),
        new point('Kashkadan Park', 54.773513, 56.060225),
        new point('Yakutova Park', 54.741144, 55.951269),
        new point('Lala Tulpan Mosque', 54.819552, 56.05573),
        new point('City Council', 54.770293, 56.020652),
        new point('Bashkir Drama Theater', 54.718773, 55.940926),
        new point('Salavat Ulayev Park', 54.716619, 55.92667),
        new point('Tatar Drama Theater', 54.748657, 56.019359),
        new point('Victory Park', 54.81438, 56.057187),
        new point('Congress Hall', 54.721032, 55.928579),
        new point('White House', 54.716501, 55.940882),
        new point('Friendship Monument', 54.712937, 55.963894),
        new point('Bashkir State University', 54.720188, 55.93605),
        new point('Ballet & Opera Theater', 54.722521, 55.944974)
      ]);

      self.listPoints = ko.observableArray([]);
      self.markerPoints = ko.observableArray([]);

      self.openInfoWindow = function() {
        self.infowindow.open(map, marker);
        console.log(marker.title);
      };
      self.removePoint = function(point) {
        self.listPoints.remove(point);
        self.markerPoints.remove(point);
      }
      self.addPoint = function(point) {
        self.listPoints.push(point);
        self.markerPoints.push(point);
      }
    };

    ko.applyBindings(new viewModel());
}
