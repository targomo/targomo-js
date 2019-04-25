import { StatisticsSet,  StatisticsKey, TravelRequestOptions} from '../index'
import { LatLngId } from '../types'

export interface StatisticsTravelRequestOptions extends TravelRequestOptions {
  // statistics: (StatisticsKey | number)[]
  statisticsGroup: StatisticsSet
  inactiveSources?: LatLngId[]
  closestSources?: boolean
  intersectionMode?: string

  trafficJunctionPenalty?: number
  trafficSignalPenalty?: number
}

export interface StatisticsRequestOptions extends StatisticsTravelRequestOptions {
  // statistics: (StatisticsKey | number)[]
  statistics: StatisticsKey[]
  omitIndividualStatistics?: boolean
}

export interface StatisticsGeometryRequestOptions {
  statisticsGroup: StatisticsSet
  statistics: StatisticsKey[]
  useCache?: boolean
  requestTimeout?: number
  crs?: number
}
