import { StatisticsGroupId,  StatisticsItem, TravelRequestOptions} from '../index'
import { LatLngId } from '../types'

export interface StatisticsTravelRequestOptions extends TravelRequestOptions {
  // statistics: (StatisticsKey | number)[]
  statisticsGroup: StatisticsGroupId
  inactiveSources?: LatLngId[]
  closestSources?: boolean
  intersectionMode?: string
}

export interface StatisticsRequestOptions extends StatisticsTravelRequestOptions {
  // statistics: (StatisticsKey | number)[]
  statistics: StatisticsItem[]
}
