/**
 * Created by kascode on 03.12.15.
 */

import React, { Component, PropTypes } from 'react';
import { setStartRoutePoint, setMap } from '../../actions/Actions';

require('./Map.css');

export default class Map extends Component {
    componentDidMount() {
        this.props.onMapDidMount();
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
