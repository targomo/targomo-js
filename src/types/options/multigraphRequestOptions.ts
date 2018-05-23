import { TravelRequestOptions, TravelOptionsClientCache} from '../index'
import { SRID } from '../../index';

export enum MultigraphRequestAggregation {
  NONE = 'none',
  SUM = 'sum',
  MAX = 'max',
  MIN = 'min',
  MEAN = 'mean',
  MEDIAN = 'median',
  NEAREST = 'nearest',
}

export interface MultigraphSpecificRequestOptions {
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

export interface MultigraphRequestOptions extends TravelRequestOptions, TravelOptionsClientCache, MultigraphSpecificRequestOptions {

}
