import { SRID } from '../../index';
import { BaseRequestOptions, TravelRequestOptions, UseCacheRequestOptions } from '../requestOptions';

export enum MultigraphRequestAggregation {
  NONE = 'none',
  SUM = 'sum',
  MAX = 'max',
  MIN = 'min',
  MEAN = 'mean',
  MEDIAN = 'median',
  NEAREST = 'nearest',
  UNION = 'routing_union'
}

export enum MultigraphRequestLayer {
  EDGE = 'edge',
  NODE = 'node',
  TILE = 'tile',
  HEXAGON = 'hexagon',
  TILE_NODE = 'tile_node',
  HEXAGON_NODE = 'hexagon_node'
}

export interface MultigraphSpecificRequestOptions {

  aggregation: {
    type: MultigraphRequestAggregation
    ignoreOutliers?: boolean
    outlierPenalty?: number
    minSourcesRatio?: number
    minSourceCount?: number
    maxResultValue?: number
    maxResultValueRatio?: number
    filterValuesForSourceOrigins?: string[]
  }

  serialization: {
    format: 'geojson' | 'json' | 'mvt'
    decimalPrecision?: number
    maxGeometryCount?: number
  }

  layer: {
    type: MultigraphRequestLayer
    edgeAggregationType?: 'min' | 'max' | 'mean'
    geometryDetailPerTile?: number
    minGeometryDetailLevel?: number
    maxGeometryDetailLevel?: number
    geometryDetailLevel?: number
  }

  edgeClasses?: number[]
}

export interface MultigraphRequestOptions extends TravelRequestOptions, UseCacheRequestOptions {
  multigraph: MultigraphSpecificRequestOptions;

}
