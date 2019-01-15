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
  StatisticsGroupEnsemble
} from '../index';
import { StatisticsRequestPayload } from './payload/statisticsRequestPayload';
import { StatisticsResult } from '../types/responses/index';
import { requests } from '../util/requestUtil';
import { SimpleLRU } from '../util/cache';
import { StatisticsGeometryRequestPayload } from './payload/statisticsGeometryRequestPayload';
import { StatisticsGeometryResult } from '../types/responses/statisticsGeometryResult';

/**
 * @Topic Statistics
 */
export class StatisticsClient {
  private statisticsMetadataCache = new SimpleLRU<StatisticsGroupMeta>(200)
  private statisticsEnsemblesCache = new SimpleLRU<{[id: string]: StatisticsGroupEnsemble}>(200)

  constructor(private client: TargomoClient) {
  }

  /**
   *
   * @param sources
   * @param options
   */
  async combined(sources: LatLngId[], // sources: LatLng[],
    options: StatisticsRequestOptions): Promise<StatisticsList> {
    const result = await this.dependent(sources, options)
    return result && result.statistics
  }

  /**
  * Make a statistics request to the r360 services
  */
  async individual(sources: LatLngId[], // sources: LatLng[],
    options: StatisticsRequestOptions): Promise<{ [id: string]: StatisticsList }> {
    const result = await this.dependent(sources, options)
    return result && result.individualStatistics
  }


  /**
  * Make a statistics request to the r360 services
  */
  async travelTimes(sources: LatLngId[], options: StatisticsTravelRequestOptions): Promise<ReachableTile> {
    if (!sources.length) {
      return null
    }

    const url = this.client.config.statisticsUrl + '/traveltimes?serviceUrl=' + encodeURIComponent(this.client.serviceUrl)
    return await requests(this.client, options).fetch(url, 'POST', new StatisticsRequestPayload(this.client, sources, options))
  }

  /**
   *
   * @param sources
   * @param options
   */
  async dependent(sources: LatLngId[], // was LatLng[]
    options: StatisticsRequestOptions): Promise<StatisticsResult> {

    if (!sources.length) {
      return null
    }

    const url = this.client.config.statisticsUrl + '/charts/dependent?serviceUrl=' + encodeURIComponent(this.client.serviceUrl)
    const result = await requests(this.client, options)
      .fetch(url, 'POST', new StatisticsRequestPayload(this.client, sources, options))
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

    const url = this.client.config.statisticsUrl + '/values/geometry?serviceUrl=' + encodeURIComponent(this.client.serviceUrl)
    const result = await requests(this.client, options)
    .fetch(url, 'POST', new StatisticsGeometryRequestPayload(this.client, geometry, options))
    return new StatisticsGeometryResult(result, options.statistics)
  }

  /**
   *
   * @param group
   */
  async metadata(group: StatisticsGroupMeta | StatisticsGroupId) {
    const server = this.client.config.tilesUrl
    const key = (typeof group == 'number') ? group : group.id
    const cacheKey = server + '-' + key

    return await this.statisticsMetadataCache.get(cacheKey, async () => {
      const result = await requests(this.client)
                     .fetch(`${server}/statistics/meta/v${this.client.config.version}/` +
                     `${key}?key=${encodeURIComponent(this.client.serviceKey)}`)
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
  async metadataKey(group: StatisticsGroupMeta | StatisticsGroupId, statistic: StatisticsItem): Promise<StatisticsItemMeta> {
    const endpoint = await this.metadata(group)

    for (let attribute of endpoint.stats) {
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
    const server = this.client.config.tilesUrl
    const key = (typeof group == 'number') ? group : group.id

    let includeParam = ''

    if (include && include.length > 0) {
      includeParam = 'columns=' + encodeURIComponent(include.map(row => +row.id).join(',')) + '&'
    }
    return `${server}/statistics/tiles/v${this.client.config.version}/` +
    `${key}/{z}/{x}/{y}.mvt?${includeParam}key=${encodeURIComponent(this.client.serviceKey)}`
  }

  /**
   *
   * @param sources
   * @param options
   */
  async ensembles(): Promise<{[id: string]: StatisticsGroupEnsemble}> {
    const cacheKey = this.client.config.tilesUrl

    return await this.statisticsEnsemblesCache.get(cacheKey, async () => {
      const url = this.client.config.tilesUrl + '/ensemble/list/v' + this.client.config.version +
      '?key=' + encodeURIComponent(this.client.serviceKey)
      const result = await requests(this.client).fetch(url, 'GET')

      // FIXME: workaround for server results
      for (let id in result) {
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
