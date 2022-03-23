import { GeometryIdTravelMode, LatLngId, SRID, TravelRequestOptions, UseCacheRequestOptions } from '..';

export interface PolygonRequestOptions extends TravelRequestOptions, UseCacheRequestOptions {
  minPolygonHoleSize?: number
  buffer?: number
  simplify?: number
  srid?: SRID
  travelEdgeWeights: number[]
  quadrantSegments?: number
  intersectionMode?: 'average' | 'union' | 'intersection' | 'none'
  decimalPrecision?: number
}

export interface PolygonRequestOptionsSources extends PolygonRequestOptions {
  sources?: LatLngId[]
  sourceGeometries?: GeometryIdTravelMode[]
}
