import * as ActionTypes from '../constants/ActionTypes';
import { combineReducers } from 'redux';

const initialObstaclesState = {
    obstacles: [],
    obstacleCoords: [],
    obstaclePin: null,
    guessedWay: [],
    guessedPolyline: null,
    fetchingGuess: false,
    obstaclesVisibility: 'NONE'
};

export default function obstaclesReducer(state = initialObstaclesState, action) {
    switch(action.type) {
        case ActionTypes.SET_OBSTACLE:
            return Object.assign({}, state, {
                obstacleCoords: action.coords,
                obstaclePin: action.pin
            });

        case ActionTypes.SET_OBSTACLES_VISIBILITY:
            return Object.assign({}, state, {
                obstaclesVisibility: action.obstaclesVisibility
            });

        case ActionTypes.SET_GUESS:
            return Object.assign({}, state, {
                guessedWay: action.way,
                guessedPolyline: action.polyline
            });

        case ActionTypes.SET_GUESS_POLYLINE:
            return Object.assign({}, state, {
                guessedPolyline: action.polyline
            });

        default:
            return state;
    }
}