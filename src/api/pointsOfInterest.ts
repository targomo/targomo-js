import { LatLngId, LatLngIdProperties } from '../types';
import { POIRequestOptions, POIRequestOptionsBase } from '../types/options/poiRequestOptions';
import { requests } from '../util/requestUtil';
import { POIRequestPayload } from './payload/poiRequestPayload';
import { TargomoClient } from './targomoClient';
import { UrlUtil } from '../util';


/**
 *
 */
// TODO: better method names
/**
 * @Topic Points of Interest
 */
export class PointsOfInterestClient {
  // Idea is this will be instantiated internally in Targomoclient,. and will receive instance of parent in its constructor
  constructor(private client: TargomoClient) {
  }

  // TODO move queryRaw and query to common lib

  /**
   * Makes a request to the Targomo poi service.
   * Returns a list of OSMLatLng locations of the categories specified by `osmTypes` that are reachable within the given travel options
   */
  async reachable(source: LatLngId, // LatLng
    options: POIRequestOptions): Promise<{[index: string]: LatLngIdProperties}> {
    // TODO:different return type (todo: check server doesn't return array)
    const url = `${this.client.config.poiUrl}/reachability`
    return await requests(this.client, options).fetch(url, 'POST', new POIRequestPayload(this.client, source, options))
  }

  /**
   * Generate URL for tile-based POI resources
   * @param options
   * @param format
   */
  async getTiledUrl(
    options: POIRequestOptionsBase,
    format: 'geojson' | 'mvt'): Promise<string> {

    return new UrlUtil.TargomoUrl(this.client)
      .part(this.client.serviceUrl)
      .version()
      .part('/pointofinterest/{zoom}/{x}/{y}' + format)
      .key()
      .params(options)
      .toString();
  }
}

