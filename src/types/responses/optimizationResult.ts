/**
 *
 */
export interface OptimizationResultSolution {
  id: number
  startTime: number
  endTime: number

  /**
   * Maximum statistic value (based on the input statistic) encoutenred in this simulation run
   */
  maxValue: number

  /**
   * How many points were wanted per solution, as specifified when the simulation was started
   */
  numberOfDesiredPoints: number

  /**
   * For each point in the original set show whether it is includes in the simulation subset or not
   */
  sources: { [id: string]: boolean }
}

/**
 * Results of an optimization simulation run
 */
export class OptimizationResult {
  id: number
  maxPossibleValue: number

  /**
   * The individual simulation solutions. The maximum number of these is `maxSolutions` supplied when the simulation started,
   * however their number can also be lower if no more results could be generated
   */
  solutions: OptimizationResultSolution[]

  constructor(readonly raw: any) {
    this.id = raw.id
    this.maxPossibleValue = raw.maxPossibleValue

    this.solutions = raw.simulationResults.map((simulationResult: any) => {
      const sources: { [id: string]: boolean } = {}

      simulationResult.sourcePoints.forEach((point: any) => {
        sources[point.id] = point.optimal
      })

      return {
        id: simulationResult.id,
        startTime: simulationResult.startTime,
        endTime: simulationResult.endTime,
        maxValue: simulationResult.maxValue,
        numberOfDesiredPoints: simulationResult.numberOfDesiredPoints,
        sources,
      }
    })
  }
}
