import { TargomoClient } from './targomoClient'
import { LatLngId, StatisticsGroup, ReachableTile, StatisticsSetMeta, StatisticsSet, StatisticsKey, StatisticsKeyMeta } from '../index';
import { StatisticsRequestOptions, StatisticsTravelRequestOptions,
         StatisticsGeometryRequestOptions } from '../types/options/statisticsRequestOptions';
import { StatisticsRequestPayload } from './payload/statisticsRequestPayload';
import { StatisticsResult } from '../types/responses/index';
import { requests} from '../util/requestUtil';
import { SimpleLRU } from '../util/cache';
import { StatisticsGeometryRequestPayload } from './payload/statisticsGeometryRequestPayload';
import { StatisticsGeometryResult } from '../types/responses/statisticsGeometryResult';

export class StatisticsClient {
  private statisticsMetadataCache = new SimpleLRU<StatisticsSetMeta>(200)

  constructor(private client: TargomoClient) {
  }

  /**
   *
   * @param sources
   * @param options
   */
  async combined(sources: LatLngId[], // sources: LatLng[],
                 options: StatisticsRequestOptions): Promise<StatisticsGroup> {
    const result = await this.dependent(sources, {...options, omitIndividualStatistics: true})
    return result && result.statistics
  }

  /**
  * Make a statistics request to the r360 services
  */
  async individual(sources: LatLngId[], // sources: LatLng[],
                             options: StatisticsRequestOptions): Promise<{[id: string]: StatisticsGroup}> {
    const result = await this.dependent(sources, options)
    return result && result.individualStatistics
  }


  /**
  * Make a statistics request to the r360 services
  */
  async travelTimes(sources: LatLngId[],
                              options: StatisticsTravelRequestOptions): Promise<ReachableTile> {
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
  async geometry(geometry: any, options: StatisticsGeometryRequestOptions): Promise<StatisticsGeometryResult> {
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
  async metadata(group: StatisticsSetMeta | StatisticsSet) {
    const server = this.client.config.tilesUrl
    const key = (typeof group == 'number') ? group : group.id
    const cacheKey = server + '-' + key

    return await this.statisticsMetadataCache.get(cacheKey, async () => {
      const result = await requests(this.client).fetch(`${server}/statistics/meta/v1/${key}`)
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
  async metadataKey(group: StatisticsSetMeta | StatisticsSet, statistic: StatisticsKey): Promise<StatisticsKeyMeta> {
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
  tileRoute(group: StatisticsSetMeta | StatisticsSet, include: StatisticsKey[]) {
    const server = this.client.config.tilesUrl
    const key = (typeof group == 'number') ? group : group.id

    const includeParam = encodeURIComponent(include.map(row => `"${row.id}"`).join(','))
    return `${server}/statistics/tiles/v1/${key}/{z}/{x}/{y}.mvt?columns=${includeParam}&key=${encodeURIComponent(this.client.serviceKey)}`
  }
}
