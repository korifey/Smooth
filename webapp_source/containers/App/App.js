import React, { Component } from 'react';
import Map from '../../components/Map/Map';
import ModeToggle from '../../components/ModeToggle/ModeToggle';
import RouteForm from '../../components/RouteForm/RouteForm';
import ObstacleForm from '../../components/ObstacleForm/ObstacleForm';
import ChoicesTooltip from '../../components/ChoiceTooltip/ChoiceTooltip';
import Store from '../../store/store';
import * as Actions from '../../actions/Actions';
//import SomeApp from './SomeApp';
// import { createStore, combineReducers } from 'redux';
// import { Provider } from 'react-redux';
// import * as reducers from '../reducers';

let Promise = require('es6-promise').Promise;

// const reducer = combineReducers(reducers);
// const store = createStore(reducer);
require('./App.css');
require('leaflet');
require('leaflet_css');
let marker_icon_img = require('../../components/Map/images/marker-icon.png');
const start_marker_icon = L.divIcon({
  iconSize: [21, 21],
  iconAnchor: [11, 11],
  className: 'RoundPin RouteIcon',
  html: '<div>S</div>'
});
const finish_marker_icon = L.divIcon({
  iconSize: [21, 21],
  iconAnchor: [11, 11],
  className: 'RoundPin RouteIcon',
  html: '<div>F</div>'
});

const obstacle_marker_icon = L.divIcon({
  iconSize: [21, 21],
  iconAnchor: [11, 11],
  className: 'RoundPin ObstacleIcon',
  html: '<div>!</div>'
});

let homer_marker_icon_img = require('../../components/Map/images/homers.png');

let markerIcon = L.icon({
  iconUrl: marker_icon_img,
  iconSize: [25, 41],
  iconAnchor: [13, 41]
});

let homerIcon = L.icon({
  iconUrl: homer_marker_icon_img,
  iconSize: [24, 24]
});

export default class App extends Component {
  constructor() {
    super();
    this.state = Store.getState();
  }

  componentDidMount() {
    this.unsubscribe = Store.subscribe(this.updateApp.bind(this));
  }

  updateApp() {
    this.forceUpdate();
    this.setState(Store.getState());
    this.redrawMap();
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  redrawMap() {
    if (this.state.routeState.route.length && this.state.mapState.polylines.length === 0) {
      console.log("redrawMap", this.state.routeState.route);
      let polylines = [];

      for (let i = 0; i < this.state.routeState.route.length; i++) {
        let polyline = this.state.routeState.route[i].polyline;
        let type = this.state.routeState.route[i].type;
        let color;

        switch (type) {
          case '1':
            color = '#64DD17';
            break;
          case '2':
            color = '#FF5252';
            break;
          case '3':
            color = '#3F51B5';
            break;
        }

        let outline = L.polyline(polyline, {
          stroke: true,
          color: '#fff',
          weight: 7,
          opacity: 1
        });
        let shadow = L.polyline(polyline, {
          stroke: true,
          color: '#333',
          weight: 8,
          opacity: 0.5
        });
        let line = L.polyline(polyline, {
          stroke: true,
          color: color,
          weight: 5,
          opacity: 1
        });
        this.state.mapState.mapObject.addLayer(shadow);
        this.state.mapState.mapObject.addLayer(outline);
        this.state.mapState.mapObject.addLayer(line);
        polylines.push(shadow);
        polylines.push(outline);
        polylines.push(line);
      }

      let markers = [];

      //console.log("Drawing route markers");
      //for (let i = 0; i < this.state.routeState.route.length; i++) {
      //  var point = this.state.routeState.route[i];
      //  console.log("draw marker " + i, point);
        //markers[i] = L.marker(point, {
        //  icon: homerIcon,
        //  title: i + ': ' + point.lat + ' ' + point.lng
        //});
        //markers[i].addTo(this.state.mapState.mapObject);
      //}
      //console.log("Done with markers");

      //Store.dispatch(Actions.setRouteOnMap(r, markers));
      Store.dispatch(Actions.setRoutePolylines(polylines));
      Store.dispatch(Actions.setIsFetchingRoute(false));
    }

    //console.log("redrawMap", this.state.routeState.route.length, this.state.mapState.route);

    if (!this.state.routeState.route.length && this.state.mapState.polylines.length) {
      clearMap.bind(this)();
    }
  }

  mapDidMount() {
    let map = L.map('map').setView([this.state.mapState.lat, this.state.mapState.lng], 16);
    L.tileLayer('https://api.tiles.mapbox.com/v4/kascode.k35co93d/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoia2FzY29kZSIsImEiOiJoeXp2cENzIn0.HYtI1Pj7v372xyxg5kz3Kg#11', {
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
      maxZoom: 19
    }).addTo(map);

    map.on('click', this.onMapClick.bind(this));

    Store.dispatch(Actions.setMap(map));
    this.forceUpdate();
    this.updateApp.bind(this)();
  }

  /**
   * Map click handler
   * @param event {latlng, layerPoint, containerPoint, originalEvent}
   */
  onMapClick(event) {
    console.log("Event latlng:", event.latlng);
    let latLng = Object.assign({}, event.latlng);
    let xoffset = event.containerPoint.x;
    let yoffset = event.containerPoint.y;
    let latlng = event.latlng;

    switch(this.state.uiState.uiMode) {
      case 'MODE_CHOOSE':
        Store.dispatch(Actions.clearRoute());
        clearMap.bind(this)();
        Store.dispatch(Actions.setTooltipPosition(xoffset, yoffset));
        Store.dispatch(Actions.setTooltipCoords(latlng.lat, latLng.lng));
        Store.dispatch(Actions.showTooltip());
        break;
      case 'ROUTING':
        Store.dispatch(Actions.setTooltipPosition(xoffset, yoffset));
        Store.dispatch(Actions.setTooltipCoords(latlng.lat, latLng.lng));
        Store.dispatch(Actions.showTooltip());
        break;
      case 'OBSTACLE':
        if (this.state.obstaclesState.obstaclePin) {
          this.state.mapState.mapObject.removeLayer(this.state.obstaclesState.obstaclePin);
        }

        Store.dispatch(Actions.clearRoute());
        clearMap.bind(this)();

        Store.dispatch(Actions.setObstaclePhotoState('NO'));
        Store.dispatch(Actions.setObstacleFormState('BASIC'));
        Store.dispatch(Actions.disableObstacleForm());

        Store.dispatch(Actions.setTooltipPosition(xoffset, yoffset));
        Store.dispatch(Actions.setTooltipCoords(latlng.lat, latLng.lng));
        Store.dispatch(Actions.showTooltip());

        break;

      //case 'ROUTING':
      //  if (this.state.routeState.start.length && this.state.routeState.finish.length) {
      //    // Clear route if there is one
      //    //if (this.state.routeState.route.length) {
      //      clearMap.bind(this)();
      //    //}
      //  } else if (!this.state.routeState.start.length) {
      //    let pin = L.marker(event.latlng, {
      //      icon: start_marker_icon
      //    });
      //
      //    Store.dispatch(Actions.setStartRoutePoint(latLng));
      //    Store.dispatch(Actions.setStartRoutePin(pin));
      //    this.state.mapState.startPin.addTo(this.state.mapState.mapObject);
      //
      //  } else {
      //    let pin = L.marker(latLng, {
      //      icon: finish_marker_icon
      //    });
      //
      //    Store.dispatch(Actions.setFinishRoutePoint(latLng));
      //    Store.dispatch(Actions.setFinishRoutePin(pin));
      //    this.state.mapState.finishPin.addTo(this.state.mapState.mapObject);
      //
      //  }
      //  break;
    }
  }

  onStartPointClick() {
    Store.dispatch(Actions.setUiMode('ROUTING'));

    let latLng = Object.assign({}, {
      lat: this.state.uiState.tooltipLat,
      lng: this.state.uiState.tooltipLng
    });

    let pin = L.marker(latLng, {
      icon: start_marker_icon
    });

    Store.dispatch(Actions.setStartRoutePoint(latLng));
    Store.dispatch(Actions.setStartRoutePin(pin));
    Store.dispatch(Actions.hideTooltip());
    pin.addTo(this.state.mapState.mapObject);
  }

  onFinishPointClick() {
    Store.dispatch(Actions.setUiMode('MODE_CHOOSE'));

    let latLng = Object.assign({}, {
      lat: this.state.uiState.tooltipLat,
      lng: this.state.uiState.tooltipLng
    });

    let pin = L.marker(latLng, {
      icon: finish_marker_icon
    });

    Store.dispatch(Actions.setFinishRoutePoint(latLng));
    Store.dispatch(Actions.setFinishRoutePin(pin));
    Store.dispatch(Actions.hideTooltip());
    setTimeout(this.onRouteSubmit.bind(this), 100);
    pin.addTo(this.state.mapState.mapObject);
  }

  onCancelRouteClick() {
    Store.dispatch(Actions.setUiMode('MODE_CHOOSE'));

    if (this.state.mapState.startPin) {
      this.state.mapState.mapObject.removeLayer(this.state.mapState.startPin);
    }

    //Store.dispatch(Actions.setStartRoutePin(null));
    Store.dispatch(Actions.setStartRoutePoint({
      lat: null,
      lng: null
    }));
    Store.dispatch(Actions.hideTooltip());
  }

  onRouteSubmit() {
    fetchRoute.bind(this)();
  }

  onObstacleClick() {
    console.log("onObstacleClick");

    if (!this.state.uiState.obstacleFormVisibility) {

      Store.dispatch(Actions.setUiMode('OBSTACLE'));
      Store.dispatch(Actions.enableObstacleForm());
      Store.dispatch(Actions.disableRouteForm());
      Store.dispatch(Actions.hideTooltip());
      clearMap.bind(this)();

      const coords = {
        lat: this.state.uiState.tooltipLat,
        lng: this.state.uiState.tooltipLng
      };

      //this.state.mapState.mapObject.setView([lat, lng]);

      let marker = L.marker(coords, {
        icon: obstacle_marker_icon,
        draggable: true
      });

      if (this.state.obstaclesState.obstaclePin) {
        this.state.mapState.mapObject.removeLayer(this.state.obstaclesState.obstaclePin);
      }

      marker.addTo(this.state.mapState.mapObject);

      marker.on('dragend', (event) => {
        Store.dispatch(Actions.setObstacle(marker.getLatLng(), marker));
        fetchObstacleWayGuess(marker.getLatLng())
            .then((way) => {
              console.log("Draw way", way[0]);
              let r = L.polyline(way[0].polyline, {
                color: '#c0392b',
                opacity: 0.8
              });

              if (this.state.obstaclesState.guessedPolyline) {
                this.state.mapState.mapObject.removeLayer(this.state.obstaclesState.guessedPolyline);
              }

              r.addTo(this.state.mapState.mapObject);

              Store.dispatch(Actions.setObstacleGuess(way[0].polyline, r));
            }, () => {
              if (this.state.obstaclesState.guessedPolyline) {
                this.state.mapState.mapObject.removeLayer(this.state.obstaclesState.guessedPolyline);
                Store.dispatch(Actions.setObstacleGuess([], null));
              }
            });
      });

      Store.dispatch(Actions.setObstacle(marker.getLatLng(), marker));
      fetchObstacleWayGuess.bind(this)(marker.getLatLng())
        .then((way) => {
          console.log("way", way[0]);
          let r = L.polyline(way[0].polyline, {
            color: '#c0392b',
            opacity: 0.8
          });

          if (this.state.obstaclesState.guessedPolyline) {
            this.state.mapState.mapObject.removeLayer(this.state.obstaclesState.guessedPolyline);
          }

          r.addTo(this.state.mapState.mapObject);

          Store.dispatch(Actions.setObstacleGuess(way[0].polyline, r));
        }, () => {
          console.log("Handle reject");
          if (this.state.obstaclesState.guessedPolyline) {
            this.state.mapState.mapObject.removeLayer(this.state.obstaclesState.guessedPolyline);
          }
        });
    } else {
      Store.dispatch(Actions.setUiMode('MODE_CHOOSE'));
      Store.dispatch(Actions.disableObstacleForm());
      Store.dispatch(Actions.resetObstacle());
      clearMap.bind(this)();
    }
  }

  onObstaclePhotoInputChange(event) {
    let input = event.target;
    let label = input.nextElementSibling;
    let file = input.files[0];

    if (file) {
      Store.dispatch(Actions.setObstaclePhotoState('SELECTED'));
    }
  }

  onObstacleConfirm(event) {
    event.preventDefault();
    // To Java Application
    let queryString = this.state.obstaclesState.obstacleCoords.lng + '&' + this.state.obstaclesState.obstacleCoords.lat;

    let request = new Request('/obstacle/add?' + queryString, {
      headers: new Headers({
        'Content-Type': 'text/plain'
      })
    });

    window.fetch(request)
      .then((response) => {
        return response.text();
      })
      .then((response) => {
        console.log(response);
        clearMap.bind(this)();
        Store.dispatch(Actions.setUiMode('MODE_CHOOSE'));
        Store.dispatch(Actions.setObstacleFormState('SUCCESS'));
        setTimeout(() => {
          Store.dispatch(Actions.disableObstacleForm());
        }, 3000);
        setTimeout(() => {
          Store.dispatch(Actions.setObstacleFormState('BASIC'));
        }, 3500);
      });

    let xmlhttp = new XMLHttpRequest();
    // To obstacle storage
    if (this.state.uiState.obstaclePhotoState === 'SELECTED') {
      xmlhttp.onreadystatechange = () => {
        if (this.readyState === 4) {
          if (this.state === 200) {
            Store.dispatch(Actions.setObstaclePhotoState('LOADED'));
          }
        }
      };
    }

    let latInput = document.querySelector('[name=obstacleLat');
    let lngInput = document.querySelector('[name=obstacleLng');

    latInput.value = this.state.obstaclesState.obstacleCoords.lat;
    lngInput.value = this.state.obstaclesState.obstacleCoords.lng;

    let form = new FormData(document.querySelector('.ObstacleForm'));
    form.append('path', 'http://localhost:3030/');
    xmlhttp.open('POST', 'http://localhost:3030/obstacle', true);
    console.log(form);
    xmlhttp.send(form);
  }

  render() {
    let choices;

    if (this.state.uiState.uiMode == 'MODE_CHOOSE' || this.state.uiState.uiMode == 'OBSTACLE') {
      choices = [
        {
          title: "Точка старта",
          state: "ROUTING",
          action: this.onStartPointClick.bind(this)
        }, {
          title: "Препятствие",
          state: "OBSTACLE",
          action: this.onObstacleClick.bind(this)
        }
      ];
    } else if (this.state.uiState.uiMode == 'ROUTING') {
      choices = [
        {
          title: "Точка финиша",
          state: "ROUTING",
          action: this.onFinishPointClick.bind(this)
        }, {
          title: "Отмена",
          state: "MODE_CHOOSE",
          action: this.onCancelRouteClick.bind(this)
        }
      ];
    }

    return (
      <div className="app">
        <Map state={{mapState: this.state.mapState, routeState: this.state.routeState}}
             store={Store}
             onMapClick={this.onMapClick.bind(this)}
             onMapDidMount={this.mapDidMount.bind(this)}
        />
        <ModeToggle
            //onRouteClick={this.onRouteClick.bind(this)}
            onObstacleClick={this.onObstacleClick.bind(this)}
            routeButtonActive={this.state.uiState.routeFormVisibility}
            obstacleButtonActive={this.state.uiState.obstacleFormVisibility}
         />
        <ChoicesTooltip
          show={this.state.uiState.showTooltip}
          xoffset={this.state.uiState.tooltipX}
          yoffset={this.state.uiState.tooltipY}
          choices={choices}
        />
        <ObstacleForm
            visibility={this.state.uiState.obstacleFormVisibility}
            onObstacleConfirm={this.onObstacleConfirm.bind(this)}
            formState={this.state.uiState.obstacleFormState}
            photoState={this.state.uiState.obstaclePhotoState}
            onPhotoInputChange={this.onObstaclePhotoInputChange}
        />
      </div>
    );
  }
}

/**
 * Parse response from server
 * @param response String
 * lng lat type
 * ...
 * dist: walk road transport
 */
function parseRouteResponse(response) {
  console.log(response);

  let points = [];
  let route_parts = []; // [{ polyline: [[lat, lng], ...], type: int }, ...]

  let raw_points = response.split('\n');
  let dist = response[response.length - 1].split(' ');
  dist.shift(); // Remove "Dist:"
  raw_points.pop(); // Remove empty line
  raw_points.pop(); // Remove dist line

  //console.log("raw_points", raw_points);
  for (let i = 0, j = 0; i < raw_points.length; i++) {
    let raw_point = raw_points[i].split(' ');

    if (typeof route_parts[j] === 'undefined') {
      route_parts[j] = {
        polyline: [[parseFloat(raw_point[1]), parseFloat(raw_point[0])]],
        type: raw_point[2]
      }
    } else if (route_parts[j].type === raw_point[2]) {
      route_parts[j].polyline.push([parseFloat(raw_point[1]), parseFloat(raw_point[0])]);
    } else {
      route_parts[j].polyline.push([parseFloat(raw_point[1]), parseFloat(raw_point[0])]);
      j++;

      if (i !== raw_points.length - 1)
        i--; // end point of one part is start point of next one
    }

    //points.push(L.latLng([parseFloat(raw_point[1]), parseFloat(raw_point[0])]));
    //console.log("raw_point", [raw_point[1], raw_point[0]]);
  }

  console.log(route_parts);
  return route_parts;
}

function clearMap() {

  if (this.state.mapState.polylines.length) {
    //this.state.mapState.mapObject.removeLayer(this.state.mapState.route);

    for (var i = 0; i < this.state.mapState.polylines.length; i++) {
      var polyline = this.state.mapState.polylines[i];
      this.state.mapState.mapObject.removeLayer(polyline);
    }
  }

  if (this.state.mapState.routeNodes) {
    for (let i = 0; i < this.state.mapState.routeNodes.length; i++) {
      this.state.mapState.mapObject.removeLayer(this.state.mapState.routeNodes[i]);
    }
  }

  if (this.state.mapState.startPin)
    this.state.mapState.mapObject.removeLayer(this.state.mapState.startPin);
  if (this.state.mapState.finishPin)
    this.state.mapState.mapObject.removeLayer(this.state.mapState.finishPin);

  if (this.state.obstaclesState.obstaclePin)
    this.state.mapState.mapObject.removeLayer(this.state.obstaclesState.obstaclePin);
  if (this.state.obstaclesState.guessedWay.length)
    this.state.mapState.mapObject.removeLayer(this.state.obstaclesState.guessedPolyline);

  Store.dispatch(Actions.removeRouteFromMap());
  //Store.dispatch(Actions.removePolylinesFromMap());
  Store.dispatch(Actions.clearRoute());
}

function fetchRoute() {
  Store.dispatch(Actions.setIsFetchingRoute(true));

  let queryString = this.state.routeState.start[1] + '&' + this.state.routeState.start[0] +
      '&' + this.state.routeState.finish[1] + '&' + this.state.routeState.finish[0];
  console.log("query string", queryString);
  let request = new Request('http://smooth.lc/path?' + queryString, {
    headers: new Headers({
      'Content-Type': 'text/plain'
    })
  });

  window.fetch(request)
      .then((response) => {
        return response.text();
      })
      .then((response) => {
        Store.dispatch(Actions.setRoute(parseRouteResponse(response)));
      });
}

function fetchObstacleWayGuess(coords) {
  return new Promise((resolve, reject) => {
    let queryString = coords.lng + '&' + coords.lat;

    let request = new Request('http://smooth.lc/obstacle/try?' + queryString, {
      headers: new Headers({
        'Content-Type': 'text/plain'
      })
    });

    window.fetch(request)
        .then((response) => {
          return response.text();
        })
        .then((response) => {
          if (response === '') {
            console.log("empty response");
            reject();
          } else
            resolve(parseRouteResponse(response));
        });
  });
}