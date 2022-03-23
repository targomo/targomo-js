import { OptimizationRequestOptions } from '../options/optimizationRequestOptions'
import { LatLngId, TravelType } from '../types';

export class OptimizationRequestPayload {
  description: string
  statisticGroupId: number
  serviceUrl: string
  serviceKey: string
  email: string
  sendMail: boolean
  callbackUrl: string
  pointsPerSolution: number
  maxSolutions: number
  statisticId: number
  travelType: TravelType
  edgeWeight?: 'time' | 'distance'
  maxEdgeWeight: number
  sources: {[id: string]: { id: string, x: number, y: number }}[]

  constructor(serviceUrl: string, serviceKey: string, sources: LatLngId[], options: OptimizationRequestOptions) {
    this.description = options.description || ''
    this.serviceUrl = serviceUrl
    this.serviceKey = serviceKey
    this.email = options.email || 'developers@targomo.com'
    this.sendMail = false
    this.callbackUrl = options.callbackUrl || 'https://localhost/' // TODO: was this donig anything?
    this.pointsPerSolution = options.pointsPerSolution
    this.maxSolutions = options.maxSolutions || 1
    this.travelType = options.travelType
    this.edgeWeight = options.edgeWeight
    this.maxEdgeWeight = options.maxEdgeWeight
    this.statisticGroupId = options.statisticGroup

    if (options.statistic instanceof Number || typeof options.statistic === 'number') {
      this.statisticId = +options.statistic
    } else {
      this.statisticId = options.statistic.id
    }
    const sourcesObject: {
      [id: string]: {
        id: string
        x: number
        y: number
      }
    } = {};
    sources.forEach(source => {
      sourcesObject[source.id] = {
        id: source.id,
        x: source.lng,
        y: source.lat
      }
    });
    this.sources.push(sourcesObject);
  }
}


