import { RouteSegment } from './routeSegment'
import { LatLng } from '../index';
import * as geometry from '../../geometry'
import { TargomoClient } from '../../api/targomoClient';

// NOTE simply copied from r360-js without rewriting much....check do we need it like this?
// need to go through everything again and check
export class Route {
  // NOTE: made public for now...need to go thought this again in the future
  travelTime: number
  routeSegments: RouteSegment[]
  points: LatLng[]
  uphillMeter: number
  downhillMeter: number
  targetHeight: number
  sourceHeight: number
  sourceId: any
  targetId: any
  length: number
  transfers: any

  // TODO: consider making the costructor not couped with return values from service
  constructor(client: TargomoClient, travelTime: number, segments: any[], meta: any) {
    this.travelTime      = travelTime
    this.routeSegments   = []
    this.points          = []
    this.uphillMeter     = 0
    this.downhillMeter   = 0
    this.targetHeight    = undefined
    this.sourceHeight    = undefined
    this.sourceId        = undefined
    this.targetId        = undefined
    this.length          = undefined
    this.transfers       = 0

    // the server delivers the route from target to source
    segments.reverse().forEach((segment) => {
      let routeSegment = new RouteSegment(client, segment)
      this.routeSegments.push(routeSegment)

      if (routeSegment.type === 'TRANSFER') {
        this.transfers++
      }

      this.points = this.points.concat(routeSegment.getPoints().reverse())
    })


    if (typeof meta !== 'undefined') {
        this.sourceId = meta.source_id
        this.targetId = meta.target_id
        this.length   = meta.length
    }

    this.setElevationDifferences() // TODO: should this be called here?
  }

  equals(route: Route) {
    return this.getKey() === route.getKey()
  }

  getKey() {
    let key: string = '' + this.travelTime
    let points = ''

    this.getSegments().forEach((segment: RouteSegment) => {
      key += ' ' + segment.getRouteShortName() + ' ' + segment.getDepartureTime() + ' ' + segment.getArrivalTime()

      segment.getPoints().forEach((point: LatLng) => {
        points += ' ' + point.lat + '' + point.lng
      })
    })

    return key + points
  }

  /*
    *
    */
  addRouteSegment(routeSegment: RouteSegment) {
    this.routeSegments.push(routeSegment)
  }

  /*
    *
    */
  setTravelTime(travelTime: number) {
    this.travelTime = travelTime
  }

  /*
    *
    */

  getDistance() {
    let distance = 0
    for (let i = 0; i < this.routeSegments.length; i++) {
      distance += this.routeSegments[i].getDistance()
    }
    return distance
  }

  /**
   * [getElevationGain description]
   * @return {type} [description]
   */
  getElevationGain() {
    let distance = 0
    for (let i = 0; i < this.routeSegments.length; i++) {
      distance += this.routeSegments[i].getElevationGain()
    }
    return distance
  }

  /**
   * [getElevations description]
   * @return {type} [description]
   */
  getElevations() {
    let elevations = <any>{x: [] , y: []} // FIXME: type

    for (let i = 0 ; i < this.getDistance() * 1000 ; i = i + 100 ) {
      elevations.x.push((i / 1000) + ' km' )
      elevations.y.push(this.getElevationAt(i))
    }

    return elevations
  }

  /**
   * [getElevationAt description]
   * @param  {type} meter [description]
   * @return {type}       [description]
   */
  getElevationAt(meter: number) {
    let currentLength = 0

    for (let i = 1; i < this.points.length ; i++) {
      let previousPoint   = this.points[i - 1]
      let currentPoint    = this.points[i]
      // let currentDistance =  previousPoint.distanceTo(currentPoint)
      let currentDistance = geometry.calculateDistance(previousPoint, currentPoint)
      // TODO: check if there are bugs in the new geometry calculate distance method...also rename it...call it distance

      currentLength += currentDistance

      if ( currentLength > meter ) {
        return currentPoint.elevation
      }
    }
  }

  /*
    *
    */
  getSegments() {
    return this.routeSegments
  }

  getUphillElevation() {
    return this.uphillMeter
  }

  getDownhillElevation() {
    return this.downhillMeter
  }

  getTotalElevationDifference() {
    return Math.abs(this.sourceHeight - this.targetHeight)
  }

  // TODO: check again what this does
  setElevationDifferences() {
    let previousHeight = undefined

    for (let i = this.points.length - 1; i >= 0 ; i--) {
      if (i == 0) {
        this.targetHeight = this.points[i].elevation
      }

      if (i == this.points.length - 1) {
        this.sourceHeight = this.points[i].elevation
      }

      if (typeof previousHeight != 'undefined') {
        // we go up
        if (previousHeight > this.points[i].elevation) {
          this.uphillMeter += (previousHeight - this.points[i].elevation)
        } else if ( previousHeight < this.points[i].elevation ) {
          // and down
          this.downhillMeter += (this.points[i].elevation - previousHeight)
        }
      }

      previousHeight = this.points[i].elevation
    }
  } // check why this was like this in original

  /*
    *
    */
  getTravelTime() {
    return this.travelTime
  }
}
