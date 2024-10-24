import type { Geometry } from 'geojson'
import type { Location, OSMType, PoiGroup, TravelMode, TravelTimeFactors } from '..'
import type { TravelType } from '../types'

export type CriterionType =
  | 'statisticsSum'
  | 'statisticsMax'
  | 'statisticsSumInZone'
  | 'statisticsDistance'
  | 'poiCoverageCount'
  | 'poiCoverageDistance'
  | 'closestPoiDistance'
  | 'poiCountInZone'
  | 'gravitationSum'
  | 'poiGravitationSum'
  | 'staypointCount'
  | 'mathAggregation'
  | 'edgeStatistics'
  | 'transitStopsSum'
  | 'transitStopsDistance'
  | 'statisticsOnEnclosingCell'
  | 'polygonArea'
  | 'statisticsDistanceAverage'

/**
 * Base inteface with the properties that all criteria share
 */
export interface BaseCriterion {
  /**
   * Determines what quality criterion we want to supply
   */
  type: CriterionType

  /**
   * Defines how the score is weighted by the distance of each reachable objects.
   * The more negative it is the more the closest object from the location influences the score.
   * Default value is '-2': in that case the score is quadratic.
   */
  distanceExponent?: number

  /**
   *
   * @default 1/300
   */
  scalingFactor?: number

  /**
   * @default 1
   */
  distanceModifier?: number

  /**
   * @default 0
   */
  lowerBound?: number

  metadata?: {
    [langCode: string]: { name?: string; description?: string }
  }
}

export interface RoutingOptions {
  routingValueOffset: number
  routingValueMultiplier: number
}

/**
 * Specialization of the Base criteion for all criteria that do reachability
 */
export interface BaseReachabilityCriterion extends BaseCriterion {
  /**
   * URL to targomo core service
   */
  coreServiceUrl: string

  /** Determines the dimension of the edges' weights, i.e. time (distance in seconds) or distance (distance in meters).
   * 'distance' Will optimize for distance and search for the shortest route,
   * 'time' will optimize for time and will search for the fastest route.
   * Distance cannot be used with travelType 'transit' and with Gravitational Criterion */
  edgeWeight: 'time' | 'distance'

  /** The maximum distance 'depth' of the built network in seconds (for edgeWeight = time) or meters (for edgeWeight = distance).
   * The upper limit of this variable is based on your subscription plan and differs between distance and time.
If it is set too low routes between points won't be found */
  maxEdgeWeight: number

  /** This field defines what travel mode is used for routing.
   * All travel modes are build similarly but differ in some way, 'rush-hour' for 'car' or the 'date/time' for 'transit'. */
  travelMode: TravelMode

  /** Whether or not the elevation heuristic will be used (e.g. downhill with bike quicker than uphill).
   * @default true
   */
  elevation?: boolean

  travelTimeFactors?: TravelTimeFactors

  competingRoutingOptions?: RoutingOptions[]

  /**
   * If the reverse flag is set to true, the routing algorithm will invert direction restrictions (one way roads, turning restrictions, ect) to simulate a to the source(s).
   * For polygon routing this can be used to calculate the polygon/area that could reach the source(s).
   *
   * @default false
   */
  reverse?: boolean

  /**
   * Under some circumstances, the actual maxEdgeWeight does not represent the actual time/distance we want to model.
   * In this case virtualMaxEdgeWeight can be set to indicate what intended maxEdgeWeight was meant.
   * (Used for ui only currently)
   */
  virtualMaxEdgeWeight?: number
}

/**
 * Specialization of the Base criteion for all criteria that do reachability and request statistics
 */
export interface BaseStatisticsCriterion extends BaseCriterion {
  /** @deprecated use statisticCollectionId instead
   *  The Statistic Group to be used as data source
   */
  statisticGroupId?: number

  /** The Statistic colleciton (== ensemble) to be used as data source */
  statisticCollectionId?: number

