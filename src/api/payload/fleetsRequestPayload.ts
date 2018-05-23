import { FleetRequestOptions } from './../../types/options/fleetRequestOptions';
import { Transport} from '../../types';
import { TargomoClient } from '../targomoClient';
import { Store, Order } from '../..';



export class FleetsRequestPayload {

  optimizationTime: number;
  optimizationAlgorithm: 'NO_OPTIMIZATION' | 'GREEDY_TSP' | 'BRUTE_FORCE_TSP' | 'CONSTRAINT_SATISFACTION';
  optimizationMetadata: any;
  stores: Store[] = [];
  transports: Transport[] = [];
  orders: Order[] = [];

  constructor(client: TargomoClient, options: FleetRequestOptions, stores: Store[], transports: Transport[], orders: Order[]) {

    this.optimizationTime = options.optimizationTime;
    this.optimizationAlgorithm = options.optimizationAlgorithm;
    this.optimizationMetadata = {
      unimprovedWaitingTime: options.unimprovedWaitingTime,
      costMatrixSource: options.costMatrixSource,
      geojsonCreation: options.geojsonCreation,
      travelOptions: {
        travelType: options.travelType,
        serviceKey: client.serviceKey,
        serviceUrl: client.serviceUrl,
        fallbackServiceUrl: '',
        edgeWeight: options.edgeWeight,
        maxEdgeWeight: options.maxEdgeWeight,
        elevationEnabled: options.elevation,
        rushHour: options.rushHour
      }
    }
    this.stores = stores;
    this.transports = transports;
    this.orders = orders;
  }

}
