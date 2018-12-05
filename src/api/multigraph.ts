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

  getTiledMultigraphUrl(
    sources: LatLngIdTravelMode[],
    options: MultigraphRequestOptions,
    format: 'geojson' | 'json' | 'mvt',
    targets?: LatLngId[]): string {
    const config = encodeURIComponent(JSON.stringify(new MultigraphRequestPayload(sources, options, targets)));
    return this.client.serviceUrl + 'v1/multigraph/{z}/{x}/{y}.' + format + '?key=' + this.client.serviceKey + '&cfg=' + config;
  }
}
