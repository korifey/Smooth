/**
 * Created by kascode on 03.12.15.
 */

import React, { Component, PropTypes } from 'react';
import { setStartRoutePoint, setMap } from '../../actions/Actions';

require('./Map.css');

export default class Map extends Component {
    componentDidMount() {
        const { store } = this.props;
        let map = L.map('map').setView([this.props.state.mapState.lat, this.props.state.mapState.lng], 16);
        store.dispatch(setMap(map));
        L.tileLayer('https://api.tiles.mapbox.com/v4/kascode.k35co93d/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoia2FzY29kZSIsImEiOiJoeXp2cENzIn0.HYtI1Pj7v372xyxg5kz3Kg#11', {
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
            maxZoom: 18
        }).addTo(map);

        map.on('click', this.props.onMapClick);
    }

    render() {
        return (
            <div id="map" className="map"></div>
        )
    }
}

Map.propTypes = {
    state: PropTypes.object.isRequired
};
