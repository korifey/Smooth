/**
 * Created by kascode on 29.10.14.
 */

var map;
var pins = [];
var obstacle_circles = [];
var obstacle_markers = [];
var polys = [];
var new_polys = {
    "pedestrian": [],
    "road": [],
    "transport": []
};
var lastPointType = null;
var busPins = [];
var walkPins = [];
var positionPin;
var positionIcon;
var busIcon;
var obstacleIcon;

var workingArea = [[59.94486691748142, 30.304434299468994], [59.93431196599729, 30.335376262664795]];

//var routePlan = '59.57 30.29\n59.58 39.29\n59.50 39\n-27.46758 153.027892';
//var dummyResponse = "30.3333029000 59.9399723000 1,30.3331847000 59.9400771000 1,30.3319002000 59.9401990000 1,30.3316895000 59.9402190000 1,30.3316385000 59.9402126000 1,30.3315559000 59.9401959000 1,30.3314069000 59.9401534000 1,30.3307705000 59.9399132000 1,30.3306092000 59.9398830000 1,30.3304466000 59.9398747000 1,30.3302803000 59.9398898000 1,30.3300224000 59.9399132000 1,30.3297349000 59.9399392000 1,30.3296320000 59.9399540000 1,30.3296017000 59.9399059000 1,30.3295113000 59.9398282000 1,30.3294215000 59.9397885000 1,30.3292846000 59.9397477000 1,30.3291124000 59.9397204000 1,30.3289008000 59.9397111000 1,30.3287414000 59.9397095000 1,30.3285492000 59.9397140000 1,30.3284303000 59.9396882000 1,30.3283966000 59.9396078000 1,30.3278817000 59.9383744000 1,30.3278656000 59.9383411000 2,30.3274199000 59.9372025000 1,30.3269077000 59.9372528000 2,30.3262097000 59.9355299000 1,30.3259972000 59.9355560000 1,30.3259522000 59.9354647000 1,30.3258965000 59.9353514000 1,30.3258557000 59.9352685000 1,30.3256738000 59.9352910000 1,30.3247505000 59.9354050000 1,30.3246755000 59.9354143000 3,30.3177361000 59.9363138000 3,30.3135788000 59.9368024000 1,30.3127726000 59.9368971000 1,30.3119859000 59.9369896000 1,30.3119412000 59.9369933000 1,30.3118959000 59.9369943000 1,30.3118507000 59.9369923000 1,30.3118064000 59.9369875000 1,30.3117636000 59.9369800000 1,30.3117231000 59.9369698000 1,30.3116855000 59.9369571000 1,30.3116331000 59.9369369000 1,30.3115894000 59.9369654000 1,30.3115292000 59.9370046000 1,30.3114473000 59.9370580000 1,30.3114254000 59.9370722000 1,30.3114090000 59.9370829000 1,30.3113653000 59.9371114000 1,30.3113435000 59.9371256000 1,30.3112970000 59.9371076000 1,30.3112342000 59.9371554000 1,30.3098388000 59.9366283000 1,30.3095680000 59.9365260000 1,30.3084397000 59.9360999000 1,30.3076807000 59.9358132000 1,30.3074341000 59.9359796000 1,30.3073902000 59.9359711000 1,30.3073432000 59.9359690000 1,30.3072970000 59.9359736000 1,30.3072551000 59.9359843000 1,30.3072207000 59.9360005000 1,30.3071966000 59.9360207000 1,30.3070742000 59.9359778000 1,30.3061305000 59.9356470000,dist: 1234 326 743";
//var dummyLocation = {
//    "lat": 59.93833227235004,
//    "lng": 30.32299518585205
//};

