import { LatLng, BoundingBox, TravelType } from './../types/index'
import * as projection from './projection'

/**
 * Some reusable functions that deal with lat/lng gemoetry calculations
 */

const EARTH_RADIUS_KM = 6371.01
const RADIANS = Math.PI / 180
// const DEGREES = 180 / Math.PI

/**
 * Return whether a lat/lng point is contained within a bounding box
 */
export function contains(bBox: BoundingBox, point: LatLng) {
  return (
    point.lat >= bBox.southWest.lat &&
    point.lat <= bBox.northEast.lat &&
    point.lng >= bBox.southWest.lng &&
    point.lng <= bBox.northEast.lng
  )
}

/**
 * Returns the distance in kilometers between two lat/lng points
 */
export function calculateDistance(from: LatLng, to: LatLng) {
  const fromLat = RADIANS * from.lat
  const fromLng = RADIANS * from.lng
  const toLat = RADIANS * to.lat
  const toLng = RADIANS * to.lng

  return (
    Math.acos(Math.sin(fromLat) * Math.sin(toLat) + Math.cos(fromLat) * Math.cos(toLat) * Math.cos(fromLng - toLng)) *
    EARTH_RADIUS_KM
  )
}

/**
 *
 * Creates a bounding box around a point
 *
 * @param from
 * @param distance distance in km
 */
export function boundingBox(from: LatLng, distance: number): BoundingBox {
  distance = distance * 1000

  const lat = from.lat
  const lng = from.lng

  const latRadians = lat * RADIANS

  const DELTA_LAT_KM = 110.574235
  const DEGREES_LONG_KM = 110.572833 * Math.cos(latRadians)

  const deltaLat = distance / 1000.0 / DELTA_LAT_KM
  const deltaLong = distance / 1000.0 / DEGREES_LONG_KM

  const topLat = lat + deltaLat
  const bottomLat = lat - deltaLat
  const leftLng = lng - deltaLong
  const rightLng = lng + deltaLong

  return {
    northEast: {
      lat: topLat,
      lng: rightLng,
    },
    southWest: {
      lat: bottomLat,
      lng: leftLng,
    },
  }
}

/**
 * Give a list of locations return only those that are in proximity (predefined based on given TravelOptions)
 * to any location in the  `from` list
 * The use of this is to reduce the inputs to reachability and other requests (pre-filtering out remote targets) for perfromance reasons
 *
 * @param locations  The list to be filtered
 * @param from  results will be in proximity to these
 * @param options traveloptions (affect the distance around the `from` list that will be considered)
 */
export function locationsWithinTravelOptions<T extends LatLng>(
  locations: T[],
  from: LatLng | LatLng[],
  options: {
    maxEdgeWeight: number
    edgeWeight: 'time' | 'distance'
    travelType: TravelType
  }
) {
  const maxEdgeWeight = options.maxEdgeWeight
  let speed: number
  switch (options.travelType) {
    case 'walk':
      speed = 10
      break
    case 'bike':
      speed = 25
      break
    case 'transit':
      speed = 150
      break
    default:
      speed = 120
      break
  }

  const distanceKm =
    options.edgeWeight === 'distance' ? Math.round(maxEdgeWeight / 1000) : (speed * maxEdgeWeight) / 3600
  return locationsWithinDistance(locations, from, distanceKm)
}

function getSpeed(options: { maxEdgeWeight: number; edgeWeight: 'time' | 'distance'; travelType: TravelType }) {
  switch (options.travelType) {
    case 'walk':
      return 10
    case 'bike':
      return 25
    case 'transit':
      return 150
    default:
      return 120
  }
}

/**
 * Creates a bounding box around a location, with parametres about the distance calculated (based on predefined internal logic)
 * from a give TravelOptions
 *
 * @param from
 * @param options
 */
export function boundingBoxWithinTravelOptions<T extends LatLng>(
  from: T,
  options: {
    maxEdgeWeight: number
    edgeWeight: 'time' | 'distance'
    travelType: TravelType
  }
) {
  const maxEdgeWeight = options.maxEdgeWeight
  const speed: number = getSpeed(options)
  const distanceKm =
    options.edgeWeight === 'distance' ? Math.round(maxEdgeWeight / 1000) : (speed * maxEdgeWeight) / 3600
  return boundingBox(from, distanceKm)
}

