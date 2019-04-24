import { TargomoClient } from './targomoClient'
import { LatLngId } from '../index';
import { PolygonRequestOptions } from '../types/options/polygonRequestOptions';
import { PolygonRequestPayload, PolygonGeoJsonOptions, PolygonSvgOptions } from './payload/polygonRequestPayload';
import { UrlUtil } from '../util/urlUtil';
import { requests} from '../util/requestUtil';
import { PolygonSvgResult, PolygonData } from '../types/responses/polygonSvgResult';
import { FeatureCollection, MultiPolygon } from 'geojson';
import { ProjectedPolygon, ProjectedBounds } from '../types/projectedPolygon';
import { webMercatorToLatLng, boundingBoxFromLocationArray } from '../geometry';
import { BoundingBox, LatLng } from '../types';


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

  async fetch(sources: LatLngId[], options: PolygonSvgOptions|PolygonGeoJsonOptions):
    Promise<PolygonArray | FeatureCollection<MultiPolygon>> {
      const cfg = new PolygonRequestPayload(this.client, sources, options)
      const result = await this._executeFetch(sources, options, cfg);
      if (options.serializer === 'json') {
        // const boundedResults = (result as PolygonSvgResult[]).map((polygons: any) => new BoundedPolygonSvgResult(polygons))
        const boundedPolys = PolygonArray.create(result, result.metadata);
        return boundedPolys;
      } else if (options.serializer === 'geojson') {
        return result as FeatureCollection<MultiPolygon>;
      }
  }

  private async _executeFetch(sources: LatLngId[], options: PolygonRequestOptions, cfg: PolygonRequestPayload): Promise<any> {

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
