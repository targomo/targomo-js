import {LatLngId} from '../types'

export interface OptimizationResultSolution {
  id: number
  startTime: number
  endTime: number
  maxValue: number
  numberOfDesiredPoints: number
  sources: {[id: string]: boolean}
}

export class OptimizationResult {
  id: number
  maxPossibleValue: number
  solutions: OptimizationResultSolution[]

  constructor(readonly raw: any) {
    this.id = raw.id
    this.maxPossibleValue = raw.maxPossibleValue

    this.solutions = raw.simulationResults.map((simulationResult: any) => {
      const sources: {[id: string]: boolean} = {}

      simulationResult.sourcePoints.forEach((point: any) => {
        sources[point.id] = point.optimal
      })

      return {
        id: simulationResult.id,
        startTime: simulationResult.startTime,
        endTime: simulationResult.endTime,
        maxValue: simulationResult.maxValue,
        numberOfDesiredPoints: simulationResult.numberOfDesiredPoints,
        sources
      }
    })
  }
}
