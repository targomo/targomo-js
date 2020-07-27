import { TravelRequestOptions, UseCacheRequestOptions } from '../requestOptions';
import { LatLngIdTravelMode, LatLngId, GeometryIdTravelMode } from '../types';

export enum MultigraphRequestAggregation {
  NONE = 'none',
  SUM = 'sum',
  MAX = 'max',
  MIN = 'min',
  MEAN = 'mean',
  MEDIAN = 'median',
  NEAREST = 'nearest',
  UNION = 'routing_union',
  MATH = 'math',
  GRAVITATION = 'gravitation_huff'
}

export enum MultigraphRequestLayer {
  IDENTITY = 'identity',
  TILE = 'tile',
  HEXAGON = 'hexagon',
  CUSTOM_GEOMETRIES = 'custom_geometries'
}

export interface MultigraphAggregationOptions {
  type: MultigraphRequestAggregation
  ignoreOutliers?: boolean
  outlierPenalty?: number
  minSourcesRatio?: number
  minSourcesCount?: number
  maxResultValue?: number
  maxResultValueRatio?: number
  filterValuesForSourceOrigins?: string[]
  gravitationExponent?: number
  mathExpression?: string
  postAggregationFactor?: number
  aggregationInputParameters?: {
    [parameterName: string]: {
      inputFactor?: number
      gravitationAttractionStrength?: number
      gravitationPositiveInfluence?: number
    }
  }
}


export interface MultigraphSpecificRequestOptions {

  preAggregationPipeline: {
    [pipelineName: string]: MultigraphAggregationOptions
  }

  referencedStatisticIds: {
    [parameterName: string]: number
  }

  aggregation: MultigraphAggregationOptions

  serialization: {
    format: 'geojson' | 'json' | 'mvt'
    decimalPrecision?: number
    maxGeometryCount?: number
  }

  domain: {
    type: 'edge' | 'node' | 'statistic_geometry'
    edgeAggregationType?: 'min' | 'max' | 'mean'
    statisticGroupId?: number
  }

  layer: {
    type: MultigraphRequestLayer
    edgeAggregationType?: 'min' | 'max' | 'mean'
    geometryDetailPerTile?: number
    minGeometryDetailLevel?: number
    maxGeometryDetailLevel?: number
    geometryDetailLevel?: number
    customGeometryMergeAggregation?: 'max' | 'mean' | 'min' | 'sum'
  }

  edgeClasses?: number[]
}

export interface MultigraphRequestOptions extends TravelRequestOptions, UseCacheRequestOptions {
  multigraph: MultigraphSpecificRequestOptions;
}

export interface MultigraphRequestOptionsSourcesTargets extends MultigraphRequestOptions {
  sources?: LatLngIdTravelMode[]
  sourceGeometries?: GeometryIdTravelMode[]
  targets?: LatLngId[]
  format?: 'geojson' | 'json' | 'mvt'
}
