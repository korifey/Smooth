/**
 * Created by kascode on 16.06.15.
 */

var route_map = {
  map: null,
  workingArea: [[60.34500, 29.16800], [59.55600, 31.17300]],

  initialize: function () {
    if ($('#map').length) {
      this.map = L.map('map', {
        center: [59.9398893, 30.3191246],
        zoom: 15,
        zoomControl: false
      });

      //L.tileLayer('http://tiles.maps.sputnik.ru/{z}/{x}/{y}.png', {
      //  attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
      //  maxZoom: 18
      //}).addTo(this.map);
      var hdpi_string = '';
      if (window.devicePixelRatio > 1.5) {
        hdpi_string = '@2x';
      }

      L.tileLayer('https://api.tiles.mapbox.com/v4/kascode.k35co93d/{z}/{x}/{y}' + hdpi_string + '.png?access_token=pk.eyJ1Ijoia2FzY29kZSIsImEiOiJoeXp2cENzIn0.HYtI1Pj7v372xyxg5kz3Kg#11', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
        maxZoom: 18
      }).addTo(this.map);

      var mapInitialized = document.createEvent('Event');

      mapInitialized.initEvent('mapInitialized', true, true);

      document.dispatchEvent(mapInitialized);
    }
  },

  placeRoutePin: function (location, point_type) {
    console.log("Location:", location, "Point type:", point_type);
    var workingBounds = L.bounds(L.point(this.workingArea[0][0], this.workingArea[0][1]), L.point(this.workingArea[1][0], this.workingArea[1][1]));

    if (workingBounds.contains(L.point(location.lat, location.lng))) {

      var marker = L.marker(location, {
        icon: route_manager[point_type+'Icon']
      });
      marker.addTo(this.map);

      route_map.getAddressByCoords(location).then(function(address) {
        var input = $('.route-address-input.' + point_type);
        input.val(address);
        //input.trigger('keyup');
        //input.siblings('.route-address-confirm').addClass('set');
      });

      // Remove pin if already exist
      if (route_manager.route_pins[point_type] !== null) {

        this.map.removeLayer(route_manager.route_pins[point_type]);

      }

      route_manager.route_pins[point_type] = marker;

      if (route_manager.route_pins.start && route_manager.route_pins.finish) {

        route_manager.sendRequest()
          .then(function (data) {
            route_manager.clearRoute();
            route_manager.parseRouteData(data);
            route_manager.displayLines();
          });

      }

    } else {

      displayMessage('Point is out of working area');

    }
  },

  getCoordsByAddress: function (address) {
    console.log("Address", address);
    address = address.replace(' ', '+');

    return new Promise(function (resolve, reject) {
      $.ajax('https://maps.googleapis.com/maps/api/geocode/json', {
        method: 'GET',
        data: {
          address: address,
          language: 'ru'
        },
        success: function (data) {
          if (data.status === "OK") {
            console.log("address", {
              lat: parseFloat(data.results[0].geometry.location.lat),
              lng: parseFloat(data.results[0].geometry.location.lng),
              address: data.results[0].formatted_address
            });
            resolve({
              lat: parseFloat(data.results[0].geometry.location.lat),
              lng: parseFloat(data.results[0].geometry.location.lng),
              address: data.results[0].formatted_address
            });
          } else {
            reject();
          }
        }
      })
    });
  },

  getAddressByCoords: function (coords) {
    return new Promise(function (resolve, reject) {
      $.ajax('https://maps.googleapis.com/maps/api/geocode/json', {
        method: 'GET',
        data: {
          latlng: coords.lat + ',' + coords.lng,
          language: 'ru'
        },
        success: function (data) {
          if (data.status === "OK") {
            resolve(data.results[0].formatted_address);
          } else {
            reject();
          }
        }
      })
    });
  }
};

document.addEventListener('mapInitialized', function() {
  route_map.map.on('click', function(e) {
    var coords = e.latlng;

    var obstacleAdd = false;

    console.log(coords);

    if (route_manager.currentState === 'obstacle')
      obstacleAdd = true;

    if (obstacleAdd) {
      route_manager.clearPoints();
      setObstacle({lat: coords.lat, lng: coords.lng});
    } else {

      if (route_manager.route_pins.start !== null && route_manager.route_pins.finish !== null) {
        vex.dialog.confirm({
          message: 'Сбросить построенный маршрут?',
          callback: function (value) {
            if (value) {
              route_manager.clearRoute();
              route_manager.clearPoints();
            }
            return console.log("confirm", value);
          }
        });
      } else {

        var type = '';
        if (route_manager.route_pins.start === null) {
          type = 'start';
        }
        else {
          type = 'finish';
        }

        route_map.placeRoutePin(coords, type);
      }
    }
  });

  positionIcon = L.icon({
    iconUrl: 'scripts/mapping/images/person.png',
    iconRetinaUrl: 'scripts/mapping/images/person-2x.png',
    iconSize: [32, 32],
    iconAnchor: [16, 31]
  });



  busIcon = L.icon({
    iconUrl: 'scripts/mapping/images/bus.png',
    iconRetinaUrl: 'scripts/mapping/images/bus-2x.png',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    className: 'busPin'
  });

  walkIcon = L.icon({
    iconUrl: 'scripts/mapping/images/walk.svg',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    className: 'busPin'
  });

  obstacleIcon = L.divIcon({
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    className: 'obstacle-marker',
    html:'<div></div>'
  });
});