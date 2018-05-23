import { StatisticsSet,  StatisticsKey, TravelRequestOptions} from '../index'

export interface OptimizationRequestOptions extends TravelRequestOptions {
  pointsPerSolution: number
  statistic: StatisticsKey | number
  statisticGroup: StatisticsSet
  maxSolutions?: number
  name?: string
  description?: string
  email?: string
  callbackUrl?: string
  useCache?: boolean
}
