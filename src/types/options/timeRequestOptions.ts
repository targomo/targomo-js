import { TravelRequestOptions, TravelOptionsClientCache} from '../index'

export interface TimeRequestOptions extends TravelRequestOptions, TravelOptionsClientCache {
  intersectionMode?: string
}
