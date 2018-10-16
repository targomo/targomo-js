import { TravelRequestOptions, TravelTimeFactors} from '../index'

/**
 * The vehicle routing optimization request body (specification of the fleet planning request).
 */
export interface FpRequestOptions extends TravelRequestOptions {
    /**
    * Specifies the desired maximum run time in seconds this request can use for the optimization.
    * The actual run time can be lower if a solution is found quicker, or exceeded when, for example other parts of the routing request,
    * e.g. routing, parsing, serializing of the request response, take longer.
    * - minimum: 1
    * - default: 1
    * - exclusiveMinimum: false
    */
    optimizationTime?: number;
    /**
    * Specifies which optimization algorithm is to be used. The following options are available:
    * - NO_OPTIMIZATION – no optimization is carried out,
    * i.e. the algorithm will generate a tour for one vehicle per depot without carrying out routing and
    * without trying to fulfil the constraints
    * - GREEDY_TSP – Greedy Algorithm: A route is created,
    * by always travelling to the closest order from the current point of view until all orders have been served.
    * Other constraints such as deadline and weight/volume are not considered.
    * - BRUTE_FORCE_TSP – All delivery order combinations are generated and the one with the least consumed travel time is selected.
    * Only one tour will be created per depot and none of the soft and hard constraints, e.g. deadline, weight/volume, are checked.
    * - CONSTRAINT_SATISFACTION – Powerful Algorithm based on constraint solving that tries to find an optimal solution that meets
    * all the soft/hard constraints and optimizes for the travel time that is used for the routes. This algorithm should preferably be used.
    */
    optimizationAlgorithm: 'NO_OPTIMIZATION' | 'GREEDY_TSP' | 'BRUTE_FORCE_TSP' | 'CONSTRAINT_SATISFACTION';
    /**
    * An optional setting that can be used to define whether the CONSTRAINT_SATISFACTION optimization
    * can be terminated prematurely if no further improvements have been found within the specified amount of time.
    * This makes sense for small queries because the best solution is already found very quickly, and not the full
    * optimizationTime needs to be used up. The value is in seconds.
    * If no value is specified, the optimization is not terminated prematurely.
    */
    unimprovedWaitingTime?: number;
    /**
    * An optional setting that can be used to define how the cost of the connection matrix is calculated.
    * Options are:
    * - AIR_DISTANCE – the connection costs are determined by the air line distance between the two respective addresses
    * - ROUTE_360_TIME – The Route360°-service is used to calculate the cost of
    * connections as travel times between the individual addresses.
    * Using this source is a lot more accurate than using "AIR_DISTANCE"
    * - default: ROUTE_360_TIME
    */
    costMatrixSource?: 'AIR_DISTANCE' | 'ROUTE_360_TIME';
    /**
    * geojsonCreation is an optional setting that can be used to define what Geojson data is created for the
    * individual tours. Available parameters are:
    * - NONE: no Geojson data is generated for the individual tours.
    * - STRAIGHT_LINE: straight lines between the individual stops of a tour are generated.
    * - ROUTE_360: The Route360°-service is used to generate accurate routes to and from the individual stops of the route.
    * - default: STRAIGHT_LINE
    */
    geojsonCreation?: 'NONE' | 'STRAIGHT_LINE' | 'ROUTE_360';

    /**
     * TODO: description
     */
    costForDeadlineExpired?: 'COUNT_INSTANCES' | 'SUM_EXPIRY_TIMES';

    /**
     * TODO: description
     */
    filterMissedDeadlines?: boolean;

}
