import {StatisticsItem, StatisticsList, StatisticValues} from '../types'

export class StatisticsResult {
  readonly statistics: StatisticsList
  readonly individualStatistics: {[id: string]: StatisticsList}
  readonly raw: any

  constructor(result: any, statistics: StatisticsItem[]) {
    function dataToStatisticgroup(values: any) {
      const statisticsGroup: StatisticsList = {}

      // Convert to map of named statistics, instead of index based ones
      for (const statistic of statistics) {
        statisticsGroup[statistic.name] = new StatisticValues(values[statistic.id])
      }

      return statisticsGroup
    }

    const individualStatistics: {[id: string]: StatisticsList} = {}
    if (result.individualStatistics) {
      for (const key in result.individualStatistics) {
        if (result.individualStatistics[key] && result.individualStatistics[key].statistics) {
          individualStatistics[key] = dataToStatisticgroup(result.individualStatistics[key].statistics)
        }
      }
    }

    this.statistics = dataToStatisticgroup(result.statistics),
    this.individualStatistics = individualStatistics,
    this.raw = result
  }
}
