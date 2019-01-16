import { TargomoClient } from './targomoClient'
import { StatisticsGroupId, BenchmarkCriteria, BoundingBox, UrlUtil } from '../index';
import { requests} from '../util/requestUtil';

/**
 * @Topic Benchmarks
 */
export class BenchmarksClient {
  constructor(private client: TargomoClient) {
  }


  /**
   *
   */
  async fetch(group: StatisticsGroupId, conditions: BenchmarkCriteria[], bounds: BoundingBox): Promise<any> {
    // TODO: have a "Payload" object
    const boundsData = {
      'west': bounds.southWest.lng,
      'south': bounds.southWest.lat,
      'east': bounds.northEast.lng,
      'north': bounds.northEast.lat
    }

    const data = {
      bounds: boundsData,
      benchmarks: conditions.map(item => ({
        source: item.source,
        minEnd: item.minEnd,
        minStart: item.minStart,
        factor: item.factor,
      }))
    }

    const url = new UrlUtil.TargomoUrl(this.client)
      .part(this.client.config.tilesUrl)
      .part('benchmarks/scores_cumulative')
      .version()
      .part(encodeURIComponent('' + group))
      .key()
      .toString();

    return await requests(this.client).fetch(url, 'POST', data)
  }

  /**
   *
   */
  async metadata(key: StatisticsGroupId): Promise<any[]> {

    const url = new UrlUtil.TargomoUrl(this.client)
      .part(this.client.config.tilesUrl)
      .part('benchmarks/meta')
      .version()
      .part(encodeURIComponent('' + key))
      .key()
      .toString();

    return await requests(this.client).fetch(url)
  }
}

