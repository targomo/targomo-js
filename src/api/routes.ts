import { TargomoClient } from './targomoClient'
import { LatLngIdTravelMode, LatLngId } from '../index';
import { RouteRequestOptions } from '../types/options/routeRequestOptions';
import { Route } from '../types/responses/route';
import { requests } from '../util/requestUtil';
import { UrlUtil } from '../util/urlUtil';
import { RouteRequestPayload, RouteGeoJsonOptions, RouteCompactOptions } from './payload/routeRequestPayload';
import { FeatureCollection, LineString, Point } from 'geojson';

/**
 * @Topic Routes
 */
export class RoutesClient {
  constructor(private client: TargomoClient) {
  }

  async fetch(sources: LatLngIdTravelMode[], targets: LatLngId[], options: RouteGeoJsonOptions):
    Promise<FeatureCollection<LineString|Point>[]>;

  async fetch(sources: LatLngIdTravelMode[], targets: LatLngId[], options: RouteCompactOptions):
    Promise<Route[]>;

  async fetch(sources: LatLngIdTravelMode[], targets: LatLngId[], options: RouteGeoJsonOptions|RouteCompactOptions):
    Promise<Route[] | FeatureCollection<LineString|Point>[]> {

      const cfg = new RouteRequestPayload(this.client, sources, targets, options)
      const result = await this._executeFetch(sources, targets, options, cfg);
      if (options.pathSerializer === 'compact') {
        return result.routes.map((meta: any) => {
          return new Route(this.client, meta.travelTime, meta.segments, meta)
        })
      } else if (options.pathSerializer === 'geojson') {
        return result.routes;
      }

  }

  private async _executeFetch(sources: LatLngIdTravelMode[], targets: LatLngId[], options: RouteRequestOptions, cfg: RouteRequestPayload):
    Promise<{routes: any}> {

    const url = new UrlUtil.TargomoUrl(this.client)
      .part(this.client.serviceUrl)
      .version()
      .part('/route')
      .key()
      .params({
        cfg: encodeURIComponent(JSON.stringify(cfg))
      })
      .toString();

    const result = await requests(this.client, options).fetchCachedData(options.useClientCache, url, 'GET', undefined, {
      // Headers are here because something needs to be fixed in the service endpoint
      'Accept': 'application/json,application/javascript,*/*'
    })

    return result
  }
}