  /** List of statistic ids to consider for the reachability calculation.
   * If the list contains several elements, the score will be the sum of the statistics data of each statisticId */
  statisticsIds?: number[]

  /** @default 'https://api.targomo.com/statistics/' */
  statisticsServiceUrl?: string
}

export interface BasePoiCriterion extends BaseCriterion {
  /** list of Osm Types to consider for this criterion */
  osmTypes: (OSMType | PoiGroup)[]
  /** When referenceOsmTypes are set, the service will also calculate the reachability for the list of types in referenceOsmTypes
   * and the score will be the fraction: score(osmTypes) / score(referenceOsmTypes) */
  referenceOsmTypes?: (OSMType | PoiGroup)[]
  /** default: 'https://api.targomo.com/pointofinterest/' */
  poiServiceUrl?: string
  /**
   * Type of match for the combination of tags.
   * - `match: 'any'` (by default if not specified) means that the service will retrieve all POIs that contain at least one tag of the request.
   * - `match: 'all'` means that it will retrieve all POIs that contain all tags of the request.
   *
   * @default 'any'
   */
  match?: 'ALL' | 'ANY' | 'all' | 'any'
}

export interface BaseGravitationCriterion {
  /** This attribute specifies the exponential power to be applied on values based on proximity to any source.
   * When customized, it is advised to be a negative value to express correctly the gravitation attraction.
   * @example A high negative lambda, e.g. -4, means that the distance plays a bigger role in the probability to favor a store/location
   * @example a lower negative lambda, e.g. -1.5, means a lower influence of the travel distance towards a probability
   * @default -2 */
  gravitationExponent?: number

  /**
   * can be used to override root level competitors
   */
  competitors?: Location[]
}

export interface PointOfInterestReachabilityCriterion extends BasePoiCriterion, BaseReachabilityCriterion {
  /** must be one of these values
  @example poiCoverageCount: the retrieved score is the number of POIs reachable from the location
  @example poiCoverageDistance: the retrieved score is the sum of the scores weighted by the distance of each reachable POI.
   * The higher the distance between the location and the considered POI is, the smaller is the score.
  @example closestPoiDistance: the retrieved score is the score weighted by the distance of the closest POI reachable from the location
    */
  type: 'closestPoiDistance' | 'poiCoverageCount' | 'poiCoverageDistance'
}

export interface PointOfInterestGravitationCriterion
  extends BasePoiCriterion,
    BaseReachabilityCriterion,
    BaseGravitationCriterion {
  type: 'poiGravitationSum'
}

export interface PointOfInterestInZoneCriterion extends BasePoiCriterion {
  /** 
    @example poiCountInZone: count the number of points in a geojson polygon
    */
  type: 'poiCountInZone'
}

export interface StatisticsReachabilityCriterion extends BaseStatisticsCriterion, BaseReachabilityCriterion {
  /** must be one of these values
  @example statisticsSum: the retrieved score is the sum of the data of all statistics cells reachable from the location
  @example statisticsDistance: the retrieved score is the sum for each reachable statistics cell of the product of
   * the weighted distance of each statistics cell and its statistics data
    */
  type: 'statisticsSum' | 'statisticsDistance' | 'statisticsMax'

  /** When referenceStatisticsIds are set, the service will also calculate the reachability for
   * the list of ids in referenceStatisticsIds and the score will be the fraction: score(osmTypes) / score(referenceStatisticsIds) */
  referenceStatisticsIds?: number[]
}

export interface StatisticsInZoneCriterion extends BaseStatisticsCriterion {
  type: 'statisticsSumInZone'
}

export interface StatisticsGravitationCriterion
  extends BaseStatisticsCriterion,
    BaseReachabilityCriterion,
    BaseGravitationCriterion {
  /** Must be equal to
   * @example gravitationSum: the retrieved score is the sum of the data of all statistics cells reachable from
   * the location according to the gravitational model.
   * By default, for each location, the gravitational score is calculated with the other locations as competitors
   * For more details about the gravitational model: https://www.targomo.com/how-to-select-the-ideal-branch-location-with-science
   */
  type: 'gravitationSum'
}

