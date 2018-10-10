import { StatisticsGroupId,  StatisticsItem, TravelRequestOptions} from '../index'

/**
 * Parameters for an optimization simulation run. Optimization simulations take a set of locations
 * and return an optimal subset of these based on these parameters
 */
export interface OptimizationRequestOptions extends TravelRequestOptions {
  /**
   * How many locations should be included in the optimal subset
   */
  pointsPerSolution: number

  /**
   * Based on which statistic should the simulation be calculated
   */
  statistic: StatisticsItem | number
  /**
   * Based on which statistic group should the simulation be calculated
   */
  statisticGroup: StatisticsGroupId
  /**
   * How many result variation should be returned. Default is 1
   */
  maxSolutions?: number

  // below: ignore for now
  name?: string
  description?: string
  email?: string
  callbackUrl?: string
  useCache?: boolean
}
