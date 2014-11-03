console.log('\'Allo \'Allo!');

var poly;
var map;
var pins = [];
var polys = [];
var nodes = {
    '1': [],  // pedestrian
    '2': [],  // transport
    '3': []   // road
};

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
}
google.maps.event.addDomListener(window, 'load', initialize);

var placeMarker = function(location) {
    var marker = new google.maps.Marker({
        position: location,
        map: map
    });


    if (pins.length >= 2) {
        for (i=0; i<pins.length; i++) {
            pins[i].setMap(null);
        }
        pins = [];
        //pins.push(marker);
    }

    pins.push(marker);

    var p = $('<div/>').addClass('point');
    var lat = $('<span/>').addClass('lat').html(location.lat());
    var lng = $('<span/>').addClass('lng').html(location.lng());
    p.append(lat);
    p.append(lng);
    $('.points').append(p);
}

var pushPoint = function(point_data) {

    var point_type = point_data[2];

    var numOfPolylines = nodes[point_type].length;
    var polyLength = nodes[point_type][0].length;

    var point = new google.maps.LatLng(point_data[1], point_data[0]);

    if (last_type != point_type || last_type == -1) {
        // Push point coords to same array of polyline points' coords
        nodes[point_type][numOfPolylines].push(point);
    } else {
        // Push point coords to new array of polyline points' coords
        nodes[point_type][numOfPolylines-1].push(point);
        nodes[point_type][numOfPolylines-1].push(point);
    }

    last_type = point_type;
}

var drawLine0 = function(p1_data, p2_data) {
    var point_type = p1_data[2];
    var lon1 = p1_data[0];
    var lat1 = p1_data[1];

    var lon2 = p2_data[0];
    var lat2 = p2_data[1];

    var color = '';


    if (typeof point_type == "undefined") {
        color = '#66ff66';
    }
    else if (point_type.trim() == '1')
        color = '#66ff66';
    else if (point_type.trim() == '2')
        color = '#000000';
    else if (point_type.trim() == '3')
        color = '#3366ff';

    var p1 = new google.maps.LatLng(lat1, lon1);
    var p2 = new google.maps.LatLng(lat2, lon2);

    var _polys = [p1, p2];

    var poly = new google.maps.Polyline({
        path: _polys,
        geodesic: false,
        strokeColor: color,
        strokeOpacity: 1,
        strokeWight: 2
    });
    polys.push(poly);
    poly.setMap(map);

}

var drawPolys = function(polysArray, polyType) {
    var arrLen = polysArray.length;
    var color = '';

    if (polyType == '1')
        color = '#66ff66';
    if (polyType == '2')
        color = '#ffcc00';
    if (polyType == '3')
        color = '#3366ff';

    for (var i = arrLen - 1; i >= 0; i--) {
        var poly = new google.maps.Polyline({
            path: polysArray[i],
            geodesic: false,
            strokeColor: color,
            strokeOpacity: 1,
            strokeWight: 2
        });
        polys.push(poly);
        poly.setMap(map);
    };
};

var handleError = function() {
    alert('РџСЂРѕРёР·РѕС€Р»Р° РѕС€РёР±РєР° РЅР° СЃРµСЂРІРµСЂРµ. РјР°СЂС€СЂСѓС‚ РјРѕР¶РµС‚ Р±С‹С‚СЊ РЅРµ С‚РѕС‡РЅС‹Рј');
};

$(document).ready(function() {

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
                var correct_points = null;

//                for (var i = points.length - 1; i >= 0; i--) {
//                    if (indexOf('error', points[i]) >= 0) {
//                        handleError();
//                        correct_points = points.splice(i, 1);
//                    }
//                };

                for (var i=0; i<polys.length; i++) {
                    polys[i].setMap(null);
                }

                for (var i = 0; i < points.length - 1; i++) {
                    if (points[i].trim() == "") continue;
                    if (points[i].indexOf("dist:") >= 0) {
                        $('.points').append($('<p/>').html(points[i]));
                    }
                    //var point_data = points[i].split(' ');
                    drawLine0(points[i].split(' '), points[i+1].split(' '));
                    //pushPoint(point_data);
                };

                console.log(points);

//                poly = new google.maps.Polyline({
//                    path: nodes,
//                    geodesic: false,
//                    strokeColor: '#f99',
//                    strokeOpacity: 1,
//                    strokeWight: 2
//                });
//
//                poly.setMap(null);
//                poly.setMap(map);
            }
        });
    });

    // Search
    $('.route-points a').click(function(e) {
        e.preventDefault();

        $(this).parent().addClass('active');
    });

    $('.tools form').submit(function(e) {
        e.preventDefault();

        var query = $(this).children('input').val();

        query = query.replace(/ /g, "+");

        var result = {
            lat: null,
            lng: null
        };

        $.ajax({
            url: "https://maps.googleapis.com/maps/api/geocode/json?address=" + query + "&key=AIzaSyBKWD-hVZscJYssrnOe6h1bKcZyb1su56w",
            success: function(msg) {
                // console.log(msg.results[0].geometry.location);
                result.lat = msg.results[0].geometry.location.lat;
                result.lng = msg.results[0].geometry.location.lng;
                console.log(result);

                var coords = new google.maps.LatLng(result.lat, result.lng);

                placeMarker(coords);
            }
        });
    });

    $('.add-point').click(function(e) {
        console.log('add point');
        if("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(function(position) {
                var url_string = '';
                url_string += position.coords.latitude + '&';
                url_string += position.coords.longitude;

                console.log(url_string);

                $.ajax({
                    url: 'http://localhost:8080/navigator/obstavle?' + url_string,
                    dataType: 'text',
                    success: function(msg) {
                        if (msg == "error")
                            alert('РџСЂРѕРёР·РѕС€Р»Р° РѕС€РёР±РєР° РїСЂРё РґРѕР±Р°РІР»РµРЅРёРё С‚РѕС‡РєРё')
                    }
                });
            });
        } else {
            alert('Рљ СЃРѕР¶Р°Р»РµРЅРёСЋ РіРµРѕРґР°РЅРЅС‹Рµ РІ РґР°РЅС‹Р№ РјРѕРјРµРЅ РЅРµ РґРѕСЃС‚СѓРїРЅС‹.')
        }
    });
});