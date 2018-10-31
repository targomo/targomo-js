import { TravelRequestOptions } from './../requestOptions';
import { StatisticsGroupId,  StatisticsItem} from '../index'
import { LatLngId } from '../types'
import { BaseRequestOptions } from '../requestOptions';

export interface StatisticsTravelRequestOptions extends BaseRequestOptions {
  statisticsGroup: StatisticsGroupId
  inactiveSources?: LatLngId[]
  closestSources?: boolean
  travelType: 'walk' | 'bike' | 'car'
  useCache?: boolean
  iFeelLucky?: boolean

}

export interface StatisticsRequestOptions extends StatisticsTravelRequestOptions {
  statistics: StatisticsItem[]
  omitIndividualStatistics?: boolean
}

export interface StatisticsGeometryRequestOptions {
  requestTimeout?: number;
  statisticsGroup: StatisticsGroupId
  statistics: StatisticsItem[]
  crs?: number
}
