import { TargomoClient } from './targomoClient'
import { LatLngId } from '../index';
import { PolygonRequestOptions } from '../types/options/polygonRequestOptions';
import { PolygonRequestPayload } from './payload/polygonRequestPayload';
import { UrlUtil } from '../util/urlUtil';
import { requests} from '../util/requestUtil';

export class PolygonsClient {
  constructor(private client: TargomoClient) {
  }

  // TODO: maybe  have separate methods for svg and geojson so that return type can be different

  /**
   * Request polygons for one or more sources from r360 service
   */
  async fetch(sources: LatLngId[], options: PolygonRequestOptions): Promise<{}> {
    const url = UrlUtil.buildTargomoUrl(this.client.serviceUrl, 'polygon', this.client.serviceKey)
    const cfg = new PolygonRequestPayload(this.client, sources, options)
    const result = await requests(this.client, options).fetchCachedData(options.useClientCache, url, 'POST', cfg)

    if (options.serializer == 'geojson') {
      result.metadata = options
      return result
    } else {
      throw new Error('TODO: svg parsing')
    }
  }
}
