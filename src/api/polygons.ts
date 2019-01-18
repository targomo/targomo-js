import { TargomoClient } from './targomoClient'
import { LatLngId } from '../index';
import { PolygonRequestOptions } from '../types/options/polygonRequestOptions';
import { PolygonRequestPayload, PolygonGeoJsonOptions, PolygonSvgOptions } from './payload/polygonRequestPayload';
import { UrlUtil } from '../util/urlUtil';
import { requests} from '../util/requestUtil';
import { PolygonSvgResult } from '../types/responses/polygonSvgResult';
import { FeatureCollection, MultiPolygon } from 'geojson';


/**
 * @Topic Polygons
 */
export class PolygonsClient {
  constructor(private client: TargomoClient) {
  }
  /**
   * Request geojson polygons for one or more sources from r360 service
   * @param sources
   * @param options
   */
  async fetch(sources: LatLngId[], options: PolygonGeoJsonOptions): Promise<FeatureCollection<MultiPolygon>>;


  /**
   * Request svg polygons for one or more sources from r360 service
   * @param sources
   * @param options
   */
  async fetch(sources: LatLngId[], options: PolygonSvgOptions): Promise<PolygonSvgResult[]>;

  async fetch(sources: LatLngId[], options: PolygonSvgOptions|PolygonGeoJsonOptions):
    Promise<PolygonSvgResult[] | FeatureCollection<MultiPolygon>> {
      const cfg = new PolygonRequestPayload(this.client, sources, options)
      const result = await this._executeFetch(sources, options, cfg);
      if (options.serializer === 'json') {
        return result as PolygonSvgResult[];
      } else if (options.serializer === 'geojson') {
        return result as FeatureCollection<MultiPolygon>;
      }
  }

  private async _executeFetch(sources: LatLngId[], options: PolygonRequestOptions, cfg: PolygonRequestPayload): Promise<{}> {

    const url = new UrlUtil.TargomoUrl(this.client)
      .part(this.client.serviceUrl)
      .version()
      .part('polygon')
      .key()
      .toString();

    const result = await requests(this.client, options).fetchCachedData(options.useClientCache, url, 'POST', cfg);
    result.metadata = options
    return result
  }
}
