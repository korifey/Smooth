import React, { Component } from 'react';
import Map from '../../components/Map/Map';
import ModeToggle from '../../components/ModeToggle/ModeToggle';
import RouteForm from '../../components/RouteForm/RouteForm';
import ObstacleForm from '../../components/ObstacleForm/ObstacleForm';
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
    if (this.state.routeState.route.length && this.state.mapState.route == null) {
      console.log("redrawMap", this.state.routeState.route);
      let r = L.polyline(this.state.routeState.route);
      console.log(r);
      r.addTo(this.state.mapState.mapObject);

      let markers = [];

      console.log("Drawing route markers");
      for (let i = 0; i < this.state.routeState.route.length; i++) {
        var point = this.state.routeState.route[i];
        console.log("draw marker " + i, point);
        //markers[i] = L.marker(point, {
        //  icon: homerIcon,
        //  title: i + ': ' + point.lat + ' ' + point.lng
        //});
        //markers[i].addTo(this.state.mapState.mapObject);
      }
      console.log("Done with markers");

      Store.dispatch(Actions.setRouteOnMap(r, markers));
      Store.dispatch(Actions.setIsFetchingRoute(false));
    }

    console.log("redrawMap", this.state.routeState.route.length, this.state.mapState.route);

    if (!this.state.routeState.route.length && this.state.mapState.route) {
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
    console.log(event.latlng);

    switch(this.state.uiState.uiMode) {
      case 'MODE_CHOOSE':
        break;

      case 'ROUTING':
        if (this.state.routeState.start.length && this.state.routeState.finish.length) {
          // Clear route if there is one
          if (this.state.routeState.route.length) {
            Store.dispatch(Actions.clearRoute());
          }
        } else if (!this.state.routeState.start.length) {
          let pin = L.marker(event.latlng, {
            icon: start_marker_icon
          });

          Store.dispatch(Actions.setStartRoutePoint(event.latlng));
          Store.dispatch(Actions.setStartRoutePin(pin));
          this.state.mapState.startPin.addTo(this.state.mapState.mapObject);

        } else {
          let pin = L.marker(event.latlng, {
            icon: finish_marker_icon
          });

          Store.dispatch(Actions.setFinishRoutePoint(event.latlng));
          Store.dispatch(Actions.setFinishRoutePin(pin));
          this.state.mapState.finishPin.addTo(this.state.mapState.mapObject);

        }
        break;
    }
  }

  onRouteClick() {
    switch (this.state.uiState.uiMode) {
      case 'ROUTING':
        Store.dispatch(Actions.setUiMode('MODE_CHOOSE'));
        Store.dispatch(Actions.disableRouteForm());
        Store.dispatch(Actions.clearRoute());
        clearMap.bind(this)();
        break;

      case 'OBSTACLE':
        Store.dispatch(Actions.setUiMode('ROUTING'));
        Store.dispatch(Actions.enableRouteForm());
        Store.dispatch(Actions.disableObstacleForm());
        Store.dispatch(Actions.resetObstacle());
        clearMap.bind(this)();
        break;

      default:
        Store.dispatch(Actions.setUiMode('ROUTING'));
        Store.dispatch(Actions.enableRouteForm());
    }
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
      clearMap.bind(this)();

      const coords = this.state.mapState.mapObject.getCenter();

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
        fetchObstacleWayGuess.bind(this)(marker.getLatLng())
            .then((way) => {
              let r = L.polyline(way, {
                color: '#c0392b',
                opacity: 0.8
              });

              if (this.state.obstaclesState.guessedPolyline) {
                this.state.mapState.mapObject.removeLayer(this.state.obstaclesState.guessedPolyline);
              }

              r.addTo(this.state.mapState.mapObject);

              Store.dispatch(Actions.setObstacleGuess(way, r));
            });
      });

      Store.dispatch(Actions.setObstacle(marker.getLatLng(), marker));
      fetchObstacleWayGuess.bind(this)(marker.getLatLng())
        .then((way) => {
          let r = L.polyline(way, {
            color: '#c0392b'
          });

          if (this.state.obstaclesState.guessedPolyline) {
            this.state.mapState.mapObject.removeLayer(this.state.obstaclesState.guessedPolyline);
          }

          r.addTo(this.state.mapState.mapObject);

          Store.dispatch(Actions.setObstacleGuess(way, r));
        });
    } else {
      Store.dispatch(Actions.setUiMode('MODE_CHOOSE'));
      Store.dispatch(Actions.disableObstacleForm());
      Store.dispatch(Actions.resetObstacle());
      clearMap.bind(this)();
    }
  }

  onObstacleConfirm() {
    let queryString = this.state.obstaclesState.obstacleCoords.lng + '&' + this.state.obstaclesState.obstacleCoords.lat;

    let request = new Request('http://smooth.lc/obstacle/add?' + queryString, {
      headers: new Headers({
        'Content-Type': 'text/plain'
      })
    });

    fetch(request)
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
  }

  render() {
    return (
      <div className="app">
        <Map state={{mapState: this.state.mapState, routeState: this.state.routeState}}
             store={Store}
             onMapClick={this.onMapClick.bind(this)}
             onMapDidMount={this.mapDidMount.bind(this)}
        />
        <ModeToggle
            onRouteClick={this.onRouteClick.bind(this)}
            onObstacleClick={this.onObstacleClick.bind(this)}
            routeButtonActive={this.state.uiState.routeFormVisibility}
            obstacleButtonActive={this.state.uiState.obstacleFormVisibility}
         />
        <RouteForm visibility={this.state.uiState.routeFormVisibility} onSubmit={this.onRouteSubmit.bind(this)} />
        <ObstacleForm
            visibility={this.state.uiState.obstacleFormVisibility}
            onObstacleConfirm={this.onObstacleConfirm.bind(this)}
            state={this.state.uiState.obstacleFormState}
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
  let raw_points = response.split('\n');
  let dist = response[response.length - 1].split(' ');
  dist.shift(); // Remove "Dist:"
  raw_points.pop(); // Remove dist line
  raw_points.pop(); // Remove dist line

  let points = [];
  let raw_point;
  //console.log("raw_points", raw_points);
  for (var i = 0; i < raw_points.length; i++) {
    raw_point = raw_points[i].split(' ');
    points.push(L.latLng([parseFloat(raw_point[1]), parseFloat(raw_point[0])]));
    //console.log("raw_point", [raw_point[1], raw_point[0]]);
  }

  //console.log(points);
  return points;
}

function clearMap() {

  if (this.state.mapState.route)
    this.state.mapState.mapObject.removeLayer(this.state.mapState.route);

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
  Store.dispatch(Actions.clearRoute());
}

function fetchRoute() {
  Store.dispatch(Actions.setIsFetchingRoute(true));

  let queryString = this.state.routeState.start[1] + '&' + this.state.routeState.start[0] +
      '&' + this.state.routeState.finish[1] + '&' + this.state.routeState.finish[0];
  let request = new Request('http://smooth.lc/path?' + queryString, {
    headers: new Headers({
      'Content-Type': 'text/plain'
    })
  });

  fetch(request)
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

    fetch(request)
        .then((response) => {
          return response.text();
        })
        .then((response) => {
          resolve(parseRouteResponse(response));
        });
  });
}