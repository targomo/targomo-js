import { StatisticsGeometryRequestOptions } from '../../types/options/statisticsRequestOptions'
import { TargomoClient } from '../targomoClient'

export class StatisticsGeometryRequestPayload {
  statisticIds: number[]
  statisticGroupId?: number
  statisticCollectionId?: number
  intersectionGeometry: { data: string; crs: number }

  constructor(client: TargomoClient, geometry: string, options: StatisticsGeometryRequestOptions) {
    const statisticsIndices: number[] = options.statistics.map((statistic) => {
      if (statistic instanceof Number || typeof statistic === 'number') {
        return +statistic
      } else {
        return statistic.id
      }
    })

    if (options.statisticsGroup != null) {
      this.statisticGroupId = +options.statisticsGroup
    }
    if (options.statisticCollectionId != null) {
      this.statisticCollectionId = +options.statisticCollectionId
    }

    this.statisticIds = statisticsIndices

    this.intersectionGeometry = {
      data: geometry,
      crs: options.crs || 4326,
    }
  }
}
