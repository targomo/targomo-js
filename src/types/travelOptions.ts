import {
  TravelSpeedValues, TravelSpeed,
  TravelType } from './types'

// renamed from traveloptions to make it clear it no longer is the big traveloptions frmo before,
// now it is more of a mixin for stuff used in some places

export interface TravelTypeOptions {
  travelType: TravelType
  edgeWeight?: 'time' | 'distance'
}

export interface TravelTypeEdgeWeightOptions extends TravelTypeOptions {
  maxEdgeWeight: number
}

export interface TravelOptionsClientCache {
  useClientCache?: boolean
}

export interface TravelMoreRequestOptions {
  travelSpeed?: TravelSpeed
  walkSpeed?: TravelSpeedValues
  bikeSpeed?: TravelSpeedValues

  closestSources?: boolean
  requestTimeout?: number

  rushHour?: boolean

  // not general options
  reverse?: boolean /// ?
  // recommendations?: boolean = false /// ?

  // only polygon?
  // pathSerializer: string = 'compact'
  // polygonSerializer: string = 'json'
  // pointReduction: boolean = true;

  transitFrameDuration?: number
  transitFrameDate?: number
  transitFrameTime?: number

  /**
   * Accepts either a javascript date object or a timestamp number
   */
  transitFrameDateTime?: Date | number

  // date = this.transitFrameDate // deprecated
  // time = this.transitFrameTime // deprecated

  elevation?: boolean
  useCache?: boolean
  // travelTimesDistances: number[] = null //elsewhere where appliacble
}

export interface TravelRequestOptions extends TravelMoreRequestOptions, TravelTypeEdgeWeightOptions {
}
