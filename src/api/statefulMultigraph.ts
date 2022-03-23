import { TargomoClient } from './targomoClient'
import { LatLngId, MultigraphRequestOptions, MultigraphInfo, BoundingBox } from '../index'
import { requests, UrlUtil } from '../util'
import { StatefulMultigraphRequestPayload } from '../types'

/**
 * @Topic Stateful Multigraph
 */
export class StatefulMultigraphClient {
  constructor(private client: TargomoClient) {}

  /**
   * Creates a new multigraph tile set for the given sources and parameters.
   * Returns an id for the given aggregation to be used in subsequent mvt requests.
   *
   * @param sources
   * @param options
   */
  async create(sources: LatLngId[], options: MultigraphRequestOptions): Promise<string> {
    const url = new UrlUtil.TargomoUrl(this.client)
      .host(this.client.config.statisticsUrl)
      .part('multigraph')
      .key()
      .params({ serviceUrl: this.client.serviceUrl })
      .toString()

    const cfg = new StatefulMultigraphRequestPayload(this.client, sources, options)

    const result = await requests(this.client, options).fetchCachedData(
      options.useClientCache,
      url,
      'POST-RAW',
      JSON.stringify(cfg),
      { Accept: 'text/plain' }
    )
    return result
  }

  /**
   * Runs a "monolith" multigraph request for the given sources and parameters.
   * This performs the usual routing and then performs a global aggregation
   * into a single value per layer.
   *
   * @param sources
   * @param options
   */
  async monolith(sources: LatLngId[], options: MultigraphRequestOptions): Promise<string> {
    const url = new UrlUtil.TargomoUrl(this.client)
      .host(this.client.config.statisticsUrl)
      .part('multigraph/monolith')
      .key()
      .params({ serviceUrl: this.client.serviceUrl })
      .toString()

    const cfg = new StatefulMultigraphRequestPayload(this.client, sources, options)

    const result = await requests(this.client, options).fetchCachedData(options.useClientCache, url, 'POST', cfg, {
      Accept: 'application/json',
    })
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
   * @param multigraphId UUID of the multigraph
   */
  async info(multigraphId: string): Promise<MultigraphInfo> {
    const url = new UrlUtil.TargomoUrl(this.client)
      .host(this.client.config.statisticsUrl)
      .part('multigraph/' + multigraphId)
      .key()
      .params({ serviceUrl: this.client.serviceUrl })
      .toString()

    const result = await requests(this.client).fetch(url, 'GET')
    if (result.boundingBoxNorthEast && result.boundingBoxSouthWest) {
      result.boundingBox = <BoundingBox>{
        northEast: {
          lat: result.boundingBoxNorthEast.y,
          lng: result.boundingBoxNorthEast.x,
        },
        southWest: {
          lat: result.boundingBoxSouthWest.y,
          lng: result.boundingBoxSouthWest.x,
        },
      }
      delete result.boundingBoxNorthEast
      delete result.boundingBoxSouthWest
    }
    return result
  }

  /**
   * Redo Multigraph with UUID `multigraphId`
   *
   * @param multigraphId
   */
  async redo(multigraphId: string): Promise<void> {
    const url = new UrlUtil.TargomoUrl(this.client)
      .host(this.client.config.statisticsUrl)
      .part('multigraph/' + multigraphId + '/update')
      .key()
      .params({ serviceUrl: this.client.serviceUrl })
      .toString()

    const result = await requests(this.client).fetch(url, 'PATCH')
    return result
  }

  getTiledMultigraphUrl(multigraphId: string, format: 'geojson' | 'json' | 'mvt'): string {
    return new UrlUtil.TargomoUrl(this.client)
      .host(this.client.config.statisticsUrl)
      .part('multigraph/' + multigraphId + '/{z}/{x}/{y}.' + format)
      .key()
      .params({ serviceUrl: this.client.serviceUrl })
      .toString()
  }
}
