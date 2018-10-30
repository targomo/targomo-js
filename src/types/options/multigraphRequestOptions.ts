import { UseCacheRequestOptions } from './../requestOptions';
import { SRID } from '../../index';
import { BaseRequestOptions } from '../requestOptions';

export enum MultigraphRequestAggregation {
  NONE = 'none',
  SUM = 'sum',
  MAX = 'max',
  MIN = 'min',
  MEAN = 'mean',
  MEDIAN = 'median',
  NEAREST = 'nearest',
}


export interface MultigraphRequestOptions extends BaseRequestOptions, UseCacheRequestOptions {
  edgeClasses?: number[]

  serialization?: {
    type?: 'geojson' | 'json'
    decimalPrecision?: number
    srid?: SRID
  }

  aggregation?: {
    type?: MultigraphRequestAggregation
    ignoreOutliers?: boolean
    outlierPenalty?: number
    minSourcesRatio?: number
    minSourceCount?: number
    maxResultValue?: number
    maxResultValueRatio?: number
  }
}
