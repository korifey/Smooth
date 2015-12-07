import React, { Component } from 'react';
import Map from '../../components/Map/Map';
import ModeToggle from '../../components/ModeToggle/ModeToggle';
import RouteForm from '../../components/RouteForm/RouteForm';
import ObstacleForm from '../../components/ObstacleForm/ObstacleForm';
import Store from '../../store/store';
import { setStartRoutePoint,
  setStartRoutePin,
  setFinishRoutePoint,
  setFinishRoutePin,
  setIsFetchingRoute,
  setRoute,
  clearRoute,
  setRouteOnMap,
  removeRouteFromMap } from '../../actions/Actions';
//import SomeApp from './SomeApp';
// import { createStore, combineReducers } from 'redux';
// import { Provider } from 'react-redux';
// import * as reducers from '../reducers';

// const reducer = combineReducers(reducers);
// const store = createStore(reducer);
require('./App.css');
require('leaflet');
require('leaflet_css');
let marker_icon_img = require('../../components/Map/images/marker-icon.png');
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
    this.unsubscribe = Store.subscribe(() => {
      this.forceUpdate();
      this.setState(Store.getState());
      this.redrawRoute();
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  redrawRoute() {
    if (this.state.routeState.route.length && this.state.mapState.route == null) {
      console.log("redrawRoute", this.state.routeState.route);
      let r = L.polyline(this.state.routeState.route);
      console.log(r);
      r.addTo(this.state.mapState.mapObject);

      let markers = [];

      console.log("Drawing route markers");
      for (let i = 0; i < this.state.routeState.route.length; i++) {
        var point = this.state.routeState.route[i];
        console.log("draw marker " + i, point);
        markers[i] = L.marker(point, {
          icon: homerIcon,
          title: i + ': ' + point.lat + ' ' + point.lng
        });
        markers[i].addTo(this.state.mapState.mapObject);
      }
      console.log("Done with markers");

      Store.dispatch(setRouteOnMap(r, markers));
      Store.dispatch(setIsFetchingRoute(false));
    }

    console.log("redrawRoute", this.state.routeState.route.length, this.state.mapState.route);

    if (!this.state.routeState.route.length && this.state.mapState.route) {
      clearMap.bind(this)();
    }
  }

  /**
   * Map click handler
   * @param event {latlng, layerPoint, containerPoint, originalEvent}
   */
  onMapClick(event) {
    let pin = L.marker(event.latlng, {
      icon: markerIcon
    });
    console.log(event.latlng);

    if (this.state.routeState.start.length && this.state.routeState.finish.length) {

      // Clear route if there is one
      if (this.state.routeState.route.length) {
        Store.dispatch(clearRoute());
      } else {
        //fetchRoute.bind(this)();
      }

    } else if (!this.state.routeState.start.length) {

      Store.dispatch(setStartRoutePoint(event.latlng));
      Store.dispatch(setStartRoutePin(pin));
      this.state.mapState.startPin.addTo(this.state.mapState.mapObject);

    } else {

      Store.dispatch(setFinishRoutePoint(event.latlng));
      Store.dispatch(setFinishRoutePin(pin));
      this.state.mapState.finishPin.addTo(this.state.mapState.mapObject);

    }
  }

  onRouteClick() {
    fetchRoute.bind(this)();
  }

  render() {
    return (
      <div className="app">
        <Map state={{mapState: this.state.mapState, routeState: this.state.routeState}}
             store={Store}
             onMapClick={this.onMapClick.bind(this)}
        />
        <ModeToggle onRouteClick={this.onRouteClick.bind(this)} />
        <RouteForm visibility={this.state.uiState.routeFormVisibility} />
        <ObstacleForm />
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
  this.state.mapState.mapObject.removeLayer(this.state.mapState.route);

  for (let i = 0; i < this.state.mapState.routeNodes.length; i++) {
    this.state.mapState.mapObject.removeLayer(this.state.mapState.routeNodes[i]);
  }

  this.state.mapState.mapObject.removeLayer(this.state.mapState.startPin);
  this.state.mapState.mapObject.removeLayer(this.state.mapState.finishPin);

  Store.dispatch(removeRouteFromMap());
  Store.dispatch(clearRoute());
}

function fetchRoute() {
  Store.dispatch(setIsFetchingRoute(true));

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
        Store.dispatch(setRoute(parseRouteResponse(response)));
      });
}