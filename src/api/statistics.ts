import { TargomoClient } from './targomoClient'
import {
  LatLngId,
  StatisticsList,
  ReachableTile,
  StatisticsGroupMeta,
  StatisticsGroupId,
  StatisticsItem,
  StatisticsItemMeta,
  StatisticsRequestOptions,
  StatisticsTravelRequestOptions,
  StatisticsGeometryRequestOptions,
  StatisticsGroupEnsemble,
  UrlUtil,
} from '../index'
import { StatisticsRequestPayload } from './payload/statisticsRequestPayload'
import { StatisticsResult } from '../types/responses/index'
import { requests } from '../util/requestUtil'
import { SimpleLRU } from '../util/cache'
import { StatisticsGeometryRequestPayload } from './payload/statisticsGeometryRequestPayload'
import { StatisticsGeometryResult } from '../types/responses/statisticsGeometryResult'
import { StatisticsRequestOptionsSources, StatisticsTravelRequestOptionsSources } from '../types'

/**
 * @Topic Statistics
 */
export class StatisticsClient {
  private statisticsMetadataCache = new SimpleLRU<StatisticsGroupMeta>(200)
  private statisticsEnsemblesCache = new SimpleLRU<{ [id: string]: StatisticsGroupEnsemble }>(200)

  constructor(private client: TargomoClient) {}

  /**
   *
   * @param sources
   * @param options
   */
  // async combined(sources: LatLngId[], // sources: LatLng[],
  //   options: StatisticsRequestOptions): Promise<StatisticsList> {
  async combined(sources: LatLngId[], options: StatisticsRequestOptions): Promise<StatisticsList>
  async combined(options: StatisticsRequestOptionsSources): Promise<StatisticsList>
  async combined(
    sourcesOrOptions: LatLngId[] | StatisticsRequestOptionsSources,
    options?: StatisticsRequestOptionsSources
  ): Promise<StatisticsList> {
    const result = await this.dependent(<any>sourcesOrOptions, options)
    return result && result.statistics
  }

  /**
   * Make a statistics request to the targomo services
   */
  async individual(sources: LatLngId[], options: StatisticsRequestOptions): Promise<{ [id: string]: StatisticsList }>
  async individual(options: StatisticsRequestOptionsSources): Promise<{ [id: string]: StatisticsList }>
  async individual(
    sourcesOrOptions: LatLngId[] | StatisticsRequestOptionsSources,
    options?: StatisticsRequestOptionsSources
  ): Promise<{ [id: string]: StatisticsList }> {
    const result = await this.dependent(<any>sourcesOrOptions, options)
    return result && result.individualStatistics
  }

  /**
   * Make a statistics request to the targomo services
   */
  async travelTimes(sources: LatLngId[], options: StatisticsTravelRequestOptions): Promise<ReachableTile>
  async travelTimes(options: StatisticsTravelRequestOptionsSources): Promise<ReachableTile>
  async travelTimes(
    sourcesOrOptions: LatLngId[] | StatisticsTravelRequestOptionsSources,
    options?: StatisticsTravelRequestOptionsSources
  ): Promise<ReachableTile> {
    const sources = options !== undefined ? <LatLngId[]>sourcesOrOptions : null
    options = options || <StatisticsRequestOptionsSources>sourcesOrOptions

    const url = new UrlUtil.TargomoUrl(this.client)
      .host(this.client.config.statisticsUrl)
      .part('traveltimes')
      .key('apiKey')
      .params({
        serviceUrl: this.client.serviceUrl,
      })
      .toString()

    const payload = new StatisticsRequestPayload(this.client, sources, options)
    if (
      (!payload.sources || payload.sources.length == 0) &&
      (!payload.sourceGeometries || payload.sourceGeometries.length == 0)
    ) {
      return null
    }

    return await requests(this.client, options).fetch(url, 'POST', payload)
  }

  /**
   *
   * @param sources
   * @param options
   */
  async dependent(sources: LatLngId[], options: StatisticsRequestOptions): Promise<StatisticsResult>
  async dependent(options: StatisticsRequestOptionsSources): Promise<StatisticsResult>
  async dependent(
    sourcesOrOptions: LatLngId[] | StatisticsRequestOptionsSources,
    options?: StatisticsRequestOptionsSources
  ): Promise<StatisticsResult> {
    const sources = options !== undefined ? <LatLngId[]>sourcesOrOptions : null
    options = options || <StatisticsRequestOptionsSources>sourcesOrOptions

    const url = new UrlUtil.TargomoUrl(this.client)
      .host(this.client.config.statisticsUrl)
      .part('charts/dependent')
      .key('apiKey')
      .params({
        serviceUrl: this.client.serviceUrl,
      })
      .toString()

    const payload = new StatisticsRequestPayload(this.client, sources, options)
    if (
      (!payload.sources || payload.sources.length == 0) &&
      (!payload.sourceGeometries || payload.sourceGeometries.length == 0)
    ) {
      return null
    }

    const result = await requests(this.client, options).fetch(url, 'POST', payload)
    return new StatisticsResult(result, options.statistics)
  }

