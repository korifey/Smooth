/**
 * Created by kascode on 03.12.15.
 */
import * as ActionTypes from '../constants/ActionTypes';

const initialMapState = {
    lat: 59.9398893,
    lng: 30.3191246,
    zoom: 14,
    mapObject: undefined,
    route: null
};

export default function mapReducer(state = initialMapState, action) {
    let newState;

    switch (action.type) {
        case ActionTypes.SET_MAP:
            console.log("mapReducer", Object.assign({}, state, {
                mapObject: action.mapObject
            }));
            return Object.assign({}, state, {
                mapObject: action.mapObject
            });

        case ActionTypes.SET_MAP_ROUTE:
            newState = Object.assign({}, state, {
                route: action.route
            });
            console.log("mapReducer", state, newState);
            return newState;

        default:
            return state
    }
}