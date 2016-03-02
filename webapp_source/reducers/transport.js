/**
 * Created by kascode on 03.12.15.
 */
import * as ActionTypes from '../constants/ActionTypes';

const initialTransportState = {
  vehicles: [],
  vehiclesData: [],
  vehiclesVisibility: false
};

export default function transportReducer(state = initialTransportState, action) {
  let newState;

  switch (action.type) {
    case ActionTypes.SET_TRANSPORT:
      newState = Object.assign({}, state, {
        vehicles: action.vehicles
      });
      console.log("transportReducer", action.type, state, newState);
      return newState;

    case ActionTypes.SET_VEHICLES_DATA:
      newState = Object.assign({}, state, {
        vehiclesData: action.vehicles
      });
      console.log("transportReducer", action.type, state, newState);
      return newState;

    case ActionTypes.SET_VEHICLES_VISIBILITY:
      newState = Object.assign({}, state, {
        vehiclesVisibility: action.visibility
      });
      console.log("transportReducer", action.type, state, newState);
      return newState;

    default:
      return state
  }
}