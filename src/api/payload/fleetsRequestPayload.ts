import { FpRequestOptions } from './../../types/options/fleetRequestOptions';
import { FpTransport} from '../../types';
import { TargomoClient } from '../targomoClient';
import { FpStore, FpOrder } from '../..';



export class FpRequestPayload {

  optimizationTime: number;
  optimizationAlgorithm: 'NO_OPTIMIZATION' | 'GREEDY_TSP' | 'BRUTE_FORCE_TSP' | 'CONSTRAINT_SATISFACTION';
  optimizationMetadata: any;
  stores: FpStore[] = [];
  transports: FpTransport[] = [];
  orders: FpOrder[] = [];

  constructor(client: TargomoClient, options: FpRequestOptions, stores: FpStore[], transports: FpTransport[], orders: FpOrder[]) {

    let travelTimeFactors: any;
    if (options.travelTimeFactors) {
      travelTimeFactors = {
        all: options.travelTimeFactors.all,
        motorway: options.travelTimeFactors.motorway,
        motorway_link: options.travelTimeFactors.motorway_link,
        trunk: options.travelTimeFactors.trunk,
        trunk_link: options.travelTimeFactors.trunk_link,
        primary: options.travelTimeFactors.primary,
        primary_link: options.travelTimeFactors.primary_link,
        secondary: options.travelTimeFactors.secondary,
        secondary_link: options.travelTimeFactors.secondary_link,
        tertiary: options.travelTimeFactors.tertiary,
        residential: options.travelTimeFactors.residential,
        tertiary_link: options.travelTimeFactors.tertiary_link,
        road: options.travelTimeFactors.road,
        unclassified: options.travelTimeFactors.unclassified,
        service: options.travelTimeFactors.service,
        living_street: options.travelTimeFactors.living_street,
        pedestrian: options.travelTimeFactors.pedestrian,
        track: options.travelTimeFactors.track,
        path: options.travelTimeFactors.path,
        cycleway: options.travelTimeFactors.cycleway,
        footway: options.travelTimeFactors.footway,
        steps: options.travelTimeFactors.steps,
        unknown: options.travelTimeFactors.unknown
      }
    }

    this.optimizationTime = options.optimizationTime;
    this.optimizationAlgorithm = options.optimizationAlgorithm;
    this.optimizationMetadata = {
      costForDeadlineExpired: options.costForDeadlineExpired,
      filterMissedDeadlines: options.filterMissedDeadlines,
      unimprovedWaitingTime: options.unimprovedWaitingTime,
      costMatrixSource: options.costMatrixSource,
      geojsonCreation: options.geojsonCreation,
      travelOptions: {
        travelType: options.travelType,
        serviceKey: client.serviceKey,
        serviceUrl: client.serviceUrl,
        travelTimeFactors: travelTimeFactors,
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
