import { PolygonRequestOptions } from '../options/polygonRequestOptions';

export interface PolygonData {
    area: number,
    travelTime: number,
    outerBoundary: [number, number][],
    innerBoundary: [number, number][][]
  }

  export interface PolygonSvgResult {
    metadata: PolygonRequestOptions,
    area: number,
    polygons: PolygonData[]
  }
