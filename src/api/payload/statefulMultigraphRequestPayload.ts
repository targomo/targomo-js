import { StatisticsRequestPayload } from './statisticsRequestPayload';
import { LatLngId, MultigraphRequestOptions, MultigraphRequestAggregation, MultigraphAggregationOptions} from '../../types';
import { TargomoClient } from '../targomoClient';

export class StatefulMultigraphRequestPayload extends StatisticsRequestPayload {

  multiGraphPreAggregationPipeline: {
    [pipelineName: string]: MultigraphAggregationOptions
  }

  multiGraphReferencedStatisticIds: {
    [parameterName: string]: number
  }

  multiGraphAggregationType: MultigraphRequestAggregation;
  multiGraphAggregationIgnoreOutlier: boolean
  multiGraphAggregationOutlierPenalty: number
  multiGraphAggregationMinSourcesRatio: number
  multiGraphAggregationMinSourcesCount: number
  multiGraphAggregationMaxResultValueRatio: number
  multiGraphAggregationMaxResultValue: number
  multiGraphAggregationFilterValuesForSourceOrigins: string[]
  multiGraphAggregationInputParameters: {
    [parameterName: string]: {
      inputFactor?: number
      gravitationAttractionStrength?: number
      gravitationPositiveInfluence?: number
    }
  }


  multiGraphSerializationFormat: 'geojson' | 'json' | 'mvt'
  multiGraphSerializationDecimalPrecision: number
  multiGraphSerializationMaxGeometryCount: number

  multiGraphDomainType: 'edge' | 'node' | 'statistic_geometry'
  multiGraphDomainEdgeAggregationType: 'min' | 'max' | 'mean'
  multiGraphDomainStatisticGroupId: number

  multiGraphLayerType: 'identity' | 'tile' | 'hexagon' | 'custom_geometries'
  multiGraphLayerGeometryDetailPerTile: number
  multiGraphLayerMinGeometryDetailLevel: number
  multiGraphLayerMaxGeometryDetailLevel: number
  multiGraphLayerGeometryDetailLevel: number
  multiGraphLayerCustomGeometryMergeAggregation: 'max' | 'mean' | 'min' | 'sum'

  constructor(client: TargomoClient, sources: LatLngId[], options: MultigraphRequestOptions) {
    super(client, sources, <any>options)

    // This request only works if only recognized attributes are sent
    delete this.inactiveSources
    delete this.statisticGroupId
    delete this.statisticIds
    delete this.getClosestSources
    delete this.useCache

    if (options) {

      if (options.multigraph.preAggregationPipeline) {
        this.multiGraphPreAggregationPipeline = options.multigraph.preAggregationPipeline
      }

      if (options.multigraph.referencedStatisticIds) {
        this.multiGraphReferencedStatisticIds = options.multigraph.referencedStatisticIds
      }

      if (options.multigraph.aggregation) {
        this.multiGraphAggregationType = options.multigraph.aggregation.type || null
        this.multiGraphAggregationIgnoreOutlier = options.multigraph.aggregation.ignoreOutliers || null
        this.multiGraphAggregationOutlierPenalty = options.multigraph.aggregation.outlierPenalty || null
        this.multiGraphAggregationMinSourcesRatio = options.multigraph.aggregation.minSourcesRatio || null
        this.multiGraphAggregationMinSourcesCount = options.multigraph.aggregation.minSourcesCount || null
        this.multiGraphAggregationMaxResultValueRatio = options.multigraph.aggregation.maxResultValueRatio || null
        this.multiGraphAggregationMaxResultValue = options.multigraph.aggregation.maxResultValue || null
        this.multiGraphAggregationFilterValuesForSourceOrigins = options.multigraph.aggregation.filterValuesForSourceOrigins || null
        this.multiGraphAggregationInputParameters = options.multigraph.aggregation.aggregationInputParameters || null
      }

      this.multiGraphSerializationFormat = options.multigraph.serialization.format
      this.multiGraphSerializationDecimalPrecision = options.multigraph.serialization.decimalPrecision
      this.multiGraphSerializationMaxGeometryCount = options.multigraph.serialization.maxGeometryCount

      this.multiGraphDomainType = options.multigraph.domain.type
      this.multiGraphDomainEdgeAggregationType = options.multigraph.domain.edgeAggregationType
      this.multiGraphDomainStatisticGroupId = options.multigraph.domain.statisticGroupId

      if (options.multigraph.layer) {
        this.multiGraphLayerType = options.multigraph.layer.type
        this.multiGraphLayerGeometryDetailPerTile = options.multigraph.layer.geometryDetailPerTile
        this.multiGraphLayerMinGeometryDetailLevel = options.multigraph.layer.minGeometryDetailLevel
        this.multiGraphLayerMaxGeometryDetailLevel = options.multigraph.layer.maxGeometryDetailLevel
        this.multiGraphLayerGeometryDetailLevel = options.multigraph.layer.geometryDetailLevel
        this.multiGraphLayerCustomGeometryMergeAggregation = options.multigraph.layer.customGeometryMergeAggregation
      }
    }
  }
}
