import { TravelRequestOptions} from '../index'
import { OSMType } from '../types'

export interface POIRequestOptions extends TravelRequestOptions {
  osmTypes: OSMType[]
}
