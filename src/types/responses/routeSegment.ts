import * as geometry from '../../geometry'
import { TargomoClient } from '../../api/targomoClient';
import { LatLng } from '../types';

/*
 * NOTE: just copied from r360-js without much thought...
 * NOTE: do we want to keep the java like getter/setter stuff?
 */
export class RouteSegment {
  readonly type: string

  readonly points: LatLng[]
  readonly travelTime: number
  readonly distance: number
  readonly warning: string
  readonly elevationGain: number
  readonly transitSegment: boolean
  readonly startName: string
  readonly endName: string

  readonly routeType: any
  readonly routeShortName: string
  readonly departureTime: number
  readonly arrivalTime: number
  readonly tripHeadSign: string

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
    this.startName       = segment.startname
    this.endName         = segment.endname

    // build the geometry
    segment.points.forEach((point: number[]) => {
      this.points.push(geometry.webMercatorToLatLng({x: point[1], y: point[0]}, point[2]))
    })

    // in case we have a transit route, we set a color depending
    //  on the route type (bus, subway, tram etc.)
    // and we set information which are only available
    // for transit segments like depature station and route short sign
    if ( segment.isTransit ) {
      this.transitSegment = true
      this.routeType      = segment.routeType
      this.routeShortName = segment.routeShortName
      this.startName      = segment.startname
      this.endName        = segment.endname
      this.departureTime  = segment.departureTime
      this.arrivalTime    = segment.arrivalTime
      this.tripHeadSign   = segment.tripHeadSign
    }
  }
}
