import { GeometryIdTravelMode, LatLngId, SRID } from '../types'
import { TravelRequestOptions, UseCacheRequestOptions } from './../requestOptions'

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
