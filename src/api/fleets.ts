import { 
    FpResult, FpRequestOptions, FpTransport, 
    FpRequestPayload, FpStore, FpOrder 
} from './../types';
import { TargomoClient } from './targomoClient'
import { requests, UrlUtil } from '../util';


/**
 * @Topic Fleetplanner
 * @General This is the entry point for the Fleetplanner service.
 * The Fleetplanner service enables the configurable calculation of
 * efficient routing for multi-vehicle, multi-destination delivery scenarios.
 *
 * This service solves the Vehicle Routing Problem(VRP) which is similar to the traveling salesman problem. The difference between the two
 * problems, is that the VRP concerns multiple vehicles; a fleet of vehicles.
 * The VRP is about finding the optimal combination of routes for all of the vehicles.
 *
 * The VRP can be extended with additional factors that make the problem more complex. For example, deadlines can
 * be introduced. Every location has a deadline. In an optimal scenario, all the deadlines should be met. However, it is
 * not always possible to meet all deadlines with the number of vehicles that are available. In that case, the goal of the
 * VRP is to either meet as many deadlines, or to optimize the total sum of expired deadline times.
 *
 * Another way the VRP can be extended is by introducing weight and volumes to the orders that need to be delivered and having
 * vehicles with a maximum load weight and volume capacity.
 *
 * More in-depth/detailed information about the Fleetplanner service can be found at https://docs.targomo.com/fleetplanner/
*/
export class FleetsClient {
  constructor(private client: TargomoClient) {
  }

  /**
   * @General Start a new request to compute optimized routes with the provided information.
   * @Performance Depending on the options, the execution time of this call can vary significantly.
   * This function makes a http POST request to the Targomo REST service for the Fleetplanner.
   * Every call to this function will be recorded based on your API key.
   * All your usage statistics are accessible on https://account.targomo.com/statistics.
   * @Exceptions This function can return the same exceptions as described on https://docs.targomo.com/fleetplanner/
   * @Example
   * ``` js
   * const stores = [{ uuid: '1', address: { lat: 52.474257, lng: 13.378094 } }];
   * const orders = [{ storeUuid: '1', address: { lat: 52.4, lng: 13.4 } },
   *                 { storeUuid: '1', address: { lat: 52.6, lng: 13.6 } },
   *                 { storeUuid: '1', address: { lat: 52.6, lng: 13.3 } }];
   * const transports = [{ vehicle: { storeUuid: '1', maxVolume: 100, maxWeight: 100 } }];
   * const options = { optimizationAlgorithm: 'CONSTRAINT_SATISFACTION', maxEdgeWeight: 3000, travelType: 'car' }
   * targomoClient.fleets.fetch(stores, orders, transports, options).then(result => {
   *     console.log(result.tours);
   * });
   * ```
   *
   * @Param stores
   * The stores, or otherwise called 'depots' from which their respective vehicles start their routes.
   * A store has a relation with zero or more orders, and zero or more vehicles.
   * @Param orders
   * The orders that need to be serviced by a vehicle from the store which is concerns this order.
   * An order has a relation with one store.
   * ##### Performance
   * The amount of orders has a significant on the time it takes to optimize the routes.
   * When using the default settings for optimizationTime and unimprovedWaitingTime in combination with more than 100 orders,
   * you can expect the results to be less optimized.
   * In this case, the algorithm doesn't have enough time to completely finish the optimization for this amount of orders.
   * Raise the optimizationTime option when sending a request with a high amount of orders.
   * @Param transports
   * The transports (vehicles). Each of which are assigned to a certain store.
   * @Param options
   * ##### Performance
   * Various different options within this options object can have a significant noticable impact on the request duration.
   */
  async fetch(stores: FpStore[], orders: FpOrder[], transports: FpTransport[], options: FpRequestOptions): Promise<FpResult> {

    const url = new UrlUtil.TargomoUrl(this.client)
      .host(this.client.config.fleetsUrl)
      .version()
      .part('/api/key-auth/optimizations')
      .key()
      .toString();

    const cfg = this._createPayload(this.client, stores, orders, transports, options);

    const result = await requests(this.client, options).fetch(url, 'POST', cfg);

    return result;
  }


  private _createPayload(
    client: TargomoClient,
    stores: FpStore[],
    orders: FpOrder[],
    transports: FpTransport[],
    options: FpRequestOptions) {
    const payload: FpRequestPayload = {
      optimizationTime: options.optimizationTime,
      optimizationAlgorithm: options.optimizationAlgorithm,
      optimizationMetadata: {
        costMatrixSource: options.costMatrixSource,
        geojsonCreation: options.geojsonCreation,
        unimprovedWaitingTime: options.unimprovedWaitingTime,
        filterOrdersWithMissedDeadline: options.filterOrdersWithMissedDeadline,
        filterOrdersOutsideOfValidWorkingHours: options.filterOrdersOutsideOfValidWorkingHours,
        prohibitFilteringOfOrdersWithDeadlinesEarlierEqualsThan: options.prohibitFilteringOfOrdersWithDeadlinesEarlierEqualsThan,
        secondsToPenaltyRatioForDeadlineMissed: options.secondsToPenaltyRatioForDeadlineMissed,
        secondsToPenaltyRatioForOutOfWorkingHours: options.secondsToPenaltyRatioForOutOfWorkingHours,
        timeConstraintPenaltyToTravelCostRatio: options.timeConstraintPenaltyToTravelCostRatio,
        longestTourPenaltyFactor: options.longestTourPenaltyFactor,
        nonParallelOrdersByTags: options.nonParallelOrdersByTags,
        travelOptions: {
          travelType: options.travelType,
          serviceKey: client.serviceKey,
          serviceUrl: client.serviceUrl,
          travelTimeFactors: options.travelTimeFactors,
          fallbackServiceUrl: '',
          edgeWeight: options.edgeWeight,
          maxEdgeWeight: options.maxEdgeWeight,
          elevation: options.elevation,
          rushHour: options.rushHour
        }
      },
      stores: stores,
      transports: transports,
      orders: orders
    }
    return payload;
  }
}