  /**
   *
   * @param sources
   * @param options
   */
  async geometry(geometry: string, options: StatisticsGeometryRequestOptions): Promise<StatisticsGeometryResult> {
    if (!geometry) {
      return null
    }

    const url = new UrlUtil.TargomoUrl(this.client)
      .host(this.client.config.statisticsUrl)
      .part('values/geometry')
      .key('apiKey')
      .params({
        serviceUrl: this.client.serviceUrl,
      })
      .toString()

    const result = await requests(this.client, options).fetch(
      url,
      'POST',
      new StatisticsGeometryRequestPayload(this.client, geometry, options)
    )
    return new StatisticsGeometryResult(result, options.statistics)
  }

  /**
   *
   * @param group
   */
  async metadata(group: StatisticsGroupMeta | StatisticsGroupId) {
    const server = this.client.config.statisticsUrl
    const key = typeof group == 'number' ? group : group.id
    const cacheKey = server + '-' + key

    return await this.statisticsMetadataCache.get(cacheKey, async () => {
      const url = new UrlUtil.TargomoUrl(this.client)
        .host(this.client.config.statisticsUrl)
        .part('collection/meta')
        .part('/' + key + '')
        .key('apiKey')
        .params({
          serviceUrl: this.client.serviceUrl,
        })
        .toString()

      const result = await requests(this.client).fetch(url)
      if (!result.name && result.names && result.names.en) {
        result.name = result.names.en
      }

      if (result.stats && result.stats.length) {
        result.stats.forEach((stat: any) => {
          if (!stat.name && stat.names && stat.names.en) {
            stat.name = stat.names.en
          }
        })
      }

      return result
    })
  }

  /**
   *
   */
  async metadataKey(
    group: StatisticsGroupMeta | StatisticsGroupId,
    statistic: StatisticsItem
  ): Promise<StatisticsItemMeta> {
    const endpoint = await this.metadata(group)

    for (const attribute of endpoint.stats) {
      if (statistic.id == attribute.statistic_id || (attribute.names && attribute.names.en == statistic.name)) {
        return attribute
      }
    }

    return null
  }

  /**
   * Potentially decorate a layer route with excluded statistics.
   */
  tileRoute(group: StatisticsGroupMeta | StatisticsGroupId, include?: StatisticsItem[]) {
    const key = typeof group == 'number' ? group : group.id

    const urlObject = new UrlUtil.TargomoUrl(this.client)
      .host(this.client.config.statisticsUrl)
      .part('collection/tiles')
      .part('/' + key + '/{z}/{x}/{y}.mvt')
      .params({
        serviceUrl: this.client.serviceUrl,
      })
      .key('apiKey')

    return include && include.length > 0
      ? urlObject.params({ columns: encodeURIComponent(include.map((row) => +row.id).join(',')) }).toString()
      : urlObject.toString()
  }

  /**
   *
   * @param sources
   * @param options
   */
  async ensembles(): Promise<{ [id: string]: StatisticsGroupEnsemble }> {
    const cacheKey = [this.client.config.statisticsUrl, this.client.serviceKey, this.client.serviceUrl].join(',')

    return await this.statisticsEnsemblesCache.get(cacheKey, async () => {
      const url = new UrlUtil.TargomoUrl(this.client)
        .host(this.client.config.statisticsUrl)
        .part('collection/list/')
        .params({
          serviceUrl: this.client.serviceUrl,
        })
        .key('apiKey')
        .toString()

      const result = await requests(this.client).fetch(url, 'GET')

      // FIXME: workaround for server results
      for (const id in result) {
        if (result[id]) {
          const ensemble = result[id]
          ensemble.id = +ensemble.id
          if (ensemble.groups && ensemble.groups.length) {
            ensemble.groups.forEach((group: any) => {
              group.hierarchy = +group.hierarchy
              group.id = +group.id
            })
          }
        }
      }

      return result
    })
  }
}