/**
 * Create a bounding box from an Array of latlng locations
 *
 * @param locations location array to get the bbox from
 */
export function boundingBoxFromLocationArray<T extends LatLng>(locations: T[]): BoundingBox {
  const bbox = locations.reduce(
    (acc, val) => {
      acc.northEast.lat = val.lat > acc.northEast.lat ? val.lat : acc.northEast.lat
      acc.northEast.lng = val.lng > acc.northEast.lng ? val.lng : acc.northEast.lng
      acc.southWest.lat = val.lat < acc.southWest.lat ? val.lat : acc.southWest.lat
      acc.southWest.lng = val.lng < acc.southWest.lng ? val.lng : acc.southWest.lng
      return acc
    },
    {
      northEast: {
        lat: locations[0].lat,
        lng: locations[0].lng,
      },
      southWest: {
        lat: locations[0].lat,
        lng: locations[0].lng,
      },
    }
  )
  return bbox
}

/**
 * Creates a bounding box around a list location, with parameters about the distance calculated * (based on predefined internal logic)
 * from a give TravelOptions.
 * The bounding box returned will be the maximum bounding box that will include all bounding boxes generated for each location
 *
 * @param sources
 * @param options
 */
export function boundingBoxListWithinTravelOptions(
  sources: LatLng[],
  options: {
    maxEdgeWeight: number
    edgeWeight: 'time' | 'distance'
    travelType: TravelType
  }
): BoundingBox {
  const maxEdgeWeight = options.maxEdgeWeight
  const speed: number = getSpeed(options)
  const distanceKm =
    options.edgeWeight === 'distance' ? Math.round(maxEdgeWeight / 1000) : (speed * maxEdgeWeight) / 3600

  const boundingBoxResult = {
    northEast: {
      lat: -Infinity,
      lng: -Infinity,
    },
    southWest: {
      lat: Infinity,
      lng: Infinity,
    },
  }

  sources.forEach((source) => {
    const box = boundingBox(source, distanceKm)

    boundingBoxResult.northEast.lat = Math.max(boundingBoxResult.northEast.lat, box.northEast.lat)
    boundingBoxResult.northEast.lng = Math.max(boundingBoxResult.northEast.lng, box.northEast.lng)
    boundingBoxResult.southWest.lat = Math.min(boundingBoxResult.southWest.lat, box.southWest.lat)
    boundingBoxResult.southWest.lng = Math.min(boundingBoxResult.southWest.lng, box.southWest.lng)
  })

  return boundingBoxResult
}

/**
 * Given a list of locations return only those that are within `distanceKm` to any location in the
 * `from` list, and which are not included in the `from` locations
 *
 * @param locations
 * @param from
 * @param distanceKm
 */
export function locationsWithinDistance<T extends LatLng>(locations: T[], from: LatLng | LatLng[], distanceKm: number) {
  if (from instanceof Array) {
    return locationsWithinDistanceInclusive(locations, from, distanceKm).filter(
      (location) => !from.some((item) => item == location)
    )
  } else {
    return locationsWithinDistanceInclusive(locations, from, distanceKm).filter((location) => from != location)
  }
}

/**
 * Given a list of locations return only those that are within `distanceKm` to any location in the  `from` list
 *
 * @param locations
 * @param from
 * @param distanceKm
 */
export function locationsWithinDistanceInclusive<T extends LatLng>(
  locations: T[],
  from: LatLng | LatLng[],
  distanceKm: number
) {
  if (from instanceof Array) {
    return locations.filter((location) => from.some((point) => calculateDistance(location, point) <= distanceKm))
  } else {
    return locations.filter((location) => calculateDistance(location, from) <= distanceKm)
  }
}

/**
 *
 * @param point
 * @param elevation
 */
export function webMercatorToLatLng(point: { x: number; y: number }, elevation: number) {
  const latlng = projection.sphericalMercator.unproject(point)

  if (elevation != undefined) {
    // x,y,z given so we have elevation data
    return { lat: latlng.lat, lng: latlng.lng, elevation }
  } else {
    // no elevation given, just unproject coordinates to lat/lng
    return latlng
  }
}

/**
 *
 * @param latlng
 */
export function latLngToWebMercator(latlng: LatLng) {
  const point = projection.sphericalMercator.project(latlng)
  // point.x *= 6378137
  // point.y *= 6378137
  return point
}
