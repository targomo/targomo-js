import { Geometry } from 'geojson'

/**
 * A map coordinate
 */
export class LatLng {
  lat: number
  lng: number
  elevation?: number
}



/**
 * A map bounding box
 */
export class BoundingBox {
  northEast: LatLng
  southWest: LatLng
}

/**
 * Types for the `properties` part of a LatLngProperties object. The defined, non exhaustive, list contains some of the properties that
 * have meaning in various @targomo/client components
 */
export interface LatLngPropertiesObject {
  'marker-type'?: string
  'marker-size'?: number

  /**
   * Used by @targomo/client components to decide if a marker representing the location is active
   */
  'marker-active'?: boolean

  /**
   * Used by @targomo/client components to decide if a marker representing the location is draggable
   */
  'marker-draggable'?: boolean

  /**
   * Used by @targomo/client components to decide if a marker representing the location is clickable
   */
  'marker-clickable'?: boolean

  [index: string]: any
}

/**
 * A location on a map that
 */
export interface LatLngProperties extends LatLng {
  properties: LatLngPropertiesObject
}

export interface LatLngIdProperties extends LatLngProperties {
  id: any
}


/**
 *
 */
export type ReachableTile = { [tileId: number]: number }

/**
 * The available statistics groups of the statistic service and the vector tiles service
 */
export type StatisticsGroupId = number | StatisticsGroups

export enum StatisticsGroups {
  GERMANY_ZENSUS_100M_STATISTICS = 9,
  GERMANY_ZENSUS_200M_STATISTICS = 2,
  GERMANY_ZENSUS_500M_STATISTICS = 11,
  GERMANY_ZENSUS_1000M_STATISTICS = 3,
  GERMANY_ZENSUS_2000M_STATISTICS = 10,
  NORWAY_STATISTICS = 4,
  CENSUS_BRANDENBURG_POPULATION = 12,
  CANADA_BLOCK_STATISTICS = 8,
  CANADA_AREA_STATISTICS = 5,
  BERLIN_STATISTICS = 6,
}

/**
 *
 */
export type TravelSpeed = 'slow' | 'medium' | 'fast'

/**
 *
 */
export type TravelType = 'walk' | 'car' | 'bike' | 'transit'


export class TravelSpeedValues {
  /** Assumed speed in km/h
   * @default 5
 */
  speed?: number

  /** Uphill penalty specifies by how much a distance is enhanced per one height meter that has to be overcome.
    @example an uphill penalty of 20 means that per one height meter uphill the distance is increased by 20 meters.
    @default 5
 */
  uphill?: number

  /** Same like uphill but for downhill (might be negative because the distance can be closed quicker when downhill
   * @default 5
   */
  downhill?: number
}

/**
 *
 */
export type EdgeWeightType = 'time' | 'distance'

/**
 * @hidden
 */
export interface GeoSearchDescription {
  title: string
  meta1: string
  meta2: string
  full: string
}

/**
 * A specific statistics Item for making a statistics request on a StatisticsGroup
 */
export interface StatisticsItem {
  id: number
  name: string
  label?: string,
  chart?: boolean,
  type?: 'value' | 'percent' | 'average',
  meta?: StatisticsItemMeta
  groupId?: StatisticsGroupId
  groupMeta?: StatisticsGroupMeta
}

export interface StatisticsGroupEnsemble {
  id: string
  name: string
  region: string
  countries: string[]
  endpoints: { [endpoint: string]: string }
  groups: {
    id: number,
    hierarchy: number,
    minZoomRecommendation: number
  }[]
}

/**
 *
 */
export interface LabelStatisticsItem extends StatisticsItem {
  label: string
}

/**
 *
 */
export interface ExtendedStatisticsItem extends LabelStatisticsItem {
  /**
   * Can this statistic be displayed as a chart
   */
  chart: boolean

  /**
   * What kind of value does this statistic represent
   */
  type: 'value' | 'percent' | 'average'
}

/**
 * A number of travelTime -> value returned by a statistics call
 */
export interface RawStatisticsValues {
  [time: number]: number
}

/**
 *A result object for a specific statistic
 */
export class StatisticValues {
  readonly total: number

  constructor(readonly values: RawStatisticsValues) {
    this.total = 0
    for (const key in this.values) {
      this.total += this.values[key]
    }
  }

  // total: number
  // percent: number
  // average: number
}

export interface MatrixOptimizationOptions {
  pointsPerSolution: number,
  maxSolutions: number,
  statistic: StatisticsItem,
  name?: string
  description?: string
  statisticsGroup: StatisticsGroupId
}

/**
 * A map of name->Statistics object returned from a statistics request
 */
export type StatisticsList = { [statisticKeyId: string]: StatisticValues }

export enum SRID {
  SRID_3857 = 3857,
  SRID_4326 = 4326
}

/**
 * A lat, lng position with the addition of an id
 */
export interface LatLngId {
  id: any
  lat: number
  lng: number
}

/**
 * A LatLngId decorated with a travel time, usually return from an r360 service
 */
export interface LatLngIdTravelTime extends LatLngId {
  travelTime?: number
}

/**
 * Describes metadata about a single statistic in a StatisticsGroup
 */
export interface StatisticsItemMeta {

  statistic_id: number

  /**
   * Minimum cell value for this StatisticsItem
   */
  min: number

  /**
   * Minimum cell value for this StatisticsItem
   */
  max: number

  /**
   * Average cell value for this StatisticsItem
   */
  avg: number

  /**
   * Sum of all cell values for this StatisticsItem
   */
  sum: number

  /**
   * Standard deviation for this StatisticsItem
   */
  std: number

  /**
   * Indicates if the cell values are to be seen as absolute or relative values
   */
  type: 'ABSOLUTE' | 'PERCENT'

  /**
   * Names of the StatisticsItem in different languages
   */
  names: {
    en: string,
    [langCode: string]: string
  }

  /**
   * Description of the StatisticsItem in different languages
   */
  descriptions: { [langCode: string]: string }

  /**
   * Topic of the StatisticsItem in different languages
   */
  topic?: { [langCode: string]: string }


  /**
   * Breakpoints based on different statistical clustering approaches
   */
  breakpoints: {
    equal_interval?: {
      c9: number[],
      c7: number[],
      c5: number[],
      [n: string]: number[]
    },
    kmeans?: {
      c9: number[],
      c7: number[],
      c5: number[],
      [n: string]: number[]
    },
    [method: string]: {
      c9: number[],
      c7: number[],
      c5: number[],
      [n: string]: number[]
    }
  }
}

/**
 * Describes metadata about a specific StatisticsSet (details https://service.route360.net/vector-statistics/statistics/list/v1)
 */
export interface StatisticsGroupMeta {

  id: number

  ensembleId?: number

  /**
   * Minimum map zoom level to display the group on a map
   */
  min_zoom: number,

  /**
   * TODO
   */
  table: string

  /**
   * SRID projection
   */
  srid: SRID

  /**
   * TODO
   */
  type: string

  /**
   * TODO
   */
  source: string

  created: Date,
  license: string,
  modified: Date,
  numberofpoints: number,
  version: string,
  bounding_box: {
    top_right: LatLng,
    bottom_left: LatLng
  },

  /**
 * Description of the StatisticsGroup in different languages
 */
  names: {
    [langCode: string]: string
  },

  /**
 * Description of the StatisticsGroup in different languages
 */
  descriptions: {
    [langCode: string]: string
  },
  ignorevalues: number[],
  stats: StatisticsItemMeta[]
}

/**
 * Padding object
 */
export interface PaddingObject {
  top?: number,
  bottom?: number,
  left?: number,
  right?: number
}

/**
 * Options object for setBounds function
 * @param {PaddingObject} padding The padding to apply to map on bounds fit.
 */
export interface SetBoundsOptions {
  padding?: PaddingObject
}

export interface GeometryId {
  id: any,
  geometry: Geometry
  crs?: number
}

export interface GeometryIdTravelMode extends GeometryId {
  tm?: TravelMode
}

export interface GeometryIdTravelModePayload {
  id: string,
  data: string
  crs: number
  tm?: TravelMode
}

/**
 * Object that will be passed to a request as source
 */
export interface LatLngIdTravelMode extends LatLngId {
  tm?: TravelMode
}

export interface CarModeOptions {
  /** Enable the rush hour mode to simulate a more crowded street.
Warning this is a paid feature so not all plans are allowed to enable it. */
  rushHour?: boolean
}

export interface TransitTravelModeOptions {
  frame?: FramePlaces
  maxTransfers?: number;
}

export interface FramePlaces {
  /** This is the date on which the routing should take place
   * @Format This is formatted like: YYYYMMDD
   * @example for the first of August: 20170801
   * @default 'Current date'
  */
  date?: number

  /** This is the starting time for the routing in seconds from midnight.
   * @example if the routing should start at 5.15pm this equals 17 * 3600s + 15 * 60s = 61200
   * @default 28800 (8am)*/
  time?: number

  /** This is the frame's duration, defined in seconds, in which the routing searches for connections.
   * A value of -1 is equivalent to setting 'earliestArrival' to true and the duration to 'maxEdgeWeight'.
   * If the transit duration is less than the 'maxEdgeWeight' it is set to value of 'maxEdgeWeight
   * @example if we start at 1pm and set the frame 7200s and have a maximum routing time of 3600s,
   * the latest possible arriving time is 9800s, meaning the frame does not get integrated into the routing time.
   * @default 18000 */
  duration?: number

  /** The maximum duration (in seconds) for walking before entering transit.
   * If the value is -1, the duration is unlimited
   * @default -1 */
  maxWalkingTimeFromSource?: number

  /** Not yet implemented, will be ignored. */
  maxWalkingTimeToTarget?: number

  /** If true, the service returns the connection that arrives first at the target instead of the fastest in the time frame
   * @default false
   */
  earliestArrival?: boolean
}

export type TravelMode = {car: CarModeOptions} | {walk: TravelSpeedValues} | {bike: TravelSpeedValues}| {transit: TransitTravelModeOptions}


/**
 * Osm Type (OSM map feature tags. See: http://wiki.openstreetmap.org/wiki/Map_Features)
 */
export interface OSMType {
  key: string
  value: string
}


export interface ReachabilityResult {
  id: string
  source: string
  travelTime: number
}

export interface TimeResult {  /**
  * @General This field defines what travel type is used for Targomo Time Service
  * (or Routing Service if geojsonCreation = ROUTING_SERVICE).
  */
 //  travelType: TravelType
  id: string
  targets: {
    id: string
    travelTime: number
    length: number
  }[]
}

/**
 * @General A store (also called 'depot' sometimes) to which the respective vehicles/transports and orders are associated.
 * Each store will be optimized individually and independently.
 */
export interface FpStore {
  /**
   * @General Unique ID that is required to be set so that Order and Vehicle can reference to their respective store.
   * @Nullable No.
   */
  uuid: string;
  /**
   * @General Name of the store.
   * @Format Cannot be longer than 256 chars.
   */
  name?: string;
  /**
   * @General Location of the store.
   * @Format For store addresses the geocoordinates(lat, lng) must be present in the FpAddress object.
   */
  address: FpAddress;
}

/**
 * @General Stores, Orders, and Transports/Vehicles have addresses associated to determine their location.
 * @Performance Preferably these addresses are already geocoded in the WGS84 format (in lat, lng).
 * Otherwise, the geocoordinates are calculated during the request from the other address details (street, city, etc.).
 * This only happens for order addresses. For store and start or endDestination addresses geocoordinates (lat, lng) must exist already.
 */
export interface FpAddress {
  /**
   * @General A unique id which can be used to map the order entity back to the original after the request.
   */
  uuid?: string;
  /**
   * @General Amount of time it takes to carry out an order for this address in seconds.
   * @default 0
   * @Format Time in seconds.
   * @Nullable This value is only important for addresses in orders.
   */
  avgHandlingTime?: number;
  /**
   * @General Latitude of the geocoordinates of the the address.
   * @Nullable This is required for addresses in store and start or endDestination.
   * @Format WGS84 format.
   * @Default If no value is set the result will include a warning and the default of 1 second is assumed,
   * i.e. after arrival the transport departs one second later.
   */
  lat?: number;
  /**
   * @General Longitude of the geocoordinates of the the address.
   * @Nullable This is required for addresses in store and start or endDestination.
   * @Format WGS84 format.
   */
  lng?: number;
  name?: string;
  street?: string;
  streetDetails?: string;
  postalCode?: string;
  city?: string;
  country?: string;
  phone?: string;
}

/**
 * @General The order object describes the entities that need to be serviced by the transports of the same associated store.
 */
export interface FpOrder {
  /**
   * @General A unique id which can be used to map the order entity back to the original after the request.
   */
  uuid?: string;
  /**
   * @General To associate the order entity to a store.
   * @Format This id must be identical with one of the uuids in the store objects.
   * @Nullable No
   */
  storeUuid: string;
  /**
   * @General The location of the order.
   * When specifying an order setting its address is mandatory.
   * However, for the optimization only the fields lat, lng, and avgHandlingTime are of relevance.
   * @Example
   * ``` js
   * address = {
   *  lat: 13.380707532171671,
   *  lng: 52.532420302239096,
   *  avgHandlingTime: 300
   * }
   * ```
   * @Performance It is sufficient to specify an order’s address without geo-coordinates.
   * The missing information is derived from the address details via geocoding.
   * This can lead to small runtime impairments for many addresses, since the geocoding accesses an external service.
   * The resulting geodata must not be saved.
   */
  address: FpAddress;
  /**
   * @General The deadline (time and date) for an order to be serviced.
   * The optimization algorithm tries to minimize the amount of deadlines that are not kept.
   * Deadline will be ignored if visitingTimes were set.
   * @Format Expressed according to ISO 8601.
   * @Default null
   */
  deadline?: string;

  /**
   * @General The user can specify within what time intervals the order can be serviced via visitingTimes.
   * The actual planned visits have to be within these time intervals - this includes the time at the premise (see address.avgHandlingTime).
   * The start of the first interval as well as the end of the last interval can be null or undefined, which means there are no total lower
   * or upper boundaries only breaks in which the order cannot be serviced.
   * @Example
   * ``` js
   * visitingTimes = [{
   *  end: "2012-04-23T18:00:00.000Z"
   * },{
   *  start: "2012-04-24T08:00:00.000Z"
   * }]
   * ```
   * means that the order cannot be serviced between 23.04.2012, 6pm and 24.04.2012, 8am but at any other time before or after.
   *
   * The user can also define just lower or upper boundaries for orders with only setting one or the other:
   * start or end of a single visiting time interval, e.g.
   * `visitingTimes = [{ end: "2012-04-23T18:00:00.000Z" }]`
   * means that the order must have been serviced/visited before the specified time (including the handling time at the address).
   * @Alternative If only an upper boundary for the visit is important the user can also simply choose to define this via the deadline
   * parameter. The difference here is that the handling time at the address is not included in the specified time,
   * i.e. if the vehicle/transport arrives at the location before the deadline then this time constraint is met.
   * For instance consider the visitingTimes from above: if the avgHandlingTime of this order's address is 300 (=5 minutes) then setting
   * the deadline to "2012-04-23T17:55:00.000Z" would be equivalent with visiting times.
   * Simplified: visitingTimes[0].end = deadline + address.avgHandlingTime.
   * Note, that deadline and visitingTimes cannot both be set for one order. This will result in the deadline value to be ignored
   * (+ warning) in favour of the visitingTimes.
   * @Performance Generally, the optimization tries to fit all orders into the specified visiting hours/deadlines and within the valid
   * working hours of the assigned vehicle. If this is not possible orders will be outside of these time constraints, i.e. after the last
   * visiting end time (or deadline) or after the valid working hours of the vehicle. This will result in penalty points for not meeting
   * the respective time constraints or to filtering out (i.e. not servicing) the orders depending on how the optimization was configured
   * (see OptimizationMetadata).
   * @Format Expressed according to ISO 8601.
   * @Default []
   */
  visitingTimes?: {start: string, end: string}[];
  /**
   * @General The user can define a respective load to specify the use case specific characteristics of the order.
   * @Example
   * ``` js
   * load = {
   *  bottles: 12
   *  weight: 5
   *  crate: 1
   * }
   * ```
   * @Min Greater than or equal to 0
   * It is not allowed to have a single Order whose single load is smaller than the smallest minSingle of all of the load's
   * loadRestrictions of the vehicles
   * @Max Smaller than 2147483648
   * It is not allowed to have a single Order whose single load is larger than the largest maxSingle of all of the load's
   * loadRestrictions of the vehicles (or maxSum if the former is not specified)
   * In addition, the total loads of all Orders of a Store must not exceed the total of all of the load's maxSum of its associated Vehicles.
   * @Default If no value was defined for a load for which a load restriction exists, then that load is assumed to be 0.0.
   * If no restrictions for a load in any of the vehicles of the associated store exist the value is ignored (i.e. removed from the list).
   * @Format The physical units of the load values, e.g. for weight and volume, must match the units of the associated loadRestrictions
   * in the Vehicle.
   */
  load?: {[key: string]: number};

  /**
   * @General The priority specifies the priority of an order. This has effects on:
  * - Validation: If the order number or the total order volume/weight is too high, first orders with a lower rather than a higher
  * priority are removed.
  * - Optimization: It is preferable to try to keep the deadlines of orders with higher priority.
  * Here, the priority of the order represents the number of penalty points it acquires for not meeting the order’s deadline.
  * For example, not meeting a deadline of an order with priority 10 is penalty-equivalent with not meeting the deadline of
  * 10 orders with priority 1. If the optimization is to have priority classes,
  * i.e. orders of a higher priority class are more important than infinitely many orders of a lower priority class,
  * we suggest the usage of a "folding technique": Consider you have 12 orders, 4 of each priority "low", "medium", and "high".
  * The low priority orders are assigned the value 1, the orders with medium priority are assigned the value 5,
  * and the orders with the high priority are assigned the value 25.
  * With this configuration you could always ensure that the meeting of a deadline of one higher priority order is
  * more important than the meeting of deadlines of all lower priority orders.
  * ! Please note that this technique can cause "NumberOverflow" errors for too many classes and orders.
  * @Default 1
   */
  priority?: number;

  /**
   * @General A potential service comment for that order.
   * @Format Length cannot exceed 5000 chars.
   */
  comments?: string;

  /**
   * @General With demands an order can be annotated with a list of things that need to be met by the supplies of the servicing/visiting
   * vehicle, i.e. all demands of an order have to be contained in the list of the supplies of a vehicle for the vehicle to be eligible
   * to service this order.
   * @Example
   * `demands = ["dangerous_goods", "region_germany"]`
   * Means that this order needs to be serviced by a transport that has at least "dangerous_goods" and "region_germany" in its list of
   * supplies.
   * @Default []
   */
  demands?: string[];

  /*
   * @General If a tag is listed in optimizationMetadata.nonParallelOrdersByTags then they restrict the optimization in a way that some
   * orders are not allowed to be serviced in parallel when they have the same values for the specified tags. Using tags for that purpose
   * makes sense if some orders share the same external resource which would have to be present at both locations.
   * @Example
   * ``` js
   * "tags" : {
   *  "facility manager":"Max Mustermann",
   *  "owner": "Muster AG"
   * }
   * ```
   * It means that if another order exists that has the same "facility manager":"Max Mustermann" or "owner": "Muster AG" (or both) then
   * they cannot be serviced in parallel since for both visits the same facility manager and/or owner has to be present.
   */
  tags?: {[key: string]: string};
}

/**
 * @General A transport is the entity which services the orders and for which the optimization finds the best order allocations
 * as well as the best routes.
 */
export interface FpTransport {
  /**
   * @General The vehicle entity describes the fixed parameters of a transport.
   */
  vehicle: FpVehicle;
  /**
   * @General Metadata defining variable specifics for the vehicle/transports.
   */
  metadata?: FpTransportMetadata;
}
/**
 * @General The vehicle entity describes the fixed parameters of a transport.
 * Parameters name, plate, avgFuelConsumption, and fuelType are currently not relevant for the optimization.
 */
export interface FpVehicle {
  /**
   * @General A unique id which can be used to map the order entity back to the original after the request.
   */
  uuid?: string;
  /**
   * @General To associate the vehicle entity to a store.
   * @Format This id must be identical with one of the uuids in the store objects.
   * @Nullable No
   */
  storeUuid: string;

  /**
   * @General For each use case specific load key, for instance "weight", "volume", "item", the user can define restrictions
   * @Example
   * ``` js
   * loadRestrictions = {
   *  weight: { maxSum": 100 },
   *  volume: { maxSum": 2000, "minSingle": 100, "maxSingle": 200 },
   *  item: { minSum": 10, "maxSum": 20 }
   * }
   * ```
   */
  loadRestrictions?: {
    [key: string]: {
      maxSum: number,
      minSum: number,
      minSingle: number,
      maxSingle: number
    }
  }

  /**
   * @General Vehicles should be annotated with a priority to rank their importance with regards to their respective keeping time
   * constraints, i.e. when valid working hours (from earliestDepartureTime until latestArrivalTime) are exceeded the penalty for not
   * finishing the tour on time is multiplied by the factor priority. In this way vehicle with a higher are more likely having tours
   * that are still within their specified working hours. For instance, the optimization would evaluate the meeting of the time constraints
   * of a vehicle with the priority of 50 as high as meeting the time constraints of five vehicles with a priority of 10. That also applies
   * when secondsToPenaltyRatioForOutOfWorkingHours is set.
   * @Default If the priority is not specified the service will assume a priority of 1 and include a warning in the tour planning result.
   */
  priority: number;

  /**
   * @General With supplies a vehicle can be annotated with a list of items or expertise that it provides so it can fulfil the demands of
   * orders, i.e. all demands of an order have to be contained in the list of the supplies of a vehicle for the vehicle to be eligible to
   * service this order.
   * @Example `supplies = ["dangerous_goods", "normal_goods", "region_germany", "region_benelux"]`
   * Means that this vehicle can service any order that demands "normal_goods", "dangerous_goods", "region_germany", or
   * "region_benelux" or any combination of that, e.g. its tour can include an order with dangerous goods in Germany.
   */
  supplies?: string[];

  /**
   * An optional parameter that is used in the route optimization. With this parameter all or some vehicles can be annotated with extra
   * costs (in seconds if travel costs are travel times) that are added during the optimization if a tour for this vehicle was created.
   * This can be used, for instance, to motivate the usage of certain vehicles over other vehicles (the preferred vehicle should have a
   * smaller fixed cost), or to generally penalize the usage of many vehicles (e.g. if all vehicles have a value set of $300$ it means
   * that the optimization tries to fulfil all requirements with as few cars as possible and only would add a tour/vehicle if the travel
   * costs can be reduced by at least $300$ (or more deadlines can be met)).
   * @Min If specified it has to be equal or greater than 0.
   * @Default 0
   */
  fixedTravelCosts?: number;

  name?: string;
  plate?: string;
  avgFuelConsumption?: number;
  fuelType?: string;
}

/**
 * @General Metadata defining variable specifics for the vehicle/transports.
 * @Example The three parameters earliestDepartureTime, latestArrivalTime, and interruptionTimes constitute the transport's valid
 * working hours. In the example below the vehicle has a valid working hour from 8 to 18 with a 2 hour break from 12 to 14:
 * ``` js
 * metadata = {
 *  earliestDepartureTime: "2012-04-23T08:00:00.000Z",
 *  latestArrivalTime: "2012-04-23T18:00:00.000Z",
 *  interruptionTimes: [{
 *   start: "2012-04-23T12:00:00.000Z",
 *   end: "2012-04-23T14:00:00.000Z"
 *  }]
 * }
 * ```
 */
export interface FpTransportMetadata {
  /**
   * @General Specifies from when on the transport would be ready to service the orders,
   * e.g. because right now it is still being refuelled.
   * @Format Expressed according to ISO 8601
   * @Default If no earliestDepartureTime is specified, it is assumed that the vehicle is immediately ready for departure.
   */
  earliestDepartureTime?: string;

  /**
   * @General latestArrivalTime can be set to when the tour for this transport/vehicle has to end at the latest.
   * @Default If no value was set it is assumed that no latest end date for this transport/vehicle exists.
   */
  latestArrivalTime?: string;

  /**
   * @General Breaks within the working hours (from earliestDepartureTime to latestArrivalTime) can be set with interruptionTimes.
   * In the specified interruption times the transport/vehicle cannot service orders or travel between them.
   * If these breaks fall within the tour (-item) the result will contain these in the tourItem.interruptions parameter.
   * @Format Both, start and end dates must be set for all time intervals of interruption times.
   */
  interruptionTimes?: {start: string, end: string}[]

  /**
   * @General The start location of the vehicle.
   * @Default If no start address was specified,
   * the address of the store referenced in the Vehicle is assumed to be the start address of the transport's tour.
   * @Format For start addresses, the geocoordinates(lat, lng) must exist already.
   */
  start?: FpAddress ;
  /**
   * @General The field endDestinations contains the potential end points of the vehicle.
   * @Performance If multiple endDestinations are specified, finding the best endpoint is part of the optimization.
   * @Format The semantics for its configuration is:
   * - List empty: The last delivered order is also the end point of the route.
   * - One list entry: The route must end at this fixed end point.
   * - Multiple list entries: The selection of the best end point is part of the optimization.
   * For end destination addresses the geocoordinates(lat, lng) must exist already.
   */
  endDestinations?: FpAddress[];
}
/**
 * @General Specifies factors with which the travel times of the edges are adjusted.
 * This may be necessary in certain areas where the travel time calculation is
 * almost always off by a certain factor, e.g. Paris rush hour.
 * Transit travel times are not affected by the travelTimeFactors
 * @Example `"travelTimeFactors" : { "all":0.5, "motorway":1.5, .... (other specific edge classes possible) },..`
 * @Min Minimum allowed cumulative travel time factor is `0.5`
 * @Max Maximum allowed cumulative travel time factor is `100.0`
 * @Format
 * Travel time factor of 1.5 means 50% more time is needed
 * (on top of a specified one, e.g. for the example above 1.5*0.5=0.75 - the final applied travel time factor for 'motorway' edges)
 * @Nullable All elements are optional
 */
export interface TravelTimeFactors {
  /**
   * @General Has an effect on all edge classes (excluding transit travel times)
   */
  all?: number, // All elements are optional

  motorway?: number,
  motorway_link?: number,
  trunk?: number,
  trunk_link?: number,
  primary?: number,
  primary_link?: number,
  secondary?: number,
  secondary_link?: number,
  tertiary?: number,
  residential?: number,
  tertiary_link?: number,
  road?: number,
  unclassified?: number,
  service?: number,
  living_street?: number,
  pedestrian?: number,
  track?: number,
  path?: number,
  cycleway?: number,
  footway?: number,
  steps?: number,
  unknown?: number
}

////

export interface Poi extends LatLngId {
  edgeWeight?: number
  osmType: string
  bounded?: boolean
  tags: {
    name?: string
    [key: string]: string
  }
  type: 'node'
  groupIds?: string[]
  closestSource?: string
}

export interface PoiOverview {
  clusterIdCount: {
    [clusterId: string]: number
  }
  groupIdCount: { [key: string]: number }
  osmTypesCount: { [key: string]: number }
  totalPoi: number
}

export interface ClusterPoi {
  mainGroupId: string
  numOfPois: number
  [category: string]: number | string
}

export interface PoiType {
  id: string
  name: string
  description: string
  type: 'CATEGORY' | 'TAG' | 'COMPOSITE_TAG'
  key?: string
  value?: any
  contents?: PoiType[]
}

export type PoiHierarchy = PoiType[]


export interface Location extends LatLngId {
  properties?: {
    /** Parameter used for gravitational criteria to set a custom attraction strength for the given location
     * @default 1
     */
    gravitationAttractionStrength?: number
  }
}


export interface PoiGroup {
  /** key should always be 'group' */
  key: 'group'

  /** represents the id of the group */
  value: string
}

