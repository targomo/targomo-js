import { BaseRequestOptions } from '../requestOptions'
import { TravelType } from '../types'

/**
 * @General The vehicle routing optimization request body (specification of the fleet planning request).
 */
export interface FpRequestOptions extends BaseRequestOptions {
  // ! TravelType is temporary, until vehicle gets its own travel mode object.
  // TravelType type is not used, as transit is not supported.

  /**
   * @General This field defines what travel type is used for Targomo Time Service
   * (or Routing Service if geojsonCreation = ROUTING_SERVICE).
   */
  travelType: TravelType

  /**
   * @General Specifies the desired maximum run time in seconds this request can use for the optimization.
   * The actual run time can be lower if a solution is found quicker, or exceeded when, for example other parts of the routing request,
   * e.g. routing, parsing, serializing of the request response, take longer.
   * @Min `1` (Not exclusive)
   * @Max Varies depending on your API plan
   * @Default `1`
   */
  optimizationTime?: number
  /**
   * @General Specifies which optimization algorithm is to be used.
   * @Performance
   * - NO_OPTIMIZATION – no optimization is carried out,
   * i.e. the algorithm will generate a tour for one vehicle per depot without carrying out routing and
   * without trying to fulfil the constraints
   * - GREEDY_TSP – Greedy Algorithm: A route is created,
   * by always travelling to the closest order from the current point of view until all orders have been served.
   * Other constraints such as deadline and weight/volume are not considered.
   * - BRUTE_FORCE_TSP – All delivery order combinations are generated and the one with the least consumed travel time is selected.
   * Only one tour will be created per depot and none of the soft and hard constraints, e.g. deadline, weight/volume, are checked.
   * - CONSTRAINT_SATISFACTION – Powerful Algorithm based on constraint solving that tries to find an optimal solution that meets
   * all the soft/hard constraints and optimizes for the travel time that is used for the routes.
   * This algorithm should preferably be used.
   */
  optimizationAlgorithm: 'NO_OPTIMIZATION' | 'GREEDY_TSP' | 'BRUTE_FORCE_TSP' | 'CONSTRAINT_SATISFACTION'
  /**
   * @General A setting that can be used to define how the cost of the connection matrix is calculated.
   * The value will be ignored for the NO_OPTIMIZATION optimization algorithm.
   * - AIR_DISTANCE – the connection costs are determined by the air line distance between the two respective addresses
   * - TRAVEL_COST_SERVICE – The Targomo service is used to calculate the cost of connections as travel times between the
   * individual addresses. Using this source is a lot more accurate than using "AIR_DISTANCE"
   * @Default `TRAVEL_COST_SERVICE`
   */
  costMatrixSource?: 'AIR_DISTANCE' | 'TRAVEL_COST_SERVICE'
  /**
   * @General geojsonCreation is an optional setting that can be used to define what Geojson data is created for the
   * - NONE: no Geojson data is generated for the individual tours.
   * - STRAIGHT_LINE: straight lines between the individual stops of a tour are generated.
   * - ROUTING_SERVICE: The Targomo service is used to generate accurate routes to and from the individual stops of the route.
   * When this value is selected it will also add all missing information with regards to time, distance,
   * arrival, etc. into the Tour and TourItems that have not yet been set during the optimization.
   * @Default `STRAIGHT_LINE`
   */
  geojsonCreation?: 'NONE' | 'STRAIGHT_LINE' | 'ROUTING_SERVICE'
  /**
   * @General A setting that can be used to define whether the CONSTRAINT_SATISFACTION optimization
   * can be terminated prematurely if no further improvements have been found within the specified amount of time.
   * This makes sense for small queries because the best solution is already found very quickly, and not the full
   * optimizationTime needs to be used up.
   * @Min Greater than 0.
   * @Format Time in seconds.
   * @Default If no value is specified, the optimization is not terminated prematurely.
   */
  unimprovedWaitingTime?: number
  /**
   * @General filterOrdersWithMissedDeadline is an optional parameter that can be used to specify that the CONSTRAINT_SATISFACTION
   * optimization removes orders where the deadlines will have been exceeded according to the optimization result.
   * When enabled, the optimization will still try to maximize the amount of orders it can service within the deadline, however,
   * not serviced orders will be filtered out. This can make sense if you expect that orders can be serviced by vehicles of a later
   * optimization run (with transports that were not yet available at the first run).
   * @Performance Enabling this option can lead to orders never being part of a tour if the deadline has already been passed.
   * @Default `false`, i.e. no orders are removed due to a missed deadline.
   */
  filterOrdersWithMissedDeadline?: boolean
  /**
   * @General filterOrdersOutsideOfValidWorkingHours is an optional parameter that can be used to specify that the CONSTRAINT_SATISFACTION
   * optimization removes orders that did not fit into the valid working hours (from earliestDepartureTime until latestArrivalTime)
   * of the transports/vehicles according to the optimization result.
   * When enabled, the optimization will still try to maximize the amount of orders it can service within the working hours of the
   * transports, however, orders not serviced within the valid working hours will be filtered out.
   * This can make sense if you expect that orders can be serviced by vehicles of a later optimization run
   * (with transports that were not yet available at the first run).
   * @Performance Enabling this option can lead to orders never being part of a tour if the latestArrivalTime of all
   * transports is set too early.
   * @Default `false`, i.e. no orders are removed due to not fitting into the working hours of the transports.
   */
  filterOrdersOutsideOfValidWorkingHours?: boolean
  /*
   * @General This is an optional date parameter of the CONSTRAINT_SATISFACTION optimization to define that orders with a particularly
   * close deadline cannot be filtered out any more, i.e. they will have to be serviced even if the deadline cannot be met.
   * This is to avoid that "starved" orders with a close or already missed deadline can still be serviced.
   * This value only applies when filterOrdersWithMissedDeadline or filterOrdersOutsideOfValidWorkingHours are set.
   * @Default If not specified no orders will be prohibited from being filtered out.
   */
  prohibitFilteringOfOrdersWithDeadlinesEarlierEqualsThan?: string
  /**
   * @General secondsToPenaltyRatioForDeadlineMissed is an optional configuration parameter, with which it can be specified, how
   * many seconds (rounded up) constitute a penalty point for missing the deadline when using the CONSTRAINT_SATISFACTION optimization.
   * @Format Time in seconds.
   * @Example
   * `secondsToPenaltyRatioForDeadlineMissed = 60;`
   * (1) Every order with no missed deadline will not cause a penalty;
   * (2) a deadline that was missed by one second constitutes one penalty point;
   * (3) a deadline that was missed by 123 seconds causes 3 penalty points.
   * @Min Greater than 0.
   * @Default If secondsToPenaltyRatioForDeadlineMissed set to `null` (which is also the default value if nothing was specified),
   * that means that every missed deadline counts for exactly one penalty point regardless of the time passed between the deadline and
   * the expected delivery.
   */
  secondsToPenaltyRatioForDeadlineMissed?: number
  /**
   * @General secondsToPenaltyRatioForOutOfWorkingHours is an optional configuration parameter, with which it can be specified, how
   * many seconds (rounded up) constitute a penalty point for missing the working hours using the CONSTRAINT_SATISFACTION optimization.
   * @Format Time in seconds.
   * @Example
   * `secondsToPenaltyRatioForOutOfWorkingHours = 600;`
   * (1) Every planned tour that stays within the working hours of a transport (i.e. tour is finished before latestArrivalTime)
   * will not cause a penalty;
   * (2) If a tour has missed the latestArrivalTime by one second that constitutes one penalty point;
   * (3) If a tour has missed the latestArrivalTime by 31 minutes that causes 4 penalty points.
   * @Default If secondsToPenaltyRatioForOutOfWorkingHours set to `null` (which is also the default value if nothing was specified),
   * that means that every tour that exceeds its working hours counts for exactly one penalty point regardless of the time passed between
   * the lastArrivalTime and the planned tour end.
   */
  secondsToPenaltyRatioForOutOfWorkingHours?: number

