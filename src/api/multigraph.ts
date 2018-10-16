import { TargomoClient } from '.';
import { UrlUtil, LatLngIdTravelMode, LatLngId, requests, MultigraphRequestOptions } from '..';
import { MgResult } from '../types/responses/multigraphResult';
import { MultigraphRequestPayload } from './payload/multigraphRequestPayload';

export class MultigraphClient {
  constructor(private client: TargomoClient) {
  }

  /**

   */
  async fetch(sources: LatLngIdTravelMode[], options: MultigraphRequestOptions, targets?: LatLngId[]): Promise<MgResult> {
    const url = UrlUtil.buildTargomoUrl(this.client.serviceUrl, 'multigraph', this.client.serviceKey, true)
    console.log(url);

    const cfg = new MultigraphRequestPayload(sources, options, targets);

    console.log(JSON.stringify(cfg));
    const result = await requests(this.client, options).fetch(url, 'POST', cfg);
    return result;
  }

}
