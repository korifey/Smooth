import { combineReducers } from 'redux';
import mapState from './map';
import obstaclesState from './obstacle';
import uiState from './ui';
import routeState from './route';
import transportState from './transport';

export default combineReducers({
    mapState,
    obstaclesState,
    uiState,
    routeState,
    transportState
})
