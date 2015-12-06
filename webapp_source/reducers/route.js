/**
 * Created by kascode on 04.12.15.
 */
import * as ActionTypes from '../constants/ActionTypes';

const initialRouteState = {
    start: [],
    finish: [],
    startPin: undefined,
    finishPin: undefined,
    route: [],
    isFetching: false
};

export default function routeReducer(state = initialRouteState, action) {
    let newState;
    switch (action.type) {
        case ActionTypes.SET_START_ROUTE_POINT:
            newState = Object.assign({}, state, {
                start: [action.coords.lat, action.coords.lng]
            });
            console.log("routeReducer", state, newState);
            return newState;

        case ActionTypes.SET_START_ROUTE_PIN:
            newState = Object.assign({}, state, {
                startPin: action.pin
            });
            console.log("routeReducer", state, newState);
            return newState;

        case ActionTypes.SET_FINISH_ROUTE_POINT:
            newState = Object.assign({}, state, {
                finish: [action.coords.lat, action.coords.lng]
            });
            console.log("routeReducer", state, newState);
            return newState;

        case ActionTypes.SET_FINISH_ROUTE_PIN:
            newState = Object.assign({}, state, {
                finishPin: action.pin
            });
            console.log("routeReducer", state, newState);
            return newState;

        case ActionTypes.SET_ROUTE_FETCH:
            newState = Object.assign({}, state, {
                isFetching: action.status
            });
            console.log("routeReducer", state, newState);
            return newState;

        case ActionTypes.SET_ROUTE:
            newState = Object.assign({}, state, {
                route: action.route
            });
            console.log("routeReducer", state, newState);
            return newState;

        default:
            return state
    }
}