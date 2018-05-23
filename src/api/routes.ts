import { TargomoClient } from './targomoClient'
import { LatLngIdTravelMode, LatLngId } from '../index';
import { RouteRequestOptions } from '../types/options/routeRequestOptions';
import { Route } from '../types/responses/route';
import { requests} from '../util/requestUtil';
import { UrlUtil } from '../util/urlUtil';
import { TimeRequestPayload } from './payload/timeRequestPayload';

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
    const cfg = new TimeRequestPayload(this.client, sources, targets, options)
    const url = UrlUtil.buildTargomoUrl(this.client.serviceUrl, 'route',
                                        this.client.serviceKey) + '&cb=cb&cfg=' + encodeURIComponent(JSON.stringify(cfg))
    const result = await requests(this.client, options).fetchCachedData(options.useClientCache, url, 'JSONP')

    return result.routes.map((meta: any) => {
      return new Route(this.client, meta.travelTime, meta.segments, meta)
    })
  }
}

