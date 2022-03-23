import { StatisticsGroupId, StatisticsItem } from '../index';
import { GeometryId, LatLngId, TravelType,TravelRequestOptions } from '..';

export interface StatisticsTravelRequestOptions extends TravelRequestOptions {
  statisticsGroup: StatisticsGroupId
  inactiveSources?: LatLngId[]
  closestSources?: boolean
  travelType: TravelType
  useCache?: boolean
  iFeelLucky?: boolean
}

export interface StatisticsTravelRequestOptionsSources extends StatisticsTravelRequestOptions {
  sources?: LatLngId[]
  sourceGeometries?: GeometryId[]
}

export interface StatisticsRequestOptions extends StatisticsTravelRequestOptions {
  statistics: StatisticsItem[]
  omitIndividualStatistics?: boolean
}

export interface StatisticsRequestOptionsSources extends StatisticsRequestOptions {
  sources?: LatLngId[]
  sourceGeometries?: GeometryId[]
}

export interface StatisticsGeometryRequestOptions {
  requestTimeout?: number;
  statisticsGroup: StatisticsGroupId
  statistics: StatisticsItem[]
  crs?: number
}
