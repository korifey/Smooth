/**
 * Created by kascode on 04.12.15.
 */
import * as ActionTypes from '../constants/ActionTypes';
import { combineReducers } from 'redux';

const initialUiState = {
    routeFormVisibility: false,
    modeToggleVisibility: true
};

export default function uiReducer(state = initialUiState, action) {
    switch (action.type) {

        default:
            return state
    }
}
