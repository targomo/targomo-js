import { OSMType, TravelRequestOptions } from '..'

export interface POIRequestOptions extends TravelRequestOptions {
  osmTypes: OSMType[]
  format?: 'json' | 'geojson'
}
