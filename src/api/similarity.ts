import { TargomoClient } from './targomoClient'
import { StatisticsSet, SimilarityCriteria, BoundingBox } from '../index';
import { requests} from '../util/requestUtil';

export class SimilarityClient {
  constructor(private client: TargomoClient) {
  }


  /**
   *
   */
  async metadata(key: StatisticsSet): Promise<any[]> {
    const url = `${this.client.config.tilesUrl}/similarity/meta/v1/${encodeURIComponent('' + key)}?&key=${encodeURIComponent(this.client.serviceKey)}`
    return await requests(this.client).fetch(url)
  }

  /**
   *
   */
  async fetch(group: StatisticsSet,
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

    const normalizeParam = normalizeOnViewport ? `?normalizeOnViewport=${!!normalizeOnViewport}` : ''
    const url = `${this.client.config.tilesUrl}/similarity/scores_cumulative/v1/${encodeURIComponent('' + group)}${normalizeParam}?&key=${encodeURIComponent(this.client.serviceKey)}`
    return await requests(this.client).fetch(url, 'POST', data)
  }
}

