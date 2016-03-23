/**
 * Created by kascode on 19.02.16.
 */
import React, { Component, PropTypes } from 'react';
import { setStartRoutePoint, setMap } from '../../actions/Actions';
import Store from '../../store/transportStore';
import * as Actions from '../../actions/Actions';

require('leaflet');
require('leaflet_css');

export default class Transport extends Component {
  constructor() {
    super();
    this.state = Store.getState();
  }

  componentDidMount() {
    this.unsubscribe = Store.subscribe(this.updateApp.bind(this));

    webSocket.onmessage = (event) => {
      Store.dispatch(Actions.setVehiclesData(JSON.parse(event.data)));
      this.setState(Store.getState());
      this.forceUpdate();
      this.updateApp();
    };
  }

  updateApp() {
    this.removeTransportPins();
    if (this.props.vehiclesVisibility) {
      this.setTransportPins();
    }
  }

  setTransportPins() {
    let vehiclesPins = this.state.vehiclesData.map((el) => {
      let pin = L.rotatedMarker([el.lat, el.lng], {
        icon: vehicle_marker_icon
      });

      pin.options.angle = el.bearing;

      pin.addTo(this.props.mapObject);

      return pin;
    });
    Store.dispatch(Actions.setTransport(vehiclesPins));
    this.setState(Store.getState());
  }

  removeTransportPins() {
    if (this.state.vehicles.length) {
      for (var i = 0; i < this.state.vehicles.length; i++) {
        var v = this.state.vehicles[i];
        this.props.mapObject.removeLayer(v);
      }
    }
  }

  render() {
    return false;
  }
};

Transport.propTypes = {
  vehiclesVisibility: PropTypes.bool.isRequired,
  mapObject: PropTypes.object.isRequired
};