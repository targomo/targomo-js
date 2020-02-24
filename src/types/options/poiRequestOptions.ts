import { OSMType } from '../types'
import { TravelRequestOptions } from '../requestOptions';

export interface POIRequestOptionsBase {
  osmTypes: OSMType[]
  exclude?: OSMType[]
  match?: 'any' | 'all'
  format?: 'json' | 'geojson'
}

export interface POIRequestOptions extends TravelRequestOptions, POIRequestOptionsBase {}
