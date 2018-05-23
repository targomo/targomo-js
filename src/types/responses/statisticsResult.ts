import {StatisticsKey, StatisticsGroup, Statistics} from '../types'

export class StatisticsResult {
  readonly statistics: StatisticsGroup
  readonly individualStatistics: {[id: string]: StatisticsGroup}
  readonly raw: any

  constructor(result: any, statistics: StatisticsKey[]) {
    function dataToStatisticgroup(values: any) {
      const statisticsGroup: StatisticsGroup = {}

      // Convert to map of named statistics, instead of index based ones
      for (let statistic of statistics) {
        statisticsGroup[statistic.name] = new Statistics(values[statistic.id])
      }

      return statisticsGroup
    }

    const individualStatistics: {[id: string]: StatisticsGroup} = {}
    if (result.individualStatistics) {
      for (let key in result.individualStatistics) {
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
