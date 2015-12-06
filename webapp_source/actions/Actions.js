import * as types from '../constants/ActionTypes';

export function setObstaclesVisibility(obstaclesVisibility) {
   return {
       type: types.SET_OBSTACLES_VISIBILITY,
       obstaclesVisibility
   }
}

export function setObstacle(obstacle) {
    return {
        type: types.SET_OBSTACLE,
        obstacle
    }
}
// TODO: Obstacle actions

// TODO: Map actions
export function setMap(mapObject) {
    return {
        type: types.SET_MAP,
        mapObject
    }
}

/**
 * Action creator for setting route on map
 * @param route
 * @returns {{type, route: *}}
 */
export function setRouteOnMap(route) {
    return {
        type: types.SET_ROUTE,
        route
    }
}

// TODO: UI actions

// TODO: Route actions
/**
 * Action creator for setting start route point
 * @param coords {lat, lng}
 * @returns {{type, coords: *}}
 */
export function setStartRoutePoint(coords) {
    return {
        type: types.SET_START_ROUTE_POINT,
        coords
    }
}

/**
 * Action creator for setting start route pin
 * @param pin Leaflet pin object
 * @returns {{type, pin: *}}
 */
export function setStartRoutePin(pin) {
    return {
        type: types.SET_START_ROUTE_PIN,
        pin
    }
}

/**
 * Action creator for setting finish route point
 * @param coords {lat, lng}
 * @returns {{type, coords: *}}
 */
export function setFinishRoutePoint(coords) {
    return {
        type: types.SET_FINISH_ROUTE_POINT,
        coords
    }
}

/**
 * Action creator for setting finish route pin
 * @param pin Leaflet pin object
 * @returns {{type, pin: *}}
 */
export function setFinishRoutePin(pin) {
    return {
        type: types.SET_FINISH_ROUTE_PIN,
        pin
    }
}

/**
 * Action creator for setting route fetching status
 * @param status Boolean
 * @returns {{type, status: *}}
 */
export function setIsFetchingRoute(status) {
    return {
        type: types.SET_ROUTE_FETCH,
        status
    }
}

/**
 * Action creator for setting route
 * @param route Array
 * @returns {{type, route: *}}
 */
export function setRoute(route) {
    return {
        type: types.SET_ROUTE,
        route
    }
}