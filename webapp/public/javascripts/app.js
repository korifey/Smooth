/**
 * Created by kascode on 16.06.15.
 */

function RoutePoint (str) {
  var data = str.split(' ');
  this.latLng = {
    lat: null,
    lng: null
  };
  this.latLng.lat = parseFloat(data[1]);
  this.latLng.lng = parseFloat(data[0]);
  this.type = data[2];
}

var route_manager = {
  sendTimeout: null,
  route_pins: {
    start: null,
    finish: null
  },
  walkLines: [],
  busLines: [],
  roadLines: [],
  lines: [],
  polylines: [],
  routeMarkers: [],
  obstacleMarker: null,
  currentState: null,
  walkLineOpts: {
    color: '#12c700',
    fillColor: '#64dd17',
    wight: 6,
    lineCap: 'round',
    lineJoin: 'round'
  },
  busLineOpts: {
    color: '#03a9f4',
    fillColor: '#03a9f4',
    wight: 5,
    lineCap: 'round',
    lineJoin: 'round'
  },
  roadLineOpts: {
    color: '#e00032',
    fillColor: '#e00032',
    wight: 5,
    lineCap: 'round',
    lineJoin: 'round'
  },
  walkIconOpts: {
    iconUrl: '/images/walk.svg',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    className: 'busPin'
  },
  busIconOpts: {
    iconUrl: '/images/bus.svg',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    className: 'busPin'
  },
  roadIconOpts: {
    iconUrl: '/images/warn.svg',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    className: 'warnPin'
  },
  startIcon: L.divIcon({className: 'route-icon route-icon-start', html: 'S', iconSize: [20,20]}),
  finishIcon: L.divIcon({className: 'route-icon route-icon-finish', html: 'F', iconSize: [20,20]}),
  obstacleIcon: L.divIcon({className: 'route-icon route-icon-obstacle', html: '—', iconSize: [20,20]}),

  sendRequest: function () {
    var pins = route_manager.route_pins;
    var url_string = pins.start.getLatLng().lng + '&' + pins.start.getLatLng().lat + '&' + pins.finish.getLatLng().lng  + '&' + pins.finish.getLatLng().lat;

    var request_path = (window.location.host.indexOf(".lc") !== -1 ? "http://smooth.lc/path?" : "http://smooth.city/path?") + url_string;
    console.log(request_path);

    return new Promise(function (resolve, reject) {
      $.ajax({
        url: request_path,
        dataType: 'text',
        success: function(route_data) {
          console.log("route_data", route_data);
          resolve(route_data);
          //handleRouteResponse(msg);
        },
        error: function (err) {
          reject(err);
        }
      });
    });
  },

  parseRouteData: function (route_data) {
    console.log("Route data", route_data);
    route_manager.lines = [];
    var lines = route_data.split('\n');
    var points = [];
    var prev_type = lines[0].split(' ')[2];
    var point;
    var line = [];

    // Exclude last line with info about route
    for (var i = 0; i < lines.length - 2; i++) {
      point = new RoutePoint(lines[i]);
      if (typeof point.type === 'undefined') {
        point.type = prev_type;
      }
      line.push(point);

      // If line type changed save first point of new type as last point of prev line AND as first point of new one
      if (point.type !== prev_type) {
        route_manager.saveRouteLine(line);
        line = [point];
      }

      prev_type = point.type;
    }
    // Save last line
    route_manager.saveRouteLine(line);
  },

  saveRouteLine: function (line) {
      route_manager.lines.push(line);
  },

  displayLines: function (color) {
    console.log("Display lines", route_manager.lines);
    for (var i = 0; i < route_manager.lines.length; i++) {
      this.displayLine(route_manager.lines[i], color);
    }
  },

  /**
   * Draw route line
   * @param line Array array of Points
   * @param color String color string
   */
  displayLine: function (line, color) {
    console.log("Display line:", line);
    var type = line[0].type;
    var lineOpts;
    var iconOpts;

    switch (type) {
      case '1':
        lineOpts = route_manager.walkLineOpts;
        iconOpts = route_manager.walkIconOpts;
        break;
      case '2':
        lineOpts = route_manager.roadLineOpts;
        iconOpts = route_manager.roadIconOpts;
        break;
      case '3':
        lineOpts = route_manager.busLineOpts;
        iconOpts = route_manager.busIconOpts;
        break;
    }

    lineOpts.color = color ? color : lineOpts.color;

    var polyline = L.polyline(line.map(function (el) {
      return el.latLng;
    }), lineOpts).addTo(route_map.map);

    route_manager.polylines.push(polyline);

    var marker = L.marker(line[0].latLng, iconOpts);

    route_manager.routeMarkers.push(marker);
  },

  clearRoute: function () {
    while (route_manager.polylines.length) {
      route_map.map.removeLayer(route_manager.polylines[0]);
      route_manager.polylines.splice(0, 1);
    }

    while (route_manager.routeMarkers.length) {
      route_map.map.removeLayer(route_manager.routeMarkers[0]);
      route_manager.routeMarkers.splice(0, 1);
    }
  },

  clearPoints: function () {
    if (route_manager.route_pins.start) {
      route_map.map.removeLayer(route_manager.route_pins.start);
    }
    if (route_manager.route_pins.finish) {
      route_map.map.removeLayer(route_manager.route_pins.finish);
    }
    if (route_manager.obstacleMarker) {
      route_map.map.removeLayer(route_manager.obstacleMarker);
    }
    route_manager.lines = [];
    route_manager.route_pins.start = null;
    route_manager.route_pins.finish = null;

    var input = $('.route-address-input');
    input.val('');
    input.trigger('keyup');
    input.siblings('.route-address-confirm').removeClass('set');
  }
};

$(function() {
  route_map.initialize();
  hamburgerInit();
  initDash();
});