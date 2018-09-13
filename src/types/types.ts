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
  speed?: number
  uphill?: number
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
 *
 */
export interface BenchmarkCriteria {
  source: string,
  minEnd: number,
  minStart: number
  factor: number
}

/**
 *
 */
export interface SimilarityCriteria {
  source: string,
  minutes: number,
  factor: number
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

/**
 * Object that will be passed to a request as source
 */
export interface LatLngIdTravelMode extends LatLngId {
  tm?: any
}

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

export interface TimeResult {
  id: string
  targets: {
    id: string
    travelTime: number
  }[]
}
