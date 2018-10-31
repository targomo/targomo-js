import { UseCacheRequestOptions, TravelRequestOptions } from './../requestOptions';
import { BaseRequestOptions } from '../requestOptions';

export interface RouteRequestOptions extends TravelRequestOptions, UseCacheRequestOptions {
  recommendations?: number
  pathSerializer?: 'compact' | 'geojson'
}
