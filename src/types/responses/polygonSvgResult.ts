import { BoundingBox } from '../types';

export interface PolygonData {
  area: number,
  travelTime: number,
  outerBoundary: [number, number][],
  innerBoundary: [number, number][][]
}

export interface MultipolygonData {
  polygons: PolygonData[]
}

export interface PolygonSvgResult extends MultipolygonData {
  area: number,
  bounds3857: BoundingBox
}
