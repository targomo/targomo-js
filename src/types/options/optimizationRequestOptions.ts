import { StatisticsGroupId,  StatisticsItem, TravelRequestOptions} from '../index'

export interface OptimizationRequestOptions extends TravelRequestOptions {
  pointsPerSolution: number
  statistic: StatisticsItem | number
  statisticGroup: StatisticsGroupId
  maxSolutions?: number
  name?: string
  description?: string
  email?: string
  callbackUrl?: string
  useCache?: boolean
}
