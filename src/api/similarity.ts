import { TargomoClient } from './targomoClient'
import { StatisticsGroupId, SimilarityCriteria, BoundingBox, UrlUtil } from '../index';
import { requests} from '../util/requestUtil';

/**
 * @Topic Similarity
 */
export class SimilarityClient {
  constructor(private client: TargomoClient) {
  }


  /**
   *
   */
  async metadata(key: StatisticsGroupId): Promise<any[]> {

    const url = UrlUtil.buildTargomoUrl(this.client.config.tilesUrl,
      '/similarity/meta/' +
      (this.client.config.version !== null && this.client.config.version !== undefined ? 'v' + this.client.config.version + '/' : '') +
      encodeURIComponent('' + key),
      this.client.serviceKey
    );

    return await requests(this.client).fetch(url)
  }

  /**
   *
   */
  async fetch(group: StatisticsGroupId,
    cell: number,
    conditions: SimilarityCriteria[],
    bounds: BoundingBox,
    normalizeOnViewport: boolean): Promise<any> {

  // TODO: have a "Payload" object
    const boundsData = {
      'west': bounds.southWest.lng,
      'south': bounds.southWest.lat,
      'east': bounds.northEast.lng,
      'north': bounds.northEast.lat
    }

    const data = {
      bounds: boundsData,
      refCellId: cell,
      scores: conditions.map(item => ({
        source: item.source,
        minutes: item.minutes,
        factor: item.factor || 1
      }))
    }

    const normalizeParam = (normalizeOnViewport ? `?normalizeOnViewport=${!!normalizeOnViewport}&` : '?')
                            + `?key=${encodeURIComponent(this.client.serviceKey)}`

    const url = this.client.config.tilesUrl +
    '/similarity/scores_cumulative/' +
    (this.client.config.version !== null && this.client.config.version !== undefined ? 'v' + this.client.config.version + '/' : '') +
    encodeURIComponent('' + group) + normalizeParam;

    return await requests(this.client).fetch(url, 'POST', data)
  }
}
