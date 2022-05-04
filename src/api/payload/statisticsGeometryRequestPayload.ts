import { StatisticsGeometryRequestOptions } from '../../types/options/statisticsRequestOptions'
import { TargomoClient } from '../targomoClient'

export class StatisticsGeometryRequestPayload {
  statisticIds: number[]
  statisticGroupId: number
  intersectionGeometry: { data: string; crs: number }

  constructor(client: TargomoClient, geometry: string, options: StatisticsGeometryRequestOptions) {
    const statisticsIndices: number[] = options.statistics.map((statistic) => {
      if (statistic instanceof Number || typeof statistic === 'number') {
        return +statistic
      } else {
        return statistic.id
      }
    })

    this.statisticGroupId = +options.statisticsGroup
    this.statisticIds = statisticsIndices

    this.intersectionGeometry = {
      data: geometry,
      crs: options.crs || 4326,
    }
  }
}
