import {
  TravelSpeedValues, TravelSpeed,
  TravelType,
  TravelTimeFactors} from './types'

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


    /**
    * Specifies factors with which the travel times of the edges are adjusted.
    * This may be necessary in certain areas where the travel time calculation is
    * almost always off by a certain factor, e.g. Paris rush hour.
    *
    * "travelTimeFactors" : { "all":0.5, "motorway":1.5, .... (other specific edge classes possible) },..
    *
    * Further specifics about the TravelTimeFactors:
    *
    * travel time factor of 1.5 means 50% more time is needed
    * travel time factor 'all' is applied to ALL edge classes
    * (on top of a specified one, e.g. for the example above 1.5*0.5=0.75 - the final applied travel time factor for 'motorway' edges)
    * all elements are optional, min allowed cumulative travel time factor is 0.5; maximum allowed cumulative travel time factor is 100.0
    * elements that are not recognised are ignored
    * transit travel times are not affected by the travelTimeFactors
     */
    travelTimeFactors?: TravelTimeFactors;
}

export interface TravelRequestOptions extends TravelMoreRequestOptions, TravelTypeEdgeWeightOptions {
}
