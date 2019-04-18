import { LatLngId, TravelType } from '../../types';
import { StatisticsRequestOptions, StatisticsTravelRequestOptions } from '../../types/options/statisticsRequestOptions'
import { TargomoClient } from '../targomoClient';

function isStatisticsRequestOptions(value: StatisticsRequestOptions | StatisticsTravelRequestOptions): value is StatisticsRequestOptions {
  return (<any>value).statistics
}

export class StatisticsRequestPayload {
  statisticIds: number[]
  statisticGroupId: number
  inactiveSources: { id: string, x: number, y: number }[] = []
  getClosestSources: boolean = false
  serviceKey: string
  serviceUrl: string
  useCache: boolean
  iFeelLucky: boolean
  omitIndividualStatistics: boolean
  sources: { id: string, x: number, y: number }[]
  travelType: TravelType
  edgeWeight: 'time' | 'distance'
  maxEdgeWeight: number
  frame: number
  time: number
  date: number
  maxTransfers: number
  maxWalkingTimeFromSource: number
  avoidTransitRouteTypes: number[]
  rushHour: boolean

  constructor(client: TargomoClient, sources: LatLngId[], options: StatisticsRequestOptions | StatisticsTravelRequestOptions) {

    this.serviceUrl = client.serviceUrl;
    this.serviceKey = client.serviceKey;
    this.useCache = options.useCache == undefined ? true : options.useCache
    this.sources = sources.map(source => ({id: source.id, y: source.lat, x: source.lng}))
    this.iFeelLucky = options.iFeelLucky;
    this.travelType = options.travelType;
    this.edgeWeight = options.edgeWeight;
    this.maxEdgeWeight = options.maxEdgeWeight;
    this.frame = options.transitFrameDuration;
    this.time = options.transitFrameTime;
    this.date = options.transitFrameDate;
    this.maxTransfers = options.transitMaxTransfers;
    this.maxWalkingTimeFromSource = options.transitMaxWalkingTimeFromSource;
    this.avoidTransitRouteTypes = options.transitAvoidTransitRouteTypes;
    this.rushHour = options.rushHour;

    if (options.inactiveSources) {
      this.inactiveSources = options.inactiveSources.map(source => ({id: source.id, y: source.lat, x: source.lng}))
    }

    let statisticsIndices: number[] = []

    if (isStatisticsRequestOptions(options)) {
      this.omitIndividualStatistics = options.omitIndividualStatistics
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

    if (options.closestSources) {
      this.getClosestSources = true
    }

  }
}
