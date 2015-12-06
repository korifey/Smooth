import * as ActionTypes from '../constants/ActionTypes';
import { combineReducers } from 'redux';

const initialObstaclesState = {
    obstacles: [],
    obstacle: null,
    guessedWay: [],
    fetchingGuess: false,
    obstaclesVisibility: 'NONE'
};

export default function obstaclesReducer(state = initialObstaclesState, action) {
    switch(action.type) {
        case ActionTypes.SET_OBSTACLE:
            return Object.assign({}, state, {
                obstacle: action.obstacle
            });

        case ActionTypes.SET_OBSTACLES_VISIBILITY:
            return Object.assign({}, state, {
                obstaclesVisibility: action.obstaclesVisibility
            });

        default:
            return state;
    }
}