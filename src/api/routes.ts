import { TargomoClient } from './targomoClient'
import { LatLngIdTravelMode, LatLngId } from '../index';
import { RouteRequestOptions } from '../types/options/routeRequestOptions';
import { Route } from '../types/responses/route';
import { requests } from '../util/requestUtil';
import { UrlUtil } from '../util/urlUtil';
import { RouteRequestPayload } from './payload/routeRequestPayload';

export class RoutesClient {
  constructor(private client: TargomoClient) {
  }

  /**
   *
   * @param sources
   * @param targets
   * @param options
   */
  async fetch(sources: LatLngIdTravelMode[], targets: LatLngId[], options: RouteRequestOptions): Promise<Route[]> {
    const cfg = new RouteRequestPayload(this.client, sources, targets, options)
    const url = UrlUtil.buildTargomoUrl(this.client.serviceUrl, 'route',
      this.client.serviceKey) + '&cfg=' + encodeURIComponent(JSON.stringify(cfg))
    const result = await requests(this.client, options).fetchCachedData(options.useClientCache, url, 'GET', undefined, {
      // Headers are here because something needs to be fixed in the service endpoint
      'Accept': 'application/json,application/javascript,*/*'
    })

    if (!result.routes) {
      return null
    }

    return result.routes.map((meta: any) => {
      return new Route(this.client, meta.travelTime, meta.segments, meta)
    })
  }
}

