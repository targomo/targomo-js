import { StatisticsItem } from '../types';

export interface StatisticsGeometryResultItem {
  value: number
}

export interface StatisticsGeometryResultStatistic {
  [index: string]: StatisticsGeometryResultItem
}

export class StatisticsGeometryResult {
  readonly raw: any
  readonly values: {
    min?: StatisticsGeometryResultStatistic
    max?: StatisticsGeometryResultStatistic
    avg?: StatisticsGeometryResultStatistic
    sum?: StatisticsGeometryResultStatistic
    count?: StatisticsGeometryResultStatistic
    stddev?: StatisticsGeometryResultStatistic
    variance?: StatisticsGeometryResultStatistic
  } = {}

  constructor(result: any[], statistics: StatisticsItem[]) {
    const statsticsMap: {[index: number]: string} = {}
    statistics.forEach(statistic => {
      statsticsMap[statistic.id] = statistic.name
    })

    this.raw = result
    const values: any = this.values

    for (const key in result) {
      const row: any = result[key]
      const aggregationKey = (row.aggregation || '').toLowerCase()
      values[aggregationKey] = values[aggregationKey] || {}

      const statistic = statsticsMap[row.statisticId]
      values[aggregationKey][statistic] = {value: row.value}
    }
  }
}