export interface StatisticsOnEnclosingCellCriterion extends BaseStatisticsCriterion {
  type: 'statisticsOnEnclosingCell'
}

export interface StatisticsDistanceAverageCriterion extends BaseStatisticsCriterion, BaseReachabilityCriterion {
  type: 'statisticsDistanceAverage'
}

export interface PolygonAreaCriterion extends BaseStatisticsCriterion, BaseReachabilityCriterion {
  type: 'polygonArea'

  /**
   * Srid of the polygon
   */
  srid: number

  /**
   * The simplify (meters) parameter needs to be larger than 0m and smaller or equal to 500m.
   * If not specified it will be calculated from the buffer size (if it was specified).
   */
  simplify: number

  /**
   * Determines the geometry buffer size of the original polygon edges.
   * The newly created polygon is wider by that margin.
   * If specified it has to be greater than 0.0;
   * If no simplify is specified it will force a simplify value.
   * If nothing is specified no buffer will be added.
   */
  buffer: number

  /**
   * Due to the buffer the vertices of the polygon are extended in semi-circle way.
   * This value determines into how many segments a 90 degree angle is translated.
   * A low value means less polygon points but also less smooth corners. Cannot be higher than 8.
   */
  quadrantSegments: number
}

export interface StaypointCriterion extends BaseCriterion {
  type: 'staypointCount'
  radius: number
  dayEnd?: number
  dayOfYearEnd?: number
  dayOfYearStart?: number
  dayStart?: number
  hourEnd?: number
  hourStart?: number
  mobilityServiceUrl?: string
  unique?: true
}

export interface MathCriterion extends BaseCriterion {
  type: 'mathAggregation'
  criterionParameters: Record<string, QualityCriterion>
  mathExpression: string
}

interface BaseEdgeStatisticsCriterion extends BaseCriterion {
  type: 'edgeStatistics'
  edgeStatisticsServiceUrl?: string
  edgeStatisticCollectionId: number
  edgeStatisticId: number
  travelType?: TravelType
  direction?: 0 | 1 | 2 | 'any' | 'sum' | 'mean'
  ignoreRoadClasses?: number[]
}

interface EdgeStatisticsCriterionRadius extends BaseEdgeStatisticsCriterion {
  radius: number
}

interface EdgeStatisticsCriterionRadii extends BaseEdgeStatisticsCriterion {
  radii: number[]
}

export type EdgeStatisticsCriterion = EdgeStatisticsCriterionRadius | EdgeStatisticsCriterionRadii

export interface TransitCriterion extends BaseCriterion {
  type: 'transitStopsSum' | 'transitStopsDistance'
  startTime: number
  endTime: number
  referenceInterval?: number
}

export type QualityCriterion =
  | PointOfInterestReachabilityCriterion
  | PointOfInterestInZoneCriterion
  | PointOfInterestGravitationCriterion
  | StatisticsReachabilityCriterion
  | StatisticsOnEnclosingCellCriterion
  | StatisticsInZoneCriterion
  | StatisticsGravitationCriterion
  | StatisticsDistanceAverageCriterion
  | StaypointCriterion
  | MathCriterion
  | EdgeStatisticsCriterion
  | TransitCriterion
  | PolygonAreaCriterion

/** Criterion definitions
 * For each criterion, a key must be set to be able to identify the different criteria in the response */
export type QualityRequestCriteria = Record<string, QualityCriterion>

export interface QualityGeometry {
  id: string
  geometry: Geometry
  crs?: number
}

export interface QualityPayload<T extends Location | QualityGeometry = Location> {
  locations: T[]
  potentialLocations?: T[]
  competitors?: Location[]
  criteria: QualityRequestCriteria
  showDetails?: boolean
}
