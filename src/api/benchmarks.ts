import { TargomoClient } from './targomoClient'
import { StatisticsGroupId, BenchmarkCriteria, BoundingBox } from '../index';
import { requests} from '../util/requestUtil';

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

    const url = `${this.client.config.tilesUrl}/benchmarks/scores_cumulative/v1/${encodeURIComponent('' + group)}`
                 + `?key=${encodeURIComponent(this.client.serviceKey)}`
    return await requests(this.client).fetch(url, 'POST', data)
  }

  /**
   *
   */
  async metadata(key: StatisticsGroupId): Promise<any[]> {
    const url = `${this.client.config.tilesUrl}/benchmarks/meta/v1/${encodeURIComponent('' + key)}`
                  + `?key=${encodeURIComponent(this.client.serviceKey)}`
    return await requests(this.client).fetch(url)
  }
}

