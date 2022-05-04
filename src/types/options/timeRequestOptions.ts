import { UseCacheRequestOptions, TravelRequestOptions } from '../requestOptions'
import { LatLngIdTravelMode, LatLngId, GeometryIdTravelMode } from '../types'

export interface TimeRequestOptions extends TravelRequestOptions, UseCacheRequestOptions {}

export interface TimeRequestOptionsSourcesTargets extends TravelRequestOptions, UseCacheRequestOptions {
  sources?: LatLngIdTravelMode[]
  sourceGeometries?: GeometryIdTravelMode[]
  targets?: LatLngId[]
}
