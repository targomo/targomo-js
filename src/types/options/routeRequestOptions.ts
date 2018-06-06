import { TravelRequestOptions, TravelOptionsClientCache} from '../index'

export interface RouteRequestOptions extends TravelRequestOptions, TravelOptionsClientCache {
  recommendations?: boolean
}
