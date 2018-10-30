import { StatisticsGroupId,  StatisticsItem} from '../index'
import { LatLngId } from '../types'
import { BaseRequestOptions } from '../requestOptions';

export interface StatisticsTravelRequestOptions extends BaseRequestOptions {
  // statistics: (StatisticsKey | number)[]
  statisticsGroup: StatisticsGroupId
  inactiveSources?: LatLngId[]
  closestSources?: boolean
  intersectionMode?: string

  travelType: 'walk' | 'bike' | 'car'
}

export interface StatisticsRequestOptions extends StatisticsTravelRequestOptions {
  // statistics: (StatisticsKey | number)[]

  statistics: StatisticsItem[]
  omitIndividualStatistics?: boolean
}

export interface StatisticsGeometryRequestOptions {
  statisticsGroup: StatisticsGroupId
  statistics: StatisticsItem[]
  useCache?: boolean
  requestTimeout?: number
  crs?: number
}
