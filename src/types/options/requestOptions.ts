import {
  TravelSpeedValues,
  TravelType,
  TravelTimeFactors
} from '../types'


export class UseCacheRequestOptions {
  useClientCache: boolean;
}

export class BaseRequestOptions {
  requestTimeout?: number;

  /**
   * @General Determines the dimension of the edges' weight, i.e.
   * @Format time (distance in seconds) or distance (distance in meters)
   * @Default `'time'`
   */
  edgeWeight?: 'time' | 'distance' = 'time';

  /*
   * @General The maximum distance "depth" of the built network.
   * @Format in seconds (for edgeWeight = time) or meters (for edgeWeight = distance).
   * @Performance If it is set too low routes between points won't be found.
   * If it is set high the routing/time service will take longer.
   * @Default `1800`
   */
  maxEdgeWeight?: number;

  /**
   * @General Whether or not the an elevetion heuristic will be used (e.g. downhill with bike quicker then uphill).
   * @Default `false`
   */
  elevation?: boolean;

  /**
   * @General Specifies factors with which the travel times of the edges are adjusted.
   * This may be necessary in certain areas where the travel time calculation is
   * almost always off by a certain factor, e.g. Paris rush hour.
   * Transit travel times are not affected by the travelTimeFactors
   * @Example
   * ``` js
   * "travelTimeFactors" : { "all":0.5, "motorway":1.5, .... (other specific edge classes possible) },..
   * ```
   * @Min Minimum allowed cumulative travel time factor is `0.5`
   * @Max Maximum allowed cumulative travel time factor is `100.0`
   * @Format
   * Travel time factor of 1.5 means 50% more time is needed
   * (on top of a specified one, e.g. for the example above 1.5*0.5=0.75 - the final applied travel time factor for 'motorway' edges)
   * @Nullable All elements are optional
   */
  travelTimeFactors?: TravelTimeFactors;

}


export class TravelRequestOptions extends BaseRequestOptions {

  /**
   * Date and time of a transit request. Should either be a `Date` or a string/number that can be used in the constructor of `Date`.
   * Using this option overrides `transitFrameDate` and `transitFrameTime`.
   */
  transitFrameDateTime?: string | number | Date;

  /**
   * Time-frame duration in seconds
   */
  transitFrameDuration?: number = undefined

  /**
   * Date of the transit request in the format `YYYYMMDD`
   */
  transitFrameDate?: number = 20170801

  /**
   * Start time of the transit request in seconds from midnight
   */
  transitFrameTime?: number = 39600

  /**
   * Maximum transfer segements in a route
   */
  transitMaxTransfers?: number = -1

  /**
   * Maximum time in seconds to walk to the first station
   */
  transitMaxWalkingTimeFromSource?: -1

  /**
   * Route types to avoid. https://developers.google.com/transit/gtfs/reference/#routestxt
   */
  transitAvoidTransitRouteTypes?: number[] = []

  travelType?: TravelType;

  /**
   * @General Enable the rush hour mode to simulate a more crowded street. Warning this is a paid feature so not
   * all plans are allowed to enable it.
   * @Default `false`
   */
  rushHour?: boolean;

  walkSpeed?: TravelSpeedValues = {}
  bikeSpeed?: TravelSpeedValues = {}
}
