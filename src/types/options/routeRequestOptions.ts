import { UseCacheRequestOptions, TravelRequestOptions } from './../requestOptions'
import { LatLngIdTravelMode, LatLngId, GeometryIdTravelMode } from '../types'

export interface RouteRequestOptions extends TravelRequestOptions, UseCacheRequestOptions {
  recommendations?: number | boolean
}

export interface RouteRequestOptionsSourcesTargets extends RouteRequestOptions {
  sources?: LatLngIdTravelMode[]
  sourceGeometries?: GeometryIdTravelMode[]
  targets: LatLngId[]
}
