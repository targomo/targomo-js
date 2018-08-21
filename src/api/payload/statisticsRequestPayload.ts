import { LatLngId } from '../../types';
import { StatisticsRequestOptions, StatisticsTravelRequestOptions } from '../../types/options/statisticsRequestOptions'
import { TargomoClient } from '../targomoClient';

// TODO: move
export interface PointId {
  id: string,
  x: number
  y: number
}

function isStatisticsRequestOptions(value: StatisticsRequestOptions | StatisticsTravelRequestOptions): value is StatisticsRequestOptions {
  return (<any>value).statistics
}

export class StatisticsRequestPayload {
  statisticIds: number[]
  statisticGroupId: number
  inactiveSources: PointId[] = []
  sources: PointId[] = []
  getClosestSources: boolean = false

  maxEdgeWeight: number
  serviceKey: string
  serviceUrl: string
  intersectionMode: string = 'union'

  // const KEYS = [
  //   'serviceKey', 'serviceUrl', 'useCache', 'date', 'time',
  //   'travelType', 'edgeWeight', 'maxEdgeWeight', 'appendTravelTimes', 'inactiveSources',
  //   // 'bikeDownhill', 'bikeSpeed', 'bikeUphill', 'walkDownhill', 'walkSpeed', 'walkUphill'
  // ]

  appendTravelTimes = false

  // TODO: superclass
  date: any
  time: any
  edgeWeight: string
  useCache: boolean
  travelType: string

  walkDownhill?: number
  walkSpeed?: number
  walkUphill?: number

  bikeDownhill?: number
  bikeSpeed?: number
  bikeUphill?: number

  constructor(client: TargomoClient, sources: LatLngId[], options: StatisticsRequestOptions | StatisticsTravelRequestOptions) {
    // super(options)

    // FIXME: ... should be done in superclass
    this.date = options.transitFrameDate || 20170801
    this.time = options.transitFrameTime || 39600

    if (options.transitFrameDateTime != null) {
      const date = new Date(<any>options.transitFrameDateTime)
      const transitFrameDate = date ? ((date.getFullYear() * 10000) + (date.getMonth() + 1) * 100 + date.getDate()) : undefined
      const transitFrameTime = date ? ((date.getHours() * 3600) + (date.getMinutes() * 60)) : undefined

      this.date = this.date = transitFrameDate || this.date
      this.time = this.time = transitFrameTime || this.time
    }

    this.edgeWeight = options.edgeWeight == undefined ? 'time' : options.edgeWeight
    this.useCache = options.useCache == undefined ? true : options.useCache
    this.travelType = options.travelType
    /// FIXME: end

    this.intersectionMode = options.intersectionMode || 'union'

    this.sources = sources.map(source => ({id: source.id, y: source.lat, x: source.lng}))

    if (options.inactiveSources) {
      this.inactiveSources = options.inactiveSources.map(source => ({id: source.id, y: source.lat, x: source.lng}))
    }

    let statisticsIndices: number[] = []

    if (isStatisticsRequestOptions(options)) {
      statisticsIndices = options.statistics.map(statistic => {
        if (statistic instanceof Number || typeof statistic === 'number') {
          return +statistic
        } else {
          return statistic.id
        }
      })
    }

    this.statisticGroupId = +options.statisticsGroup
    this.statisticIds = statisticsIndices

    this.maxEdgeWeight = options.maxEdgeWeight

    this.serviceKey = client.serviceKey
    this.serviceUrl = client.serviceUrl

    if (options.closestSources) {
      this.getClosestSources = true
    }

    if (options.walkSpeed) {
      this.walkDownhill = options.walkSpeed.downhill
      this.walkSpeed = options.walkSpeed.speed
      this.walkUphill = options.walkSpeed.uphill
    }

    if (options.bikeSpeed) {
      this.bikeDownhill = options.bikeSpeed.downhill
      this.bikeSpeed = options.bikeSpeed.speed
      this.bikeUphill = options.bikeSpeed.uphill
    }
  }
}
