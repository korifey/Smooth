/**
 * Created by kascode on 04.12.15.
 */
import * as ActionTypes from '../constants/ActionTypes';

const initialRouteState = {
  start: [],
  finish: [],
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
      //console.log("routeReducer", action.type, state, newState);
      return newState;

    case ActionTypes.SET_FINISH_ROUTE_POINT:
      newState = Object.assign({}, state, {
        finish: [action.coords.lat, action.coords.lng]
      });
      //console.log("routeReducer", action.type, state, newState);
      return newState;

    case ActionTypes.SET_ROUTE_FETCH:
      newState = Object.assign({}, state, {
        isFetching: action.status
      });
      //console.log("routeReducer", action.type, state, newState);
      return newState;

    case ActionTypes.SET_ROUTE:
      newState = Object.assign({}, state, {
        route: action.route
      });
      //console.log("routeReducer", action.type, state, newState);
      return newState;

    case ActionTypes.CLEAR_ROUTE:
      newState = Object.assign({}, state, {
        route: action.route,
        start: [],
        finish: []
      });
      //console.log("routeReducer", action.type, state, newState);
      return newState;

    default:
      return state
  }
}