import { StatisticsRequestPayload } from './statisticsRequestPayload';
import { LatLngId, MultigraphRequestOptions} from '../../types';
import { TargomoClient } from '../targomoClient';

export class MultigraphRequestPayload extends StatisticsRequestPayload {
  multiGraphSerializationType: string
  multiGraphSerializationDecimalPrecision: number
  multiGraphAggregationType: string
  multiGraphAggregationIgnoreOutlier: boolean
  multiGraphAggregationMinSourcesRatio: number
  multiGraphAggregationMinSourcesCount: number
  multiGraphAggregationMaxResultValueRatio: number
  multiGraphAggregationMaxResultValue: number

  constructor(client: TargomoClient, sources: LatLngId[], options: MultigraphRequestOptions) {
    super(client, sources, <any>options)

    // This request only works if only recognized attributes are sent
    delete this.inactiveSources
    delete this.statisticGroupId
    delete this.statisticIds
    delete this.getClosestSources
    delete this.useCache

    if (options) {
      this.multiGraphSerializationType = options.serialization && options.serialization.type
      this.multiGraphSerializationDecimalPrecision = options.serialization && options.serialization.decimalPrecision
      if (options.aggregation) {
        this.multiGraphAggregationType = options.aggregation.type || null
        this.multiGraphAggregationIgnoreOutlier = options.aggregation.ignoreOutliers || null
        this.multiGraphAggregationMinSourcesRatio = options.aggregation.minSourcesRatio || null
        this.multiGraphAggregationMinSourcesCount = options.aggregation.minSourceCount || null
        this.multiGraphAggregationMaxResultValueRatio = options.aggregation.maxResultValueRatio || null
        this.multiGraphAggregationMaxResultValue = options.aggregation.maxResultValue || null
      }
    }
  }
}
