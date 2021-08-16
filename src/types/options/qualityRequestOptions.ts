import { CoreServiceUrl, OSMType, PoiGroup, TravelMode, TravelTimeFactors } from "..";

export interface QualityRequestOptions {
  [criteriaId: string]: (PointOfInterestCriterion | StatisticsCriterion | GravitationalCriterion)
}


interface BaseCriterion {
  /** This is the service URL to which the Targomo Reachability requests are dispatched. The endpoint has to correspond to the addresses
   * @example if you want to execute reachabilities in Belgium you need to point to a Targomo Endpoint that includes Belgium geographically (https://api.targomo.com/westcentraleurope/) */
  coreServiceUrl: CoreServiceUrl

  /** Determines the dimension of the edges' weights, i.e. time (distance in seconds) or distance (distance in meters). 'distance' Will optimize for distance and search for the shortest route, 'time' will optimize for time and will search for the fastest route.
   * Distance cannot be used with travelType 'transit' and with Gravitational Criterion */
  edgeWeight: ("time" | "distance")

  /** The maximum distance "depth" of the built network in seconds (for edgeWeight = time) or meters (for edgeWeight = distance). The upper limit of this variable is based on your subscription plan and differs between distance and time.
If it is set too low routes between points won't be found */
  maxEdgeWeight: number

  /** This field defines what travel mode is used for routing. All travel modes are build similarly but differ in some way, 'rush-hour' for 'car' or the 'date/time' for 'transit'. */
  travelMode: TravelMode

  /** Whether or not the elevation heuristic will be used (e.g. downhill with bike quicker than uphill).
   * @default true
   */
  elevation?: boolean

  travelTimeFactors?: TravelTimeFactors
}


export interface PointOfInterestCriterion extends BaseCriterion {
  /** must be one of these values
  @example poiCoverageCount: the retrieved score is the number of POIs reachable from the location
  @example poiCoverageDistance: the retrieved score is the sum of the scores weighted by the distance of each reachable POI. The higher the distance between the location and the considered POI is, the smaller is the score.
  @example closestPoiDistance: the retrieved score is the score weighted by the distance of the closest POI reachable from the location
    */
  type: ("closestPoiDistance" | "poiCoverageCount" | "poiCoverageDistance")
  /** list of Osm Types to consider for this criterion */
  osmTypes: (OSMType[] | PoiGroup[])
  /** When referenceOsmTypes are set, the service will also calculate the reachability for the list of types in referenceOsmTypes and the score will be the fraction: score(osmTypes) / score(referenceOsmTypes) */
  referenceOsmTypes?: (OSMType[] | PoiGroup[])
  /** default: "https://api.targomo.com/pointofinterest/" */
  poiServiceUrl?: string
}


export interface StatisticsCriterion extends BaseCriterion {
  /** must be one of these values
  @example statisticsSum: the retrieved score is the sum of the data of all statistics cells reachable from the location
  @example statisticsDistance: the retrieved score is the sum for each reachable statistics cell of the product of the weighted distance of each statistics cell and its statistics data
    */
  type: ("statisticsSum" | "statisticsDistance")

  /** The Statistic Group to be used as data source */
  statisticGroupId: number

  /** List of statistic ids to consider for the reachability calculation. If the list contains several elements, the score will be the sum of the statistics data of each statisticId */
  statisticsIds?: number[]

  /** When referenceStatisticsIds are set, the service will also calculate the reachability for the list of ids in referenceStatisticsIds and the score will be the fraction: score(osmTypes) / score(referenceStatisticsIds) */
  referenceStatisticsIds?: number[]

  /** @default "https://api.targomo.com/statistics/" */
  statisticsServiceUrl?: string
}


export interface GravitationalCriterion extends BaseCriterion {
  /** Must be equal to
   * @example gravitationSum: the retrieved score is the sum of the data of all statistics cells reachable from the location according to the gravitational model. By default, for each location, the gravitational score is calculated with the other locations as competitors
   * For more details about the gravitational model: https://www.targomo.com/how-to-select-the-ideal-branch-location-with-science
   */
  type: "gravitationSum"
  /** The Statistic Group to be used as data source */
  statisticGroupId: number
  /** List with statistic ids used for reachability calculation */
  statisticsIds?: number[]
  /** "https://api.targomo.com/statistics/" */
  statisticsServiceUrl?: string
  /** This attribute specifies the exponential power to be applied on values based on proximity to any source. When customized, it is advised to be a negative value to express correctly the gravitation attraction. A high negative lambda, e.g. -4, means that the distance plays a bigger role in the probability to favor a store/location
   * @example a lower negative lambda, e.g. -1.5, means a lower influence of the travel distance towards a probability
   * @default -2 */
  gravitationExponent?: number
}
