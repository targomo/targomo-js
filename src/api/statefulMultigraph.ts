import { TargomoClient } from './targomoClient'
import { LatLngId, MultigraphRequestOptions, MultigraphInfo, BoundingBox } from '../index';
import { UrlUtil } from '../util/urlUtil';
import { requests } from '../util/requestUtil';
import { StatefulMultigraphRequestPayload } from './payload/statefulMultigraphRequestPayload';

export class StatefulMultigraphClient {
  constructor(private client: TargomoClient) {
  }

  /**
   * Creates a new multigraph tile set for the given sources and parameters.
   * Returns an id for the given aggregation to be used in subsequent mvt requests.
   *
   * @param sources
   * @param options
   */
  async create(sources: LatLngId[], options: MultigraphRequestOptions): Promise<number> {
    const url = UrlUtil.buildTargomoUrl(this.client.config.statisticsUrl, 'multigraph', this.client.serviceKey, false)



    const cfg = new StatefulMultigraphRequestPayload(this.client, sources, options);

    const result = await requests(this.client, options)
      .fetchCachedData(options.useClientCache, url, 'POST', cfg, { 'Accept': 'text/plain' })
    return result
  }

  /**
   * Returns Info about the current State of the multigraph calculation
   *
   * **Multigraph Lifecycle**
   * 1. CREATED
   * 2. ROUTING
   * 3. MERGING
   * 4. AGGREGATING
   * 5. COMPLETED / FAILED
   *
   * @param multigaphId Id of the multigraph
   */
  async info(multigaphId: number): Promise<MultigraphInfo> {
    const url = UrlUtil.buildTargomoUrl(this.client.config.statisticsUrl, 'multigraph/' + multigaphId, this.client.serviceKey, false)
    const result = await requests(this.client).fetch(url, 'GET')
    if (result.boundingBoxNorthEast && result.boundingBoxSouthWest) {
      result.boundingBox = <BoundingBox>{
        northEast: {
          lat: result.boundingBoxNorthEast.y,
          lng: result.boundingBoxNorthEast.x
        },
        southWest: {
          lat: result.boundingBoxSouthWest.y,
          lng: result.boundingBoxSouthWest.x
        }
      }
      delete result.boundingBoxNorthEast
      delete result.boundingBoxSouthWest
    }
    return result
  }

  /**
   * Redo Multigraph with id `multigraphId`
   *
   * @param multigaphId
   */
  async redo(multigaphId: number): Promise<void> {
    const url =
      UrlUtil.buildTargomoUrl(this.client.config.statisticsUrl, 'multigraph/' + multigaphId + '/update', this.client.serviceKey, false)
    const result = await requests(this.client).fetch(url, 'PATCH')
    return result
  }
}
