import { 
    LatLngIdTravelMode, LatLngId, GeometryIdTravelMode, 
    UseCacheRequestOptions, TravelRequestOptions 
} from '..';

export interface TimeRequestOptions extends TravelRequestOptions, UseCacheRequestOptions {
}

export interface TimeRequestOptionsSourcesTargets extends TravelRequestOptions, UseCacheRequestOptions {
  sources?: LatLngIdTravelMode[]
  sourceGeometries?: GeometryIdTravelMode[]
  targets?: LatLngId[]
}
