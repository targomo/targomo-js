import { 
    LatLngIdTravelMode, LatLngId, GeometryIdTravelMode, 
    UseCacheRequestOptions, TravelRequestOptions 
} from '..';

export interface RouteRequestOptions extends TravelRequestOptions, UseCacheRequestOptions {
  recommendations?: number | boolean
}

export interface RouteRequestOptionsSourcesTargets extends RouteRequestOptions {
  sources?: LatLngIdTravelMode[]
  sourceGeometries?: GeometryIdTravelMode[]
  targets: LatLngId[]
}
