/**
 * Created by kascode on 03.12.15.
 */
import obstacles from '../reducers/obstacle';
import * as Actions from '../actions/Actions';
import * as ActionTypes from '../constants/ActionTypes';
import store from '../store/store';
import expect from 'expect';

describe('Reducer', () => {
    it('should create an action to change obstacles visibility state', () => {
        const state = 'VISIBLE_ALL';
        const expectedAction = {
            type: ActionTypes.SET_OBSTACLES_VISIBILITY,
            obstaclesVisibility: state
        };

        expect(Actions.setObstaclesVisibility(state)).toEqual(expectedAction);
    });

    it('should change obstacles visibility', () => {
        const expectedState = 'VISIBLE_ALL';
        let state = store.getState();

        store.dispatch(Actions.setObstaclesVisibility(expectedState));
        expect(store.getState().obstaclesState.obstaclesVisibility).toEqual(expectedState);
    });

    it('Should set start route point', () => {
        const coords = {
            lat: '12',
            lng: '34'
        };

        store.dispatch(Actions.setStartRoutePoint(coords));
        expect(store.getState().routeState.start).toEqual([coords.lat, coords.lng]);
    });
});
