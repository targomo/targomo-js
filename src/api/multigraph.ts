import { TargomoClient } from '.';
import { UrlUtil, LatLngIdTravelMode, LatLngId, requests, MultigraphRequestOptions } from '..';
import { MgResult } from '../types/responses/multigraphResult';
import { MultigraphRequestPayload } from './payload/multigraphRequestPayload';

/**
 * @Topic Multigraph
 */
export class MultigraphClient {
  constructor(private client: TargomoClient) {
  }

  /**

   */
  async fetch(sources: LatLngIdTravelMode[], options: MultigraphRequestOptions, targets?: LatLngId[]): Promise<MgResult> {
    const url = UrlUtil.buildTargomoUrl(this.client.serviceUrl, 'multigraph', this.client.serviceKey, true)
    const cfg = new MultigraphRequestPayload(sources, options, targets);
    const result = await requests(this.client, options).fetch(url, 'POST', cfg);
    return result;
  }

  async getTiledMultigraphUrl(
    sources: LatLngIdTravelMode[],
    options: MultigraphRequestOptions,
    format: 'geojson' | 'json' | 'mvt',
    targets?: LatLngId[]): Promise<string> {
    const url = UrlUtil.buildTargomoUrl(this.client.serviceUrl, 'objectcache/add', this.client.serviceKey, true)
    const cfg = new MultigraphRequestPayload(sources, options, targets);
      // TODO ObjectCache should have its own client
    const objectCache: any = await requests(this.client, options).fetch(url, 'POST', cfg);
    return this.client.serviceUrl +
          'v1/multigraph/{z}/{x}/{y}.' +
          format + '?key=' +
          this.client.serviceKey +
          '&cfgUuid=' +
          objectCache.uuid;
  }
}
