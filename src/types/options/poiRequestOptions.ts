import { OSMType } from '../types'
import { TravelRequestOptions } from '../requestOptions'

export interface POIRequestOptions extends TravelRequestOptions {
  osmTypes: OSMType[]
  format?: 'json' | 'geojson'
}