  /**
   * @General This is an optional parameter that can be set to activate a balanced CONSTRAINT_SATISFACTION optimization.
   * Basically, the penalty accumulated for missed time constraints (e.g. deadlines or valid working hours) is multiplied by the specified
   * factor and merged (/added to) the travel time costs. This allows for a balancing between optimizing the travel costs and meeting time
   * constraints.
   * @Example For instance, with this value set to 600 it means that missing a deadline is worth 600 seconds (=10 minutes) of travel
   * costs.
   *
   * The deadline penalties can also be modified directly (e.g. with secondsToPenaltyRatioForDeadlineMissed) in which case the
   * interpretation changes accordingly:
   * for secondsToPenaltyRatioForDeadlineMissed = 60 and timeConstraintPenaltyToTravelCostRatio = 120
   * each minute by which a deadline is missed is worth two minutes of improved travel costs - in other words:
   * if a tour combination is found that improves the travel costs by over two minutes we accept that a deadline is missed by one more
   * minute.
   * @Performance Warning: If set too low (in combination with filterOrdersWithMissedDeadline or filterOrdersOutsideOfValidWorkingHours)
   * the optimization might be motivated to create badly optimized tours so that deadlines are deliberately missed since the overall route
   * will be shorter if they are missed. If deadlines are of no or little importance they should rather not be used.
   * @Min A sensible value should have at least three digits.
   * @Default `null`
   */
  timeConstraintPenaltyToTravelCostRatio?: number

  /**
   * @General longestTourPenaltyFactor is an optional parameter to create tours that have a balanced work load for each transport/vehicle.
   * A value of 1.0 (default is 0.0) means that the longest tour is counted twice for the travel time penalty.
   * @Performance Warning: This parameter has to be used with caution since it creates local minima from which the optimization may not
   * progress.
   * @Default `0`
   */
  longestTourPenaltyFactor?: number

  /**
   * @General nonParallelOrdersByTags is an optional parameter that restricts the planning in a way that some orders are not allowed to be
   * serviced in parallel when they have the same values for the specified tags. Setting this value makes sense if some orders share the
   * same external resource which would have to be present at both locations. For instance, if two orders have the same tag
   * "facility manager":"Max Mustermann" in their tags map and the nonParallelOrdersByTags was defined as ["facility manager"]
   * that means that those two orders cannot be serviced in parallel since for both visits the facility manager Max Mustermann has to be
   * present and he cannot be at two places at the same time.
   * @Default `[]`
   */
  nonParallelOrdersByTags?: string[]

  /**
   * @General Enable the rush hour mode to simulate a more crowded street. Warning this is a paid feature so not
   * all plans are allowed to enable it.
   * @Default `false`
   */
  rushHour?: boolean
}
