import * as types from '../constants/ActionTypes';

export function setObstaclesVisibility(obstaclesVisibility) {
  return {
    type: types.SET_OBSTACLES_VISIBILITY,
    obstaclesVisibility
  }
}

export function setObstacle(coords, pin) {
  return {
    type: types.SET_OBSTACLE,
    coords,
    pin
  }
}

export function setObstacles(obstacles) {
  return {
    type: types.SET_OBSTACLES,
    obstacles
  }
}

export function setObstacleGuess(way, polyline) {
  return {
    type: types.SET_GUESS,
    way,
    polyline
  }
}

export function resetObstacle() {
  return {
    type: types.RESET_OBSTACLE
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
 * @param nodes Arrau of route nodes
 * @returns {{type, route: *}}
 */
export function setRouteOnMap(route, nodes) {
  return {
    type: types.SET_MAP_ROUTE,
    route,
    routeNodes: nodes
  }
}

/**
 * Action creator for removing route from map
 * @returns {{type}}
 */
export function removeRouteFromMap() {
  return {
    type: types.CLEAR_MAP_ROUTE
  }
}

/**
 * Action creator for removing route from map
 * @returns {{type}}
 */
export function removePolylinesFromMap() {
  return {
    type: types.CLEAR_MAP_POLYLINES
  }
}

/**
 * Action creator for setting route polylines
 */
export function setRoutePolylines(polylines) {
  return {
    type: types.SET_MAP_POLYLINES,
    polylines
  }
}

export function setDebugRoutePolylines(polylines) {
  return {
    type: types.SET_DEBUG_MAP_POLYLINES,
    polylines
  }
}

/**
 * Action creator for setting route nodes
 * @param pins Array of leaflet markers
 * @returns {{type, routeNodes: *}}
 */
//export function setRouteNodes(nodes) {
//    return {
//        type: types.SET_ROUTE_NODES,
//        routeNodes: pins
//    }
//}

/**
 * Action creator for clearing route nodes
 * @returns {{type, routeNodes: []}}
 */
//export function clearRoutePins() {
//    return {
//        type: types.SET_ROUTE,
//        routeNodes: []
//    }
//}

export function setTransport(vehicles) {
  return {
    type: types.SET_TRANSPORT,
    vehicles
  }
}

export function setVehiclesData(vehicles) {
  return {
    type: types.SET_VEHICLES_DATA,
    vehicles
  }
}

/**
 *
 * @param {boolean} visibility
 */
export function setVehiclesVisibility(visibility) {
  return {
    type: types.SET_VEHICLES_VISIBILITY,
    visibility
  }
}

// UI actions
export function setUiMode(mode) {
  return {
    type: types.SET_UI_MODE,
    mode
  }
}

export function enableObstacleForm() {
  return {
    type: types.ENABLE_OBSTACLE_FORM
  }
}
export function disableObstacleForm() {
  return {
    type: types.DISABLE_OBSTACLE_FORM
  }
}

export function setObstacleFormState(state) {
  return {
    type: types.SET_OBSTACLE_FORM_STATE,
    state
  }
}

export function setObstaclePhotoState(state) {
  return {
    type: types.SET_OBSTACLE_PHOTO_STATE,
    state
  }
}

export function enableRouteForm() {
  return {
    type: types.ENABLE_ROUTE_FORM
  }
}
export function disableRouteForm() {
  return {
    type: types.DISABLE_ROUTE_FORM
  }
}

export function showTooltip() {
  return {
    type: types.SHOW_TOOLTIP
  }
}

export function hideTooltip() {
  return {
    type: types.HIDE_TOOLTIP
  }
}

export function setTooltipPosition(x, y) {
  return {
    type: types.SET_TOOLTIP_POSITION,
    coords: {x, y}
  }
}

export function setTooltipCoords(lat, lng) {
  return {
    type: types.SET_TOOLTIP_COORDS,
    coords: {lat, lng}
  }
}

export function setVehiclesAllowed(allowed) {
  return {
    type: types.SET_VEHICLES_ALLOWED,
    allowed
  }
}

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

export function setDebugRoute(route) {
  return {
    type: types.SET_DEBUG_ROUTE,
    route
  }
}

/**
 * Action creator for clearing route
 * @returns {{type, route: []}}
 */
export function clearRoute() {
  return {
    type: types.CLEAR_ROUTE,
    route: []
  }
}

/**
 * Action creator for setting distances for current route
 * @param walk Number
 * @param bad Number
 * @param transport Number
 * @returns Object
 */
export function setRouteDistances(walk, bad, transport) {
  return {
    type: types.SET_ROUTE_DISTANCES,
    walk,
    bad,
    transport
  }
}