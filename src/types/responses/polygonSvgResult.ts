import { ProjectedBounds } from '../projectedPolygon';

export interface PolygonData {
  area: number,
  travelTime: number,
  outerBoundary: [number, number][],
  innerBoundary: [number, number][][]
}

export interface PolygonSvgResult {
  area: number,
  polygons: PolygonData[]
}
