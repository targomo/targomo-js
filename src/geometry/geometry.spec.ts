import * as geometry from './'
import { LatLng, TravelType } from '..';

describe('geometry functions', () => {

  const pointA: LatLng = { lat: 52.5330232, lng: 13.356626 }
  const pointB: LatLng = { lat: 52.3881693, lng: 13.120117 }

  const travelOptions: {
    maxEdgeWeight: number,
    edgeWeight: 'time' | 'distance',
    travelType: TravelType
  } = { edgeWeight: 'time', maxEdgeWeight: 1800, travelType: 'bike' }

  test('caclulates distance from A to B', () => {
    const distance = geometry.calculateDistance(pointA, pointB)
    expect(typeof distance).toBe('number')
    expect(distance).toEqual(22.720092178969402)
  })

  test('checks if point is in generated bounding box', () => {
    const bbox = geometry.boundingBox(pointA, 10)
    expect(geometry.contains(bbox, pointA)).toBeTruthy()
    expect(geometry.contains(bbox, pointB)).toBeFalsy()
  })

  test('checks if point is in generated bounding box (based on travelOptions)', () => {
    const bbox = geometry.boundingBoxWithinTravelOptions(pointA, travelOptions)
    expect(geometry.contains(bbox, pointA)).toBeTruthy()
    expect(geometry.contains(bbox, pointB)).toBeFalsy()
  })

  test('checks if locations are near other locations based on travel Options', () => {

    const list: LatLng[] = [
      { lat: 52.470801, lng: 13.461207 },
      { lat: 52.547066, lng: 13.468370 },
      { lat: 52.419798, lng: 13.313163 },
      { lat: 52.561199, lng: 13.323150 },
      { lat: 52.394898, lng: 13.237982 },
      { lat: 52.543586, lng: 13.644493 },
      { lat: 52.556420, lng: 13.866752 },
      { lat: 52.308231, lng: 13.313811 },
      { lat: 52.688002, lng: 13.565722 },
      { lat: 52.477337, lng: 13.307870 },
      { lat: 52.552803, lng: 13.543695 },
      { lat: 52.160478, lng: 12.782020 },
      { lat: 52.635519, lng: 13.307739 },
      { lat: 52.504415, lng: 13.623472 },
      { lat: 52.448087, lng: 13.592949 },
      { lat: 51.527356, lng: 14.008664 },
      { lat: 52.459009, lng: 13.273529 },
      { lat: 52.437386, lng: 13.379717 },
      { lat: 52.526956, lng: 13.233364 },
      { lat: 52.595678, lng: 13.599013 },
      { lat: 52.765621, lng: 13.245856 },
      { lat: 52.539794, lng: 12.978691 },
      { lat: 51.778378, lng: 14.319643 }]
    const resultList = geometry.locationsWithinTravelOptions(list, [pointA], travelOptions);
    // 8 locations should be reachable from point A in 30 min by bike
    expect(resultList.length).toBe(8);
  })


  test('creation of bbox of locaiton array', () => {

    const list: LatLng[] = [
      { lat: 52.470801, lng: 13.461207 },
      { lat: 52.547066, lng: 13.468370 },
      { lat: 52.419798, lng: 13.313163 },
      { lat: 52.561199, lng: 13.323150 },
      { lat: 52.394898, lng: 13.237982 },
      { lat: 52.543586, lng: 13.644493 },
      { lat: 52.556420, lng: 13.866752 },
      { lat: 52.308231, lng: 13.313811 },
      { lat: 52.688002, lng: 13.565722 },
      { lat: 52.477337, lng: 13.307870 },
      { lat: 52.552803, lng: 13.543695 },
      { lat: 52.160478, lng: 12.782020 },
      { lat: 52.635519, lng: 13.307739 },
      { lat: 52.504415, lng: 13.623472 },
      { lat: 52.448087, lng: 13.592949 },
      { lat: 51.527356, lng: 14.008664 },
      { lat: 52.459009, lng: 13.273529 },
      { lat: 52.437386, lng: 13.379717 },
      { lat: 52.526956, lng: 13.233364 },
      { lat: 52.595678, lng: 13.599013 },
      { lat: 52.765621, lng: 13.245856 },
      { lat: 52.539794, lng: 12.978691 },
      { lat: 51.778378, lng: 14.319643 }]
    const bbox = geometry.boundingBoxFromLocationArray(list);
    expect(bbox.northEast.lat).toBe(52.765621);
    expect(bbox.northEast.lng).toBe(14.319643);
    expect(bbox.southWest.lat).toBe(51.527356);
    expect(bbox.southWest.lng).toBe(12.782020);
  })

})

