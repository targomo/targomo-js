import { TargomoClient } from '.';
import { UrlUtil, LatLngIdTravelMode, LatLngId, requests, MultigraphRequestOptions } from '..';
import { MgResult, MgOverviewResult } from '../types/responses/multigraphResult';
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

    let url = new UrlUtil.TargomoUrl(this.client)
      .part(this.client.serviceUrl)
      .version()
      .part('multigraph')
      .key()
      .toString();

    const cfg = new MultigraphRequestPayload(sources, options, targets);
    const result = await requests(this.client, options).fetch(url, 'POST', cfg);
    return result;
  }

  async fetchOverview(sources: LatLngIdTravelMode[], options: MultigraphRequestOptions, targets?: LatLngId[]): Promise<MgOverviewResult> {

    let url = new UrlUtil.TargomoUrl(this.client)
      .part(this.client.serviceUrl)
      .version()
      .part('multigraph/overview')
      .key()
      .toString();

    const cfg = new MultigraphRequestPayload(sources, options, targets);
    const result = await requests(this.client, options).fetch(url, 'POST', cfg);
    return result;
  }

  async getTiledMultigraphUrl(
    sources: LatLngIdTravelMode[],
    options: MultigraphRequestOptions,
    format: 'geojson' | 'json' | 'mvt',
    targets?: LatLngId[]): Promise<string> {

    let url = new UrlUtil.TargomoUrl(this.client)
      .part(this.client.serviceUrl)
      .version()
      .part('objectcache/add')
      .key()
      .toString();

    const cfg = new MultigraphRequestPayload(sources, options, targets);
      // TODO ObjectCache should have its own client
    const objectCache: any = await requests(this.client, options).fetch(url, 'POST', cfg);
    return new UrlUtil.TargomoUrl(this.client)
      .part(this.client.serviceUrl)
      .version()
      .part('multigraph/{z}/{x}/{y}.' + format)
      .key()
      .params({
        cfgUuid: objectCache.uuid
      })
      .toString();
  }
}
