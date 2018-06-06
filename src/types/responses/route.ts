import { RouteSegment } from './routeSegment'
import { LatLng } from '../index';
import * as geometry from '../../geometry'
import { TargomoClient } from '../../api/targomoClient';

// NOTE simply copied from r360-js without rewriting much....check do we need it like this?
// need to go through everything again and check
export class Route {
  // NOTE: made public for now...need to go thought this again in the future
  readonly travelTime: number
  readonly routeSegments: RouteSegment[]
  readonly points: LatLng[]
  readonly uphillMeter: number
  readonly downhillMeter: number
  readonly targetHeight: number
  readonly sourceHeight: number
  readonly sourceId: any
  readonly targetId: any
  readonly length: number
  readonly transfers: any

  readonly departureTime: number
  readonly arrivalTime: number

  readonly totalElevationDifference: number

  // TODO: consider making the costructor not couped with return values from service
  constructor(client: TargomoClient, travelTime: number, segments: any[], meta: any) {
    this.travelTime      = travelTime
    this.routeSegments   = []
    // this.uphillMeter     = 0
    // this.downhillMeter   = 0
    this.targetHeight    = undefined
    this.sourceHeight    = undefined
    this.sourceId        = undefined
    this.targetId        = undefined
    this.length          = undefined

    let transfers = 0
    let points: LatLng[] = []
    // the server delivers the route from target to source
    segments.reverse().forEach((segment) => {
      let routeSegment = new RouteSegment(client, segment)
      this.routeSegments.push(routeSegment)

      if (routeSegment.type === 'TRANSFER') {
        transfers++
      }

      points = points.concat(routeSegment.points.reverse())
    })

    this.points          = points
    this.transfers       = transfers

    if (typeof meta !== 'undefined') {
        this.sourceId = meta.source_id
        this.targetId = meta.target_id
        this.length   = meta.length
    }

    const elevationDifferences = this.calculateElevationDifferences(this.points)

    this.targetHeight = elevationDifferences.targetHeight
    this.sourceHeight = elevationDifferences.sourceHeight
    this.uphillMeter = elevationDifferences.uphillMeter
    this.downhillMeter = elevationDifferences.downhillMeter

    this.totalElevationDifference =  Math.abs(this.sourceHeight - this.targetHeight)

    this.departureTime = this.calculateDepartureTime()
    this.arrivalTime = this.calculateArrivalTime()
  }

  // equals(route: Route) {
  //   return this.getKey() === route.getKey()
  // }

  // getKey() {
  //   let key: string = '' + this.travelTime
  //   let points = ''

  //   this.getSegments().forEach((segment: RouteSegment) => {
  //     key += ' ' + segment.getRouteShortName() + ' ' + segment.getDepartureTime() + ' ' + segment.getArrivalTime()

  //     segment.getPoints().forEach((point: LatLng) => {
  //       points += ' ' + point.lat + '' + point.lng
  //     })
  //   })

  //   return key + points
  // }

  /*
    *
    */

  getDistance() {
    let distance = 0
    for (let i = 0; i < this.routeSegments.length; i++) {
      distance += this.routeSegments[i].distance
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
      distance += this.routeSegments[i].elevationGain
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


  // TODO: check again what this does
  private calculateElevationDifferences(points: LatLng[]) {
    let previousHeight = undefined

    let targetHeight = undefined
    let sourceHeight = undefined

    let uphillMeter     = 0
    let downhillMeter   = 0

    for (let i = this.points.length - 1; i >= 0 ; i--) {
      if (i == 0) {
        targetHeight = this.points[i].elevation
      }

      if (i == this.points.length - 1) {
        sourceHeight = this.points[i].elevation
      }

      if (typeof previousHeight != 'undefined') {
        // we go up
        if (previousHeight > this.points[i].elevation) {
          uphillMeter += (previousHeight - this.points[i].elevation)
        } else if ( previousHeight < this.points[i].elevation ) {
          // and down
          downhillMeter += (this.points[i].elevation - previousHeight)
        }
      }

      previousHeight = this.points[i].elevation
    }

    return {targetHeight, sourceHeight, uphillMeter, downhillMeter}
  } // check why this was like this in original

  private calculateDepartureTime() {
    let travelTime = 0

    for (let i = 0; i < this.routeSegments.length; i++) {
      let segment = this.routeSegments[i]

      if (segment.departureTime != null) {
        return (segment.departureTime - travelTime)
      } else {
        travelTime += (segment.travelTime || 0)
      }
    }

    return undefined
  }

  private calculateArrivalTime() {
    let travelTime = 0

    for (let i = this.routeSegments.length - 1; i >= 0; i--) {
      let segment = this.routeSegments[i]

      if (segment.arrivalTime != null) {
        return (segment.arrivalTime - travelTime)
      } else {
        travelTime += (segment.travelTime || 0)
      }
    }

    return undefined
  }
}
