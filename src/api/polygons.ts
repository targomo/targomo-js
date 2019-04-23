import { TargomoClient } from './targomoClient'
import { LatLngId } from '../index';
import { PolygonRequestOptions } from '../types/options/polygonRequestOptions';
import { PolygonRequestPayload, PolygonGeoJsonOptions, PolygonSvgOptions } from './payload/polygonRequestPayload';
import { UrlUtil } from '../util/urlUtil';
import { requests} from '../util/requestUtil';
import { PolygonSvgResult, PolygonData } from '../types/responses/polygonSvgResult';
import { FeatureCollection, MultiPolygon } from 'geojson';
import { ProjectedPolygon, ProjectedBounds, ProjectedBoundsData } from '../types/projectedPolygon';
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
        const boundedResults = (result as PolygonSvgResult[]).map((polygons: any) => new BoundedPolygonSvgResult(polygons))
        const boundedPolys = PolygonArray.create(boundedResults, result.metadata);
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
 * Class to add bounds to each polygon ring
 */
export class BoundedPolygonSvgResult implements PolygonSvgResult {
  area: number;
  polygons: PolygonData[];
  bounds3857: ProjectedBounds;

  constructor(svgPolygonResult: PolygonSvgResult) {
    this.area = svgPolygonResult.area;
    this.polygons = svgPolygonResult.polygons;
    let bounds3857: ProjectedBounds
    this.polygons.forEach((polygonData: PolygonData) => {
      const polygon = new ProjectedPolygon(polygonData)
      if (bounds3857) {
        bounds3857.expand(polygon.bounds3857)
      } else {
        bounds3857 = polygon.bounds3857
      }
    })
    this.bounds3857 = bounds3857
  }
}


/**
 * Class to extend Array for polygons result to add maxBounds method to array results
 */
export class PolygonArray extends Array<BoundedPolygonSvgResult> {
  private constructor(items?: Array<BoundedPolygonSvgResult>) {
    super(...items)
  }
  static create(items: Array<BoundedPolygonSvgResult>, metadata?: any): PolygonArray {
    const newProto = Object.create(PolygonArray.prototype);
    (items as PolygonSvgResult[]).forEach((polygons: any) => newProto.push(new BoundedPolygonSvgResult(polygons)))
    if (metadata) {
      newProto.metadata = metadata;
    }
    return newProto;
  }

  getMaxBounds(): BoundingBox {
    let boundsPoints: LatLng[] = []
    this.forEach((polygons: BoundedPolygonSvgResult) => {
      const bounds: ProjectedBoundsData = polygons.bounds3857;
      boundsPoints.push(webMercatorToLatLng(bounds.northEast, null));
      boundsPoints.push(webMercatorToLatLng(bounds.southWest, null));
    });
    return boundingBoxFromLocationArray(boundsPoints);
  }
}
