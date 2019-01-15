import { StatisticsRequestPayload } from './statisticsRequestPayload';
import { LatLngId, MultigraphRequestOptions, MultigraphRequestAggregation} from '../../types';
import { TargomoClient } from '../targomoClient';

export class StatefulMultigraphRequestPayload extends StatisticsRequestPayload {
  multiGraphSerializationType: 'geojson' | 'json' | 'mvt';
  multiGraphSerializationDecimalPrecision: number;
  multiGraphSerializationMaxGeometryCount: number;

  /**
   * not yet supported in the stateful version
  multiGraphLayerType: 'edge' | 'node' | 'tile' | 'tile_node' | 'hexagon' | 'hexagon_node';
  multiGraphLayerEdgeAggregationType: 'min' | 'max' | 'mean';
  multiGraphLayerGeometryDetailPerTile: number;
  multiGraphLayerMinGeometryDetailLevel: number;
  multiGraphLayerMaxGeometryDetailLevel: number;
  */
  multiGraphAggregationType: MultigraphRequestAggregation;
  multiGraphAggregationIgnoreOutlier: boolean;
  multiGraphAggregationMinSourcesRatio: number;
  multiGraphAggregationMinSourcesCount: number;
  multiGraphAggregationMaxResultValueRatio: number;
  multiGraphAggregationMaxResultValue: number;

  constructor(client: TargomoClient, sources: LatLngId[], options: MultigraphRequestOptions) {
    super(client, sources, <any>options)

    // This request only works if only recognized attributes are sent
    delete this.inactiveSources
    delete this.statisticGroupId
    delete this.statisticIds
    delete this.getClosestSources
    delete this.useCache

    if (options) {
      this.multiGraphSerializationType = options.multigraph.serialization.format
      this.multiGraphSerializationDecimalPrecision = options.multigraph.serialization.decimalPrecision
      /**
       * not yet supported in the stateful version
      if (options.layer) {
        this.multiGraphLayerType = options.layer.type
        this.multiGraphLayerEdgeAggregationType = options.layer.edgeAggregationType
        this.multiGraphLayerGeometryDetailPerTile = options.layer.geometryDetailPerTile
        this.multiGraphLayerMinGeometryDetailLevel = options.layer.minGeometryDetailLevel
        this.multiGraphLayerMaxGeometryDetailLevel = options.layer.maxGeometryDetailLevel
      }
      */
      if (options.multigraph.aggregation) {
        this.multiGraphAggregationType = options.multigraph.aggregation.type || null
        this.multiGraphAggregationIgnoreOutlier = options.multigraph.aggregation.ignoreOutliers || null
        this.multiGraphAggregationMinSourcesRatio = options.multigraph.aggregation.minSourcesRatio || null
        this.multiGraphAggregationMinSourcesCount = options.multigraph.aggregation.minSourcesCount || null
        this.multiGraphAggregationMaxResultValueRatio = options.multigraph.aggregation.maxResultValueRatio || null
        this.multiGraphAggregationMaxResultValue = options.multigraph.aggregation.maxResultValue || null
      }
    }
  }
}
