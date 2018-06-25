import { StatisticsGeometryRequestOptions } from '../../types/options/statisticsRequestOptions'
import { TargomoClient } from '../targomoClient';

export class StatisticsGeometryRequestPayload {
  statisticIds: number[]
  statisticGroupId: number

  serviceKey: string
  serviceUrl: string
  useCache: boolean

  intersectionGeometry: any

  constructor(client: TargomoClient, geometry: any[], options: StatisticsGeometryRequestOptions) {
    this.useCache = options.useCache == undefined ? true : options.useCache

    let statisticsIndices: number[] = options.statistics.map(statistic => {
      if (statistic instanceof Number || typeof statistic === 'number') {
        return +statistic
      } else {
        return statistic.id
      }
    })

    this.statisticGroupId = +options.statisticsGroup
    this.statisticIds = statisticsIndices

    this.serviceKey = client.serviceKey
    this.serviceUrl = client.serviceUrl

    this.intersectionGeometry = {
      data: geometry
    }
  }
}
