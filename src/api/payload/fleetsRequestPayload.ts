import { FpTransport, TravelTimeFactors, TravelType, EdgeWeightType} from '../../types';
import { FpStore, FpOrder } from '../..';

export interface FpRequestMetadata {
  costMatrixSource: string;
  geojsonCreation: string;
  unimprovedWaitingTime: number;
  filterOrdersWithMissedDeadline: boolean;
  filterOrdersOutsideOfValidWorkingHours: boolean;
  prohibitFilteringOfOrdersWithDeadlinesEarlierEqualsThan: string;
  secondsToPenaltyRatioForDeadlineMissed: number;
  secondsToPenaltyRatioForOutOfWorkingHours: number;
  timeConstraintPenaltyToTravelCostRatio: number;
  longestTourPenaltyFactor: number;
  nonParallelOrdersByTags: string[];
  travelOptions: {
    travelType: TravelType,
    serviceKey: string,
    serviceUrl: string,
    travelTimeFactors: TravelTimeFactors,
    fallbackServiceUrl: string,
    edgeWeight: EdgeWeightType,
    maxEdgeWeight: number,
    elevation: boolean,
    rushHour: boolean
  }
}

export interface FpRequestPayload {
  optimizationTime: number;
  optimizationAlgorithm: 'NO_OPTIMIZATION' | 'GREEDY_TSP' | 'BRUTE_FORCE_TSP' | 'CONSTRAINT_SATISFACTION';
  optimizationMetadata: FpRequestMetadata;
  stores: FpStore[];
  transports: FpTransport[];
  orders: FpOrder[];
}
