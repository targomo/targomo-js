import { StatisticsGroupId,  StatisticsItem} from '../index'
import { LatLngId, TravelType } from '../types'
import { TravelRequestOptions } from '../requestOptions';

export interface StatisticsTravelRequestOptions extends TravelRequestOptions {
  statisticsGroup: StatisticsGroupId
  inactiveSources?: LatLngId[]
  closestSources?: boolean
  travelType: TravelType
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
