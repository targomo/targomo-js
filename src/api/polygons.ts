import { TargomoClient } from './targomoClient'
import { LatLngId } from '../index';
import { PolygonRequestOptions } from '../types/options/polygonRequestOptions';
import { PolygonRequestPayload } from './payload/polygonRequestPayload';
import { UrlUtil } from '../util/urlUtil';
import { requests} from '../util/requestUtil';
import { PolygonSvgResult } from '../types/responses/polygonSvgResult';

export class PolygonsClient {
  constructor(private client: TargomoClient) {
  }

  /**
   * Request geojson polygons for one or more sources from r360 service
   */
  async fetchGeojson(sources: LatLngId[], options: PolygonRequestOptions): Promise<{}> {
    const cfg = new PolygonRequestPayload(this.client, sources, options, 'geojson')
    return await this.fetch(sources, options, cfg);
  }

  /**
   * Request svg polygons for one or more sources from r360 service
   */
  async fetchSvg(sources: LatLngId[], options: PolygonRequestOptions): Promise<PolygonSvgResult> {
    const cfg = new PolygonRequestPayload(this.client, sources, options, 'json')
    return await this.fetch(sources, options, cfg) as PolygonSvgResult;
  }

  private async fetch(sources: LatLngId[], options: PolygonRequestOptions, cfg: PolygonRequestPayload): Promise<{}> {
    const url = UrlUtil.buildTargomoUrl(this.client.serviceUrl, 'polygon', this.client.serviceKey)
    const result = await requests(this.client, options).fetchCachedData(options.useClientCache, url, 'POST', cfg) as PolygonSvgResult
    result.metadata = options
    return result
  }
}
