import { OptimizationRequestOptions } from '../../types/options/optimizationRequestOptions'
import { LatLngId, TravelType } from '../../types/types';
import { TravelTypeEdgeWeightOptions } from '../../types/travelOptions';

export class OptimizationRequestPayload implements TravelTypeEdgeWeightOptions {
  description: string
  statisticGroupId: number
  serviceUrl: string
  serviceKey: string
  email: string
  sendMail: boolean
  callbackUrl: string
  useCache: boolean
  pointsPerSolution: number
  maxSolutions: number
  statisticId: number
  sources: {
    [id: string]: {
      id: string
      x: number
      y: number
    }
  } = {}

  travelType: TravelType
  maxEdgeWeight: number
  edgeWeight: 'time' | 'distance'


  transitFrameDuration: number = undefined
  transitFrameDate: number = 20170801
  transitFrameTime: number = 39600
  time: number = this.transitFrameDate
  date: number = this.transitFrameTime

  constructor(serviceUrl: string, serviceKey: string, sources: LatLngId[], options: OptimizationRequestOptions) {
    this.travelType = options.travelType
    this.maxEdgeWeight = options.maxEdgeWeight
    this.edgeWeight = options.edgeWeight

    this.date = this.transitFrameDate = options.transitFrameDate
    this.time = this.transitFrameTime = options.transitFrameTime
    this.transitFrameDuration = options.transitFrameDuration

    if (options.transitFrameDateTime != null) {
      const date = new Date(<any>options.transitFrameDateTime)
      const transitFrameDate = date ? ((date.getFullYear() * 10000) + (date.getMonth() + 1) * 100 + date.getDate()) : undefined
      const transitFrameTime = date ? ((date.getHours() * 3600) + (date.getMinutes() * 60)) : undefined

      this.date = (this.transitFrameDate = transitFrameDate || this.transitFrameDate)
      this.time = (this.transitFrameTime = transitFrameTime || this.transitFrameTime)
    }

    this.description = options.description || ''
    this.maxEdgeWeight = options.maxEdgeWeight
    this.serviceUrl = serviceUrl
    this.serviceKey = serviceKey
    this.email = options.email || 'developers@targomo.com'
    this.sendMail = false
    this.callbackUrl = options.callbackUrl || 'https://localhost/' // TODO: was this donig anything?
    this.useCache = options.useCache
    this.pointsPerSolution = options.pointsPerSolution
    this.maxSolutions = options.maxSolutions || 1

    this.statisticGroupId = options.statisticGroup

    if (options.statistic instanceof Number || typeof options.statistic === 'number') {
      this.statisticId = +options.statistic
    } else {
      this.statisticId = options.statistic.id
    }

    sources.forEach(source => {
      this.sources[source.id] = {
        id: source.id,
        x: source.lng,
        y: source.lat
      }
    })
  }
}


