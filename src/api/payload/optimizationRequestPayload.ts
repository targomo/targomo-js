import { OptimizationRequestOptions } from '../../types/options/optimizationRequestOptions'
import {TravelRequestPayload} from './travelRequestPayload'

export class OptimizationRequestPayload extends TravelRequestPayload implements OptimizationRequestOptions {
  pointsPerSolution: number
  statistic: number
  statisticGroup: number
  maxSolutions: number = 1
  name: string = ''
  description: string = ''
  email: string = ''
  callbackUrl: string = null
  useCache: boolean = true

  constructor(options: OptimizationRequestOptions) {
    super(options)
/*
    name = optimizationOptions.name
    description = 'Description'
    statisticGroupId = optimizationOptions.statisticsGroup
    // travelType = travelOptions.travelType
    // time = travelOptions.time
    // date = travelOptions.date
    // maxEdgeWeight = travelOptions.travelTimeDistance
    // edgeWeight = 'time'
    serviceUrl = /
    serviceKey = route360.key,//travelOptions.serviceKey,// + 'N'
    email = "tomis@motionintelligence.net"
    sendMail = false
    callbackUrl = "https://thisisacallback.net/"
    useCache = true
    pointsPerSolution = optimizationOptions.pointsPerSolution
    maxSolutions = optimizationOptions.maxSolutions
    statisticId = optimizationOptions.statistic.id
    sources = sources
    forcedPointIds = forceIds*/
  }


    // toCfgObject(sources: LatLngId[]) {
      // const cfg: any = this

      // cfg.name = optimizationOptions.name,
      // cfg.description = "Description",
      // cfg.statisticGroupId = optimizationOptions.statisticsGroup,
      // cfg.travelType = travelOptions.travelType,
      // cfg.time = travelOptions.time,
      // cfg.date = travelOptions.date,
      // cfg.maxEdgeWeight = travelOptions.travelTimeDistance,
      // cfg.edgeWeight = "time",
      // cfg.serviceUrl = //
      // cfg./ = : "https://api.targomo.com/germany/", // http://localhost:8081/",
      // cfg.serviceKey = route360.key,//travelOptions.serviceKey,// + 'N',
      // cfg.email = "tomis@motionintelligence.net",
      // cfg.sendMail =
      // cfg.callbackUrl = "https://thisisacallback.net/",
      // cfg.useCache = true,
      // cfg.pointsPerSolution = optimizationOptions.pointsPerSolution,
      // cfg.maxSolutions = optimizationOptions.maxSolutions,
      // cfg.statisticId = optimizationOptions.statistic.id,
      // cfg.sources = sources,
      // cfg.forcedPointIds = forceIds
    // }
  // }
}


