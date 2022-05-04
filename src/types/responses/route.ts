import { RouteSegment } from './routeSegment'
import { LatLng } from '../index'
import { TargomoClient } from '../../api/targomoClient'

/**
 *
 */
export class Route {
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
  readonly distance: number
  readonly elevationGain: number

  constructor(client: TargomoClient, travelTime: number, segments: any[], meta: any) {
    this.travelTime = travelTime
    this.routeSegments = []
    this.targetHeight = undefined
    this.sourceHeight = undefined
    this.sourceId = undefined
    this.targetId = undefined
    this.length = undefined

    let transfers = 0
    let points: LatLng[] = []
    // the server delivers the route from target to source
    segments.reverse().forEach((segment) => {
      const routeSegment = new RouteSegment(client, segment)
      this.routeSegments.push(routeSegment)

      if (routeSegment.type === 'TRANSFER') {
        transfers++
      }

      points = points.concat(routeSegment.points.reverse())
    })

    this.points = points
    this.transfers = transfers

    if (typeof meta !== 'undefined') {
      this.sourceId = meta.source_id
      this.targetId = meta.target_id
      this.length = meta.length
    }

    const elevationDifferences = this.calculateElevationDifferences()

    this.targetHeight = elevationDifferences.targetHeight
    this.sourceHeight = elevationDifferences.sourceHeight
    this.uphillMeter = elevationDifferences.uphillMeter
    this.downhillMeter = elevationDifferences.downhillMeter

    this.totalElevationDifference = Math.abs(this.sourceHeight - this.targetHeight)

    this.departureTime = this.calculateDepartureTime()
    this.arrivalTime = this.calculateArrivalTime()
    this.distance = this.calculateDistance()
    this.elevationGain = this.calculateElevationGain()
  }

  private calculateDistance() {
    let distance = 0
    for (let i = 0; i < this.routeSegments.length; i++) {
      distance += this.routeSegments[i].distance
    }
    return distance
  }

  private calculateElevationGain() {
    let distance = undefined
    for (let i = 0; i < this.routeSegments.length; i++) {
      if (isFinite(this.routeSegments[i].elevationGain)) {
        distance = (distance || 0) + this.routeSegments[i].elevationGain
      }
    }
    return distance
  }

  // TODO: check again what this does
  private calculateElevationDifferences() {
    let previousHeight = undefined

    let targetHeight = undefined
    let sourceHeight = undefined

    let uphillMeter = 0
    let downhillMeter = 0

    for (let i = this.points.length - 1; i >= 0; i--) {
      if (i == 0) {
        targetHeight = this.points[i].elevation
      }

      if (i == this.points.length - 1) {
        sourceHeight = this.points[i].elevation
      }

      if (typeof previousHeight != 'undefined') {
        // we go up
        if (previousHeight > this.points[i].elevation) {
          uphillMeter += previousHeight - this.points[i].elevation
        } else if (previousHeight < this.points[i].elevation) {
          // and down
          downhillMeter += this.points[i].elevation - previousHeight
        }
      }

      previousHeight = this.points[i].elevation
    }

    return { targetHeight, sourceHeight, uphillMeter, downhillMeter }
  } // check why this was like this in original

  private calculateDepartureTime() {
    let travelTime = 0

    for (let i = 0; i < this.routeSegments.length; i++) {
      const segment = this.routeSegments[i]

      if (segment.departureTime != null) {
        return segment.departureTime - travelTime
      } else {
        travelTime += segment.travelTime || 0
      }
    }

    return undefined
  }

  private calculateArrivalTime() {
    let travelTime = 0

    for (let i = this.routeSegments.length - 1; i >= 0; i--) {
      const segment = this.routeSegments[i]

      if (segment.arrivalTime != null) {
        return segment.arrivalTime + travelTime
      } else {
        travelTime += segment.travelTime || 0
      }
    }

    return undefined
  }
}
