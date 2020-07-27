import { FeatureCollection, MultiPolygon } from 'geojson';
import { boundingBoxFromLocationArray, webMercatorToLatLng } from '../geometry';
import { LatLngId } from '../index';
import { BoundingBox, LatLng } from '../types';
import { PolygonRequestOptions } from '../types/options/polygonRequestOptions';
import { ProjectedBounds, ProjectedPolygon } from '../types/projectedPolygon';
import { PolygonData, PolygonSvgResult } from '../types/responses/polygonSvgResult';
import { requests } from '../util/requestUtil';
import { UrlUtil } from '../util/urlUtil';
import { PolygonGeoJsonOptions, PolygonGeoJsonOptionsSources,
         PolygonRequestPayload, PolygonSvgOptions, PolygonSvgOptionsSources } from './payload/polygonRequestPayload';
import { TargomoClient } from './targomoClient';


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
  async fetch(sources: LatLngId[], options: PolygonSvgOptions): Promise<PolygonArray>;

  /**
   * Request geojson polygons for one or more sources from r360 service
   * @param options
   */
  async fetch(options: PolygonGeoJsonOptionsSources): Promise<FeatureCollection<MultiPolygon>>;

  /**
   * Request svg polygons for one or more sources from r360 service
   * @param options
   */
  async fetch(options: PolygonSvgOptionsSources): Promise<PolygonArray>;


  async fetch(
    sourcesOrOptions: LatLngId[] | PolygonGeoJsonOptionsSources | PolygonSvgOptionsSources,
    options?: PolygonSvgOptions | PolygonGeoJsonOptions
  ): Promise<PolygonArray | FeatureCollection<MultiPolygon>> {
    const sources = options ? <LatLngId[]>sourcesOrOptions : null
    options = options || <PolygonGeoJsonOptionsSources | PolygonSvgOptionsSources>sourcesOrOptions

    const cfg = new PolygonRequestPayload(
      this.client,
      sources,
      options
    )

    const result = await this._executeFetch(options, cfg);
    if (options.serializer === 'json') {
      const boundedPolys = PolygonArray.create(result, result.metadata);
      return boundedPolys;
    } else if (options.serializer === 'geojson') {
      return result as FeatureCollection<MultiPolygon>;
    }
  }

  private async _executeFetch(options: PolygonRequestOptions, cfg: PolygonRequestPayload): Promise<any> {

    const url = new UrlUtil.TargomoUrl(this.client)
      .part(this.client.serviceUrl)
      .version()
      .part('/polygon')
      .key()
      .toString();

    const result = await requests(this.client, options).fetchCachedData(options.useClientCache, url, 'POST', cfg);
    result.metadata = options
    return result
  }
}

/**
 * Class to extend Array for polygons result to add maxBounds method to array results
 */
export class PolygonArray extends Array<PolygonSvgResult> {
  private constructor(items?: Array<PolygonSvgResult>) {
    super(...items)
  }
  static create(items: Array<PolygonSvgResult>, metadata?: any): PolygonArray {
    const newProto = Object.create(PolygonArray.prototype);
    (items as PolygonSvgResult[]).forEach((polygons: any) => newProto.push(polygons))
    if (metadata) {
      newProto.metadata = metadata;
    }
    return newProto;
  }

  getMaxBounds(): BoundingBox {
    let boundsPoints: LatLng[] = []
    this.forEach((svgPolygons: PolygonSvgResult) => {
      let bounds3857: ProjectedBounds;
      svgPolygons.polygons.forEach((polygonData: PolygonData) => {
        const polygon = new ProjectedPolygon(polygonData)
        if (bounds3857) {
          bounds3857.expand(polygon.bounds3857)
        } else {
          bounds3857 = polygon.bounds3857
        }
      })

      boundsPoints.push(webMercatorToLatLng(bounds3857.northEast, null));
      boundsPoints.push(webMercatorToLatLng(bounds3857.southWest, null));
    });
    return boundingBoxFromLocationArray(boundsPoints);
  }
}
