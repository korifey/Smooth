/**
 * Created by kascode on 03.12.15.
 */
import * as ActionTypes from '../constants/ActionTypes';

const initialMapState = {
  lat: 59.9398893,
  lng: 30.3191246,
  zoom: 14,
  mapObject: null,
  startPin: null,
  finishPin: null,
  route: null,
  routeNodes: [],
  polylines: [],
  debugPolylines: [],
  vehicles: [],
  vehiclesData: [],
  vehiclesVisibility: false
};

export default function mapReducer(state = initialMapState, action) {
  let newState;

  switch (action.type) {
    case ActionTypes.SET_MAP:
      newState = Object.assign({}, state, {
        mapObject: action.mapObject
      });
      console.log("mapReducer", action.type, state, newState);
      return newState;

    case ActionTypes.SET_START_ROUTE_PIN:
      newState = Object.assign({}, state, {
        startPin: action.pin
      });
      console.log("mapReducer", action.type, state, newState);
      return newState;

    case ActionTypes.SET_FINISH_ROUTE_PIN:
      newState = Object.assign({}, state, {
        finishPin: action.pin
      });
      console.log("mapReducer", action.type, state, newState);
      return newState;

    //case ActionTypes.SET_MAP_ROUTE:
    //  newState = Object.assign({}, state, {
    //    route: action.route,
    //    routeNodes: action.routeNodes
    //  });
    //  console.log("mapReducer", action.type, state, newState);
    //  return newState;

    case ActionTypes.CLEAR_MAP_ROUTE:
      newState = Object.assign({}, state, {
        route: null,
        routeNodes: [],
        polylines: [],
        startPin: null,
        finishPin: null
      });
      console.log("mapReducer", action.type, state, newState);
      return newState;

    case ActionTypes.SET_MAP_POLYLINES:
      newState = Object.assign({}, state, {
        polylines: action.polylines
      });
      console.log("mapReducer", action.type, state, newState);
      return newState;

    case ActionTypes.SET_DEBUG_MAP_POLYLINES:
      newState = Object.assign({}, state, {
        debugPolylines: action.polylines
      });
      console.log("mapReducer", action.type, state, newState);
      return newState;

    case ActionTypes.CLEAR_MAP_POLYLINES:
      newState = Object.assign({}, state, {
        polylines: []
      });
      console.log("mapReducer", action.type, state, newState);
      return newState;

    default:
      return state
  }
}