/**
 * Created by kascode on 04.12.15.
 */
import * as ActionTypes from '../constants/ActionTypes';
import { combineReducers } from 'redux';

const initialUiState = {
  routeFormVisibility: false,
  modeToggleVisibility: true,
  obstacleFormVisibility: false,
  obstacleFormState: 'BASIC',  // ['BASIC', 'SUCCESS', 'ERROR']
  uiMode: 'MODE_CHOOSE' // ['MODE_CHOOSE', 'ROUTING', 'OBSTACLE']
};

export default function uiReducer(state = initialUiState, action) {
  let newState;
  switch (action.type) {
    case ActionTypes.SET_UI_MODE:
      newState = Object.assign({}, state, {
        uiMode: action.mode
      });
      console.log("uiReducer", action.type, state, newState);
      return newState;

    case ActionTypes.ENABLE_OBSTACLE_FORM:
      newState = Object.assign({}, state, {
        obstacleFormVisibility: true
      });
      console.log("uiReducer", action.type, state, newState);
      return newState;

    case ActionTypes.DISABLE_OBSTACLE_FORM:
      newState = Object.assign({}, state, {
        obstacleFormVisibility: false
      });
      console.log("uiReducer", action.type, state, newState);
      return newState;

    case ActionTypes.SET_OBSTACLE_FORM_STATE:
      newState = Object.assign({}, state, {
        obstacleFormState: action.state
      });
      console.log("uiReducer", action.type, state, newState);
      return newState;

    case ActionTypes.ENABLE_ROUTE_FORM:
      newState = Object.assign({}, state, {
        routeFormVisibility: true
      });
      console.log("uiReducer", action.type, state, newState);
      return newState;

    case ActionTypes.DISABLE_ROUTE_FORM:
      newState = Object.assign({}, state, {
        routeFormVisibility: false
      });
      console.log("uiReducer", action.type, state, newState);
      return newState;

    default:
      return state
  }
}
