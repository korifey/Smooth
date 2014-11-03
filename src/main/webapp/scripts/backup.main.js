console.log('\'Allo \'Allo!');

var poly;
var map;

var routePlan = '59.57 30.29\n59.58 39.29\n59.50 39\n-27.46758 153.027892';

function initialize() {
	var mapOptions = {
	  center: { lat: 59.94, lng: 30.35},
	  zoom: 12,
	  zoomControl: false,
	  panControl: false,
	  rotateControl: false,
	  streetViewControl: false,
	  noClear: true
	};
	map = new google.maps.Map(document.getElementById('map-canvas'),
	    mapOptions);

	google.maps.event.addListener(map, 'click', function(event) {
		placeMarker(event.latLng);
	});

	var placeMarker = function(location) {
		var marker = new google.maps.Marker({
			position: location,
			map: map
		});

		var p = $('<div/>').addClass('point');
		var lat = $('<span/>').addClass('lat').html(location.lat());
		var lng = $('<span/>').addClass('lng').html(location.lng());
		p.append(lat);
		p.append(lng);
		$('.points').append(p);
	}
}
google.maps.event.addDomListener(window, 'load', initialize);




$(window).ready(function() {
	
	$('.submit').click(function() {
		var points = $('.point');
		var i = 1;
		var url_string = '';
		points.each(function() {
			if (i < 3) {
				var t = $(this);

				url_string += t.children('.lng').html() + '&';
				url_string += t.children('.lat').html();

				if (i < 2)
					url_string += '&'
			};
			i++;
		});

		console.log(url_string, points.length);

		$.ajax({
			url: "http://localhost:8080/navigator/path?" + url_string,
			dataType: 'text',
			success: function(msg) {
				var points = msg.split('\n');
				var nodes =[];

				for (var i = points.length - 1; i >= 0; i--) {
					var coords = points[i].split(' ');
                    if (coords.length != 2) continue;
					nodes.push(new google.maps.LatLng(coords[1].trim(), coords[0].trim()));
				};

//                nodes.push(new google.maps.LatLng("59.935838449864875", "30.317888259887695"));
//                nodes.push(new google.maps.LatLng("59.937300368548726", "30.33848762512207"));

				console.log(points);

				poly = new google.maps.Polyline({
					path: nodes,
					geodesic: false,
					strokeColor: '#f99',
					strokeOpacity: 1,
					strokeWight: 2
				});

				poly.setMap(null);
				poly.setMap(map);
			}
		});
	});
});