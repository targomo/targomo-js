import { StatisticsGroupId, StatisticsItem } from '../index'
import { TravelRequestOptions } from '../requestOptions'
import { GeometryId, LatLngId, TravelType } from '../types'

export interface StatisticsTravelRequestOptions extends TravelRequestOptions {
  statisticsGroup?: StatisticsGroupId
  statisticCollectionId?: number
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
  requestTimeout?: number
  statisticCollectionId?: number
  statisticsGroup?: StatisticsGroupId
  statistics: StatisticsItem[]
  crs?: number
}