function initializeMap() {

    map = L.map('map-canvas', {
        center: [59.9398893, 30.3191246],
        zoom: 15
    });

    L.rectangle(workingArea, {
        color: "#9BF986",
        fillOpacity: 0,
        lineJoin: 'round'
    }).addTo(map);

//    L.tileLayer('http://a.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
//        maxZoom: 18
//    }).addTo(map);
    var hdpi_string= '';
    if (window.devicePixelRatio > 1.5) {
        hdpi_string = '@2x';
    }

    L.tileLayer('https://api.tiles.mapbox.com/v4/kascode.k35co93d/{z}/{x}/{y}' + hdpi_string + '.png?access_token=pk.eyJ1Ijoia2FzY29kZSIsImEiOiJoeXp2cENzIn0.HYtI1Pj7v372xyxg5kz3Kg#11', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
        maxZoom: 18
    }).addTo(map);

    map.on('click', function(e) {
        var coords = e.latlng;

        var obstacleAdd = false;

        console.log(coords);

        if ($('#obstacleToggle').prop('checked'))
            obstacleAdd = true;

        if (obstacleAdd) {
            var url_string = '';
            url_string += coords.lng + '&';
            url_string += coords.lat;

            console.log(url_string);

            $.ajax({
                type: 'post',
                url: window.location.origin + window.location.pathname+'obstacle/add?' + url_string,
                dataType: 'text',
                success: function(msg) {
                    if (msg == "error")
                        handleError('Ошибка отправки информации о препятствии');
                    else {
                        $.ajax({
                            url: window.location.origin + window.location.pathname+'obstacle/all',
                            dataType: 'text',
                            success: function(data) {
                                var obs = data.split('\n');

                                placeObstacles(obs);
                                getObstacleList(obs);
                            }
                        });
                    }
                }
            });
        } else {
            placeMarker(coords);
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
}

//window.addEventListener("load", initializeMap);

var placeMarker = function(location) {

    var workingBounds = L.bounds(L.point(workingArea[0][0], workingArea[0][1]), L.point(workingArea[1][0], workingArea[1][1]));

    if (workingBounds.contains(L.point(location.lat, location.lng))) {
        var marker = L.marker(location);
        marker.addTo(map);


        if (pins.length >= 2) {
            for (var i = 0; i < pins.length; i++) {
                map.removeLayer(pins[i]);
            }
            pins = [];
        }

        pins.push(marker);
    } else {
        handleError('Point is out of working area');
    }
};

function placeObstacles(obs) {
    for (var i = 0; i < obstacle_circles.length; i++) {
        map.removeLayer(obstacle_circles[i]);
        map.removeLayer(obstacle_markers[i]);
    }
    for (var i = 0; i < obs.length - 1; i++) {
        console.log(obs[i]);
        var obsData = obs[i].split(' ');

        var obsCircle = L.circle([obsData[2], obsData[1]], 10, {
            fillColor: '#e00032',
            fillOpacity: 0.15,
            color: '#e00032',
            opacity: 0.08
        }).addTo(map);

        var obsMarker = L.marker([obsData[2], obsData[1]], {
            icon: obstacleIcon
        }).addTo(map);

        obstacle_circles.push(obsCircle);
        obstacle_markers.push(obsMarker);
    }
}

var drawLine = function(p1_data, p2_data) {
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

    var p1 = new L.LatLng(lat1, lon1);
    var p2 = new L.LatLng(lat2, lon2);

    var poly = L.polyline([p1, p2], {
        color: '#fff',
        weight: 10,
        opacity: 0.8
    });

    poly.addTo(map);

    var polyone = L.polyline([p1, p2], {
        color: color,
        weight: 5,
        opacity: 1
    });

    polyone.addTo(map);

    polys.push(poly);
};

var handleError = function(errorText) {
    alert('Error: ' + errorText);
};

var removePolylines = function (cb) {
    var polysLength = polys.length;
    var busPinsLength = busPins.length;
    var walkPinsLength = walkPins.length;

    for (var i = 0; i < polysLength; i++) {
        map.removeLayer(polys[i]);
    }

    for (i = 0; i < busPinsLength; i++) {
        map.removeLayer(busPins[i]);
    }

    for (var i = 0; i < walkPinsLength; i++) {
        map.removeLayer(walkPins[i]);
    }

    polys = [];
    new_polys.pedestrian = [];
    new_polys.transport = [];
    new_polys.road =[];
    lastPointType = null;
    busPins = [];

    if (typeof cb != 'undefined') {
        cb(arguments[1]); // Calling callback function with argument that must be 2nd argument in removePolylines call
    }
};

function drawLineLong() {
    // Draw pedestrian lines
    for (var i = 0; i < new_polys.pedestrian.length; i++) {
        // outline
        var poly = L.polyline(new_polys.pedestrian[i], {
            color: '#2baf2b',
            weight: 6,
            opacity: 1,
            lineJoin: 'round',
            lineCap: 'round'
        });

        poly.addTo(map);
        polys.push(poly);

        // fill
        var polyone = L.polyline(new_polys.pedestrian[i], {
            color: "#12c700",
            weight: 3,
            opacity: 1,
            lineJoin: 'round',
            lineCap: 'round'
        });

        polyone.addTo(map);
        polys.push(polyone);
    }

    // Draw road lines
    for (i = 0; i < new_polys.road.length; i++) {
        // outline
        var poly = L.polyline(new_polys.road[i], {
            color: '#bd50f9',
            weight: 7,
            opacity: 1,
            lineJoin: 'round',
            lineCap: 'round'
        });

        poly.addTo(map);
        polys.push(poly);

        // fill
        var polyone = L.polyline(new_polys.road[i], {
            color: "#dd701a",
            weight: 4,
            opacity: 1,
            lineJoin: 'round',
            lineCap: 'round'
        });

        polyone.addTo(map);
        polys.push(polyone);
    }

    // Draw transport lines
    for (i = 0; i < new_polys.transport.length; i++) {
        // outline
        var poly = L.polyline(new_polys.transport[i], {
            color: '#0288d1',
            weight: 8,
            opacity: 1,
            lineJoin: 'round',
            lineCap: 'round'
        });

        poly.addTo(map);
        polys.push(poly);

        // fill
        var polyone = L.polyline(new_polys.transport[i], {
            color: "#03a9f4",
            weight: 6,
            opacity: 1,
            lineJoin: 'round',
            lineCap: 'round'
        });

        polyone.addTo(map);
        polys.push(polyone);
    }
}
function addBusPin(lat, lng) {
    var pin = L.marker([lat, lng], {
        icon: busIcon
    }).addTo(map);

    busPins.push(pin);
}
function addWalkPin(lat, lng) {
    var pin = L.marker([lat, lng], {
        icon: walkIcon
    }).addTo(map);

    walkPins.push(pin);
}
var formPolylines = function (points) {
    for (var i = 0; i < points.length - 1; i++) {
        if (points[i].trim() == "" || points[i+1].trim() == "") continue;
//        if (points[i+1].indexOf("dist:") >= 0 ) {
//            $('.points').append($('<p/>').html(points[i+1]));
//            continue;
//        }
        if (points[i].indexOf("error") >= 0 || points[i+1].indexOf("error") >= 0) {
            continue;
        }

        console.log(points[i] + '\n' + points[i+1]);

        var point1 = points[i].split(' ');
        var point2 = points[i + 1].split(' ');

//        drawLine(points[i].split(' '), points[i + 1].split(' '));

        if (point1[2] != lastPointType) {  // start new line

            lastPointType = point1[2];

            if (point1[2] == 1 || point1[2] == 2) {  // line is pedestrian
                var array_length = new_polys.pedestrian.length;

                new_polys.pedestrian[array_length] = [L.latLng(point1[1], point1[0]), L.latLng(point2[1], point2[0])];

                if (point1[2] == 1)
                    addWalkPin(point1[1], point1[0]);
                continue;
            }

//            if (point1[2] == 2) {  // line is road
//                var array_length = new_polys.road.length;
//
//                new_polys.road[array_length] = [L.latLng(point1[1], point1[0]), L.latLng(point2[1], point2[0])];
//                continue;
//            }

            if (point1[2] == 3) {  // line is transport
                var array_length = new_polys.transport.length;
                new_polys.transport[array_length] = [L.latLng(point1[1], point1[0]), L.latLng(point2[1], point2[0])];

                addBusPin(point1[1], point1[0]);
            }
        } else { // continue existing line

            if (point1[2] == 1 || point1[2] == 2) {  // line is pedestrian
                var array_length = new_polys.pedestrian.length;
                new_polys.pedestrian[array_length - 1].push(L.latLng(point2[1], point2[0]));
                continue;
            }

//            if (point1[2] == 2) {  // line is road
//                var array_length = new_polys.road.length;
//                new_polys.road[array_length - 1].push(L.latLng(point2[1], point2[0]));
//                continue;
//            }

            if (point1[2] == 3 ) {  // line is transport
                var array_length = new_polys.transport.length;
                new_polys.transport[array_length - 1].push(L.latLng(point2[1], point2[0]));
            }
        }
    }

    drawLineLong();
};

function displayDistance(walk, road, transport) {
    var $dist_container = $('.distance');

    // Clear dists
    $dist_container.find('.value').empty();

    $dist_container.find('.walk .value').text((walk + road) + 'м');
    $dist_container.find('.transport .value').text(transport + 'м');

    $dist_container.css('display', 'block');
}

var handleRouteResponse = function(msg) {

    var points = [];
    var dist;
    var lines = msg.split('\n');

    for (var i = 0; i < lines.length; i++) {
        if (lines[i].indexOf('dist:') >= 0) {
            var distParts = lines[i].split(' ');

            displayDistance(parseInt(distParts[1]), parseInt(distParts[2]), parseInt(distParts[3]));
            continue;
        }
        points.push(lines[i]);
    }
//    var points = msg.split(',');

    console.log('points: ' + points);

    removePolylines(formPolylines, points.reverse());
};

function printObstacleList(obs) {
    var obsLen = obs.length;

    $('.obstacle-list p').remove();

    for (var i = 0; i < obsLen; i++) {
        if (obs[i] != '') {
            var obsData = obs[i].split(' ');
            var p = $('<p/>');
            var btn = $('<button/>').addClass('remove-obstacle')
                .attr('obstacle-id', obsData[0])
                .text('x');
            p.text(obs[i]);
            $('.obstacle-list').append(p);
            p.append(btn);
        }
    }

    $('.remove-obstacle').click(function(e) {
        e.preventDefault();

        removeObstacle($(this));
    });
}
function getObstacleList() {
    $.ajax({
        type: 'get',
        url: window.location.origin + window.location.pathname + 'obstacle/all',
        dataType: 'text',
        success: function (data) {
            var obs = data.split('\n');

            printObstacleList(obs);

            placeObstacles(obs);
        }
    });
}
function removeObstacle(el) {
    $.ajax({
        type: 'get',
        url: window.location.origin + window.location.pathname + 'obstacle/remove?id=' + el.attr('obstacle-id'),
        dataType: 'text',
        success: function (data) {
            console.log(data);
            if (data.indexOf('error') >= 0)
                handleError(data);
            else
                getObstacleList();
        }
    });
}
function initializeInterface() {
    var menuHeight = 0;
    $('.menu-item').each(function() {
        menuHeight += $(this).outerHeight();
    });
    $('.menu-btn').click(function(e)  {
        e.preventDefault();

//        if ($('.header').hasClass('opened')) {
//            $('.menu').transition({
//                maxHeight: 0
//            }, 500, 'cubic-bezier(.2,.27,.22,1)');
//        } else {
//            $('.menu').transition({
//                maxHeight: menuHeight
//            }, 500, 'cubic-bezier(.2,.27,.22,1)');
//        }

        $('.header').toggleClass('opened');
    });

    if (window.location.hash.indexOf('#test') >= 0) {
        $('.obstacle-list').css('display', 'block');
    }

    $('.tools-list button').click(function(e) {
        e.preventDefault();

        var $t = $(this);
        var $routing_div = $('.routing');
        var $obstacle_div = $('.obstacle');

        if ($t.hasClass('open-routing')) {
            if ($routing_div.hasClass('opened')) {
                $routing_div.transition({
                    bottom: '-100%'
                }, 500, 'cubic-bezier(.2,.27,.22,1)')
            } else {
                if ($obstacle_div.hasClass('opened')) {
                    $obstacle_div.transition({
                        bottom: '-100%'
                    }, 500, 'cubic-bezier(.2,.27,.22,1)', function() {
                        $routing_div.transition({
                            bottom: 0
                        }, 500, 'cubic-bezier(.2,.27,.22,1)')
                    });
                    $obstacle_div.toggleClass('opened');
                } else {
                    $routing_div.transition({
                        bottom: 0
                    }, 500, 'cubic-bezier(.2,.27,.22,1)')
                }
            }

            $routing_div.toggleClass('opened');
        }

        if ($t.hasClass('open-obstacle')) {
            if ($obstacle_div.hasClass('opened')) {
                $obstacle_div.transition({
                    bottom: '-100%'
                }, 500, 'cubic-bezier(.2,.27,.22,1)')
            } else {
                if ($routing_div.hasClass('opened')) {
                    $routing_div.transition({
                        bottom: '-100%'
                    }, 500, 'cubic-bezier(.2,.27,.22,1)', function() {
                        $obstacle_div.transition({
                            bottom: 0
                        }, 500, 'cubic-bezier(.2,.27,.22,1)')
                    });
                    $routing_div.toggleClass('opened');
                } else {
                    $obstacle_div.transition({
                        bottom: 0
                    }, 500, 'cubic-bezier(.2,.27,.22,1)')
                }
            }

            $obstacle_div.toggleClass('opened');
        }
    });

    $('.close').click(function(e) {
        e.preventDefault();

        var $p = $(this).parent();
        if ($p.hasClass('routing')) {
            $p.transition({
                bottom: '-100%'
            }, 500, 'cubic-bezier(.2,.27,.22,1)');

            $p.toggleClass('opened');
        }

        if ($p.hasClass('obstacle')) {
            $p.transition({
                bottom: '-100%'
            }, 500, 'cubic-bezier(.2,.27,.22,1)');
            $p.find('.obstacle-send-success').transition({
                top: '100%'
            }, 500, 'cubic-bezier(.2,.27,.22,1)');

            $p.toggleClass('opened');
        }

        if ($p.hasClass('obstacle-list')) {
            $p.transition({
                marginLeft: '-200pt'
            }, 500, 'cubic-bezier(.2,.27,.22,1)');
        }

        if ($p.hasClass('about-content')) {
            $('.header').removeClass('about');
            $('.about-content').removeClass('opened');
        }
    });

    $('.get-route').click(function(e) {
        e.preventDefault();
        var url_string = '';

        for (var i = 0; i < pins.length; i++) {
            var lat = pins[i].getLatLng().lat;
            var lng = pins[i].getLatLng().lng;

            url_string += lng + '&' + lat;

            if (i == 0) {
                url_string += '&';
            }
        }

        var request_path = window.location.origin + window.location.pathname+"path?" + url_string;
        console.log(request_path);

        $.ajax({
            url: request_path,
            dataType: 'text',
            success: function(msg) {
                handleRouteResponse(msg);
            }
        });
    });

    $('.send-obstacle').click(function(e) {
        e.preventDefault();
        console.log('send obstacle');
        if("geolocation" in navigator) {
            console.log('geo');
            navigator.geolocation.getCurrentPosition(function(position) {
                var url_string = '';
                url_string += position.coords.longitude + '&';
                url_string += position.coords.latitude;

                console.log(url_string);

                $.ajax({
                    type: 'post',
                    url: window.location.origin + window.location.pathname+'obstacle/add?' + url_string,
                    dataType: 'text',
                    success: function(msg) {
                        if (msg == "error")
                            handleError('Ошибка отправки информации о препятствии');
                        else {
                            $('.obstacle-send-success').transition({
                                top: 0
                            }, 500, 'cubic-bezier(.2,.27,.22,1)');

                            getObstacleList();
                        }
                    }
                });
            });
        } else {
            handleError("Невозможно получить информацию о текущем положении")
        }
    });

    $('.get-obstacle-list').click(function(e) {
        e.preventDefault();

        getObstacleList();
    });

    // Header Menu
    $('.open-about').click(function(e) {
        e.preventDefault();

        var $about_container = $('.about-content');

        if (!$about_container.hasClass('opened')) {
            $about_container.addClass('opened');
            $('.header').removeClass('opened');
//            $about_container.transition({
//                marginTop: '0'
//            }, 500, 'cubic-bezier(.2,.27,.22,1)');
//            $('.header').addClass('about').removeClass('opened');
//            $('.menu').transition({
//                maxHeight: 0
//            }, 10, 'cubic-bezier(.2,.27,.22,1)');
        }
    });
}
function setMapArea() {
//    var windowHeight = window.innerHeight;
//    var header = $('.header');
//    var tools = $('.tools');
//    var subm = $('.submit');
//    console.log(header.outerHeight(), tools.outerHeight());
//    var mapHeight = windowHeight - header.outerHeight() - tools.outerHeight() - subm.outerHeight();
//
////    $('#map-canvas').height(windowHeight).css('top', header.outerHeight());
//
//    tools.css('top', mapHeight + header.outerHeight());
//    subm.css('top', mapHeight + header.outerHeight() + tools.outerHeight());
    initializeMap();
    initializeInterface();
}

function setPositionPin(latitude, longitude) {
    if (typeof positionPin != 'undefined')
        map.removeLayer(positionPin);

    positionPin = L.marker([latitude, longitude], {
        icon: positionIcon
    }).addTo(map);
}
function watchSuccess(position) {
    setPositionPin(position.coords.latitude, position.coords.longitude);
}
function watchError() {
    console.error("Position watch error");
}
$(document).ready(function() {

    setMapArea();

    // For testing purpose
//    $('.submit').click(function(e) {
//        e.preventDefault();
//        handleRouteResponse(dummyResponse);
//    });


    // Search
    $('.route-points a').click(function(e) {
        e.preventDefault();

        $(this).parent().addClass('active');
    });

    $('.tools form').submit(function(e) {
        e.preventDefault();

        var query = $(this).find('input').val();

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

                var coords = new L.LatLng(result.lat, result.lng);

                placeMarker(coords);
            }
        });
    });

    if ("geolocation" in navigator) {
        var positionWatch = navigator.geolocation.watchPosition(watchSuccess, watchError);
    }

});