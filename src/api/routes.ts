import { FeatureCollection, LineString, Point } from 'geojson';
import { LatLngId, LatLngIdTravelMode } from '../index';
import { RouteRequestOptions } from '../types/options/routeRequestOptions';
import { Route } from '../types/responses/route';
import { requests } from '../util/requestUtil';
import { UrlUtil } from '../util/urlUtil';
import {
  RouteCompactOptions,
  RouteCompactOptionsSourcesTargets, RouteGeoJsonOptions,
  RouteGeoJsonOptionsSourcesTargets, RouteRequestPayload
} from './payload/routeRequestPayload';
import { TargomoClient } from './targomoClient';

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

  async fetch(options: RouteGeoJsonOptionsSourcesTargets):
    Promise<FeatureCollection<LineString|Point>[]>;

  async fetch(options: RouteCompactOptionsSourcesTargets):
    Promise<Route[]>;

  async fetch(
    sourcesOrOptions: LatLngIdTravelMode[] | RouteGeoJsonOptionsSourcesTargets | RouteCompactOptionsSourcesTargets,
    targets?: LatLngId[],
    options?: RouteGeoJsonOptions | RouteCompactOptions
  ):
    Promise<Route[] | FeatureCollection<LineString|Point>[]> {

    const sources = options ? <LatLngIdTravelMode[]>sourcesOrOptions : null
    options = options || <RouteGeoJsonOptionsSourcesTargets | RouteCompactOptionsSourcesTargets>sourcesOrOptions

    const cfg = new RouteRequestPayload(
      this.client,
      sources,
      targets,
      options
    )

    const result = await this._executeFetch(options, cfg);

    if (!options.pathSerializer || options.pathSerializer === 'compact') {
      return result.routes.map((meta: any) => {
        return new Route(this.client, meta.travelTime, meta.segments, meta)
      })
    } else if (options.pathSerializer === 'geojson') {
      return result.routes;
    }
  }

  private async _executeFetch(options: RouteRequestOptions, cfg: RouteRequestPayload):
    Promise<{routes: any}> {

    const url = new UrlUtil.TargomoUrl(this.client)
      .part(this.client.serviceUrl)
      .version()
      .part('/route')
      .key()
      .toString();

    const result = await requests(this.client, options).fetchCachedData(options.useClientCache, url, 'POST', cfg, {
      // Headers are here because something needs to be fixed in the service endpoint
      'Accept': 'application/json,application/javascript,*/*'
    })

    return result
  }
}

