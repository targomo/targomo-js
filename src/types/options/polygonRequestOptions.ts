import { TravelOptionsClientCache} from '../index'
import { SRID } from '../types'
import { TravelTypeOptions, TravelMoreRequestOptions } from '../travelOptions'

export interface PolygonRequestOptions extends TravelMoreRequestOptions, TravelOptionsClientCache, TravelTypeOptions {
  minPolygonHoleSize?: number
  buffer?: number
  simplify?: number
  srid?: SRID

  travelEdgeWeights: number[]

  // format?: string
  simplifyMeters?: number
  quadrantSegments?: number

  serializer?: 'json' | 'geojson'
  intersectionMode?: string
  decimalPrecision?: number
}
