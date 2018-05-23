import * as geometry from '../../geometry'
import { TargomoClient } from '../../api/targomoClient';

/*
 * NOTE: just copied from r360-js without much thought...
 * NOTE: do we want to keep the java like getter/setter stuff?
 */
export class RouteSegment {
  type: string

  private points: any[]
  private travelTime: number
  private distance: number
  private warning: string
  private elevationGain: number
  private transitSegment: boolean
  private startname: string
  private endname: string
  // private errorMessage: string

  private color: string
  private haloColor: string
  private routeType: any
  private routeShortName: string
  private departureTime: any
  private arrivalTime: any
  private tripHeadSign: any

  // TODO: figure ou the propert types for all these
  constructor(client: TargomoClient, segment: any) {
    this.points          = []
    this.type            = segment.type
    this.travelTime      = segment.travelTime

    /*
    * TODO don't call it length! in route length refers to the array length.
    * Call it distance instead
    */

    this.distance        = segment.length / 1000
    this.warning         = segment.warning
    this.elevationGain   = segment.elevationGain
    // this.errorMessage
    this.transitSegment  = false
    this.startname       = segment.startname
    this.endname         = segment.endname

    // build the geometry
    segment.points.forEach((point: number[]) => {
      this.points.push(geometry.webMercatorToLatLng({x: point[1], y: point[0]}, point[2]))
    })

    // in case we have a transit route, we set a color depending
    //  on the route type (bus, subway, tram etc.)
    // and we set information which are only available
    // for transit segments like depature station and route short sign
    if ( segment.isTransit ) {
      // let colorObject     = client.config.routeTypes.filter(row => row.routeType === segment.routeType)[0]
      // let colorObject     = r360.findWhere(ROUTE_TYPES, {routeType: segment.routeType})
      // this.color          = colorObject && colorObject.color || 'RED'
      // this.haloColor      = colorObject && colorObject.haloColor || 'WHITE'
      this.transitSegment = true
      this.routeType      = segment.routeType
      this.routeShortName = segment.routeShortName
      this.startname      = segment.startname
      this.endname        = segment.endname
      this.departureTime  = segment.departureTime
      this.arrivalTime    = segment.arrivalTime
      this.tripHeadSign   = segment.tripHeadSign
    } else {
      // let colorObject     = client.config.routeTypes.filter(row => row.routeType === segment.routeType)[0]
      // let colorObject     = r360.findWhere(ROUTE_TYPES, {routeType: segment.type})
      // this.color          = colorObject && colorObject.color || 'RED'
      // this.haloColor      = colorObject && colorObject.haloColor || 'WHITE'
    }
  }

  // TODO: do we want all the getters and setters? or should we allow direct property access instead (can be `readonly` in typescript)

  getPoints() {
    return this.points
  }

  getType() {
    return this.type
  }

  getHaloColor() {
    return this.haloColor
  }

  getColor() {
    return this.color
  }

  getTravelTime() {
    return this.travelTime
  }

  getDistance() {
    return this.distance
  }

  getRouteType() {
    return this.routeType
  }

  getRouteShortName() {
    return this.routeShortName
  }

  getStartName() {
    return this.startname
  }

  getEndName() {
    return this.endname
  }

  getDepartureTime() {
    return this.departureTime
  }

  getArrivalTime() {
    return this.arrivalTime
  }

  getTripHeadSign() {
    return this.tripHeadSign
  }

  getWarning() {
    return this.warning
  }

  getElevationGain() {
    return this.elevationGain
  }

  isTransit() {
    return this.transitSegment
  }
}
