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

    const url = new UrlUtil.TargomoUrl(this.client)
      .host(this.client.config.tilesUrl)
      .part('similarity/meta/')
      .version()
      .part('/' + encodeURIComponent('' + key))
      .key()
      .toString();

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

    const urlObject = new UrlUtil.TargomoUrl(this.client)
      .host(this.client.config.tilesUrl)
      .part('similarity/scores_cumulative/')
      .version()
      .part('/' + encodeURIComponent('' + group))
      .key();
    const url = normalizeOnViewport ? urlObject.params({normalizeOnViewport: !!normalizeOnViewport}).toString() : urlObject.toString();

    return await requests(this.client).fetch(url, 'POST', data)
  }
}
