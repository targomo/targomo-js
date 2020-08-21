import { TargomoClient } from '.';
import { UrlUtil, LatLngIdTravelMode, LatLngId, requests, MultigraphRequestOptions, MultigraphRequestOptionsSourcesTargets } from '..';
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
  async fetch(sources: LatLngIdTravelMode[], options: MultigraphRequestOptions, targets?: LatLngId[]): Promise<MgResult>
  async fetch(options: MultigraphRequestOptionsSourcesTargets): Promise<MgResult>
  async fetch(
    sourcesOrOptions: LatLngIdTravelMode[] | MultigraphRequestOptionsSourcesTargets,
    options?: MultigraphRequestOptions,
    targets?: LatLngId[]
  ): Promise<MgResult> {
    const sources = options ? <LatLngIdTravelMode[]>sourcesOrOptions : null
    options = options || <MultigraphRequestOptionsSourcesTargets>sourcesOrOptions

    let url = new UrlUtil.TargomoUrl(this.client)
      .part(this.client.serviceUrl)
      .version()
      .part('/multigraph')
      .key()
      .toString();

    const cfg = new MultigraphRequestPayload(sources, options, targets);
    const result = await requests(this.client, options).fetch(url, 'POST', cfg);
    return result;
  }

  async fetchOverview(sources: LatLngIdTravelMode[], options: MultigraphRequestOptions, targets?: LatLngId[]): Promise<MgOverviewResult>
  async fetchOverview(options: MultigraphRequestOptionsSourcesTargets): Promise<MgOverviewResult>
  async fetchOverview(
    sourcesOrOptions: LatLngIdTravelMode[] | MultigraphRequestOptionsSourcesTargets,
    options?: MultigraphRequestOptions,
    targets?: LatLngId[]
  ): Promise<MgOverviewResult> {
    const sources = options ? <LatLngIdTravelMode[]>sourcesOrOptions : null
    options = options || <MultigraphRequestOptionsSourcesTargets>sourcesOrOptions

    let url = new UrlUtil.TargomoUrl(this.client)
      .part(this.client.serviceUrl)
      .version()
      .part('/multigraph/overview')
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
    targets?: LatLngId[]
  ): Promise<string>
  async getTiledMultigraphUrl(options: MultigraphRequestOptionsSourcesTargets): Promise<string>
  async getTiledMultigraphUrl(
    sourcesOrOptions: LatLngIdTravelMode[] | MultigraphRequestOptionsSourcesTargets,
    options?: MultigraphRequestOptions,
    format?: 'geojson' | 'json' | 'mvt',
    targets?: LatLngId[]
  ): Promise<string> {
    const sources = options ? <LatLngIdTravelMode[]>sourcesOrOptions : null
    options = options || <MultigraphRequestOptionsSourcesTargets>sourcesOrOptions

    let url = new UrlUtil.TargomoUrl(this.client)
      .part(this.client.serviceUrl)
      .version()
      .part('/objectcache/add')
      .key()
      .toString();

    const cfg = new MultigraphRequestPayload(sources, options, targets);
      // TODO ObjectCache should have its own client
    const objectCache: any = await requests(this.client, options).fetch(url, 'POST', cfg);
    return new UrlUtil.TargomoUrl(this.client)
      .part(this.client.serviceUrl)
      .version()
      .part('/multigraph/{z}/{x}/{y}.' + (format || (<MultigraphRequestOptionsSourcesTargets>sourcesOrOptions).format || 'mvt'))
      .key()
      .params({
        cfgUuid: objectCache.uuid
      })
      .toString();
  }
}
