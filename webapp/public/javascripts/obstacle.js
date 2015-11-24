/**
 * Created by kascode on 22.11.15.
 */

var Obstacle = {
  try: function (lat, lng) {
    return new Promise(function (resolve, reject) {
      var params = lng + '&' + lat;
      console.log(window.location.origin + '/obstacle/try?' + params);
      $.ajax(window.location.origin + '/obstacle/try?' + params, {
        method: 'POST',
        success: function (data) {
          resolve(data);
        },
        error: function (err) {
          reject(err);
        }
      });
    });
  },

  set: function (lat, lng) {
    console.log("setObstacle", lat, lng);
    var marker = L.marker({lat: lat, lng: lng}, {
      icon: route_manager.obstacleIcon,
      draggable: true
    });

    marker.on('dragend', function (e) {
      console.log("e.latlng", e);
      $('.obstacle-form input[name=lat]').val(e.target._latlng.lat);
      $('.obstacle-form input[name=lng]').val(e.target._latlng.lng);
      route_map.getAddressByCoords({lat: e.target._latlng.lat, lng: e.target._latlng.lng}).then(function (result) {
        $('.obstacle-form input[name=address]').val(result);
      });

      Obstacle.try(e.target._latlng.lat, e.target._latlng.lng)
        .then(function (data) {
          console.log("TRY data\n", data);
          route_manager.clearRoute();
          route_manager.parseRouteData(data);
          route_manager.displayLines('#ff3333');
        });
    });

    marker.addTo(route_map.map);
    route_manager.obstacleMarker = marker;
    route_map.map.setView({lat: lat, lng: lng}, 22);

    $('.obstacle-form input[name=lat]').val(lat);
    $('.obstacle-form input[name=lng]').val(lng);
    route_map.getAddressByCoords({lat: lat, lng: lng}).then(function (result) {
      $('.obstacle-form input[name=address]').val(result);
    });
  }
};