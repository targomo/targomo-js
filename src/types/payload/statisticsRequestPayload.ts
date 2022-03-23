import { GeometryIdTravelModePayload, LatLngId, TravelType } from '..';
import {
  StatisticsRequestOptions,
  StatisticsRequestOptionsSources, StatisticsTravelRequestOptions,
  StatisticsTravelRequestOptionsSources
} from '../options/statisticsRequestOptions';
import { TargomoClient } from '../../api/targomoClient';

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
  sourceGeometries: GeometryIdTravelModePayload[]
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

  walkDownhill: number
  walkSpeed: number
  walkUphill: number

  bikeDownhill: number
  bikeSpeed: number
  bikeUphill: number

  constructor(
    client: TargomoClient,
    sources: LatLngId[],
    options: StatisticsRequestOptionsSources | StatisticsTravelRequestOptionsSources
  ) {

    this.serviceUrl = client.serviceUrl;
    this.serviceKey = client.serviceKey;
    this.useCache = options.useCache == undefined ? true : options.useCache

    if (sources) {
      this.sources = sources.map(source => ({id: source.id, y: source.lat, x: source.lng}))
    } else {
      if (options.sources) {
        this.sources = options.sources.map(source => ({id: source.id, y: source.lat, x: source.lng}))
      }

      if (options.sourceGeometries) {
        this.sourceGeometries = options.sourceGeometries.map(source => {
          return {
            data: JSON.stringify(source.geometry),
            crs: source.crs || 4326,
            id: source.id,
          }
        })
      }
    }

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

    if (options.walkSpeed) {
      this.walkDownhill = options.walkSpeed.downhill != null ? +options.walkSpeed.downhill : undefined
      this.walkSpeed = options.walkSpeed.speed != null ? +options.walkSpeed.speed : undefined
      this.walkUphill = options.walkSpeed.uphill != null ? +options.walkSpeed.uphill : undefined
    }

    if (options.bikeSpeed) {
      this.bikeDownhill = options.bikeSpeed.downhill != null ? +options.bikeSpeed.downhill : undefined
      this.bikeSpeed = options.bikeSpeed.speed != null ? +options.bikeSpeed.speed : undefined
      this.bikeUphill = options.bikeSpeed.uphill != null ? +options.bikeSpeed.uphill : undefined
    }
  }
}
