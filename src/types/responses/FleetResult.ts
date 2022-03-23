import { FpVehicle, FpStore, FpAddress, FpOrder, FpTransport, FpRequestPayload, FpRequestMetadata } from '..';
import { FeatureCollection, LineString } from 'geojson';

/**
 * @General The reponse of the request if the optimization was successfully carried out. It contains the original request body information
 * (plus potential mitigated values). The result of the fleet planning optimization is stored in "tours" and additional helpful information
 * with regards to the execution (e.g. messages, mitigated errors) are stored in "resultStatus".
 * All elements in the return body (including stores, orders, transports) now have an id field which can be ignored by the client.
 */
export class FpResult implements FpRequestPayload {
    optimizationTime: number;
    optimizationAlgorithm: 'NO_OPTIMIZATION' | 'GREEDY_TSP' | 'BRUTE_FORCE_TSP' | 'CONSTRAINT_SATISFACTION';
    optimizationMetadata: FpRequestMetadata;
    stores: FpStore[];
    transports: FpTransport[];
    orders: FpOrder[];
    /**
     * @General The ResultStatus contains errors that occurred during the evaluation, but could be mitigated by standard routines.
     */
    resultStatus: ResultStatus;
    /**
     * @General The main result of the optimizazion. For the available vehicles/transports tours are created that are optimized for fitting
     * the weight and volume into the respective vehicles, for meeting as many as possible deadlines, and for having the shortest (quickest)
     * overall tour durations (in that order).
     */
    tours: FpTour[];
}

/**
 * @General The ResultStatus contains errors that occurred during the evaluation, but could be mitigated by standard routines.
 * @Exceptions If the optimization request responds with status code 201, there were no errors and the optimization could be performed
 * without any ’intervention/assumptions’.
 * In 'messages' extra information about the time consumption of the individual steps of the optimization can be found.
 * If the server had to make any interventions or assumptions to correct the problem, the response status code of the request is
 * 202 and the mitigations are noted in ResultStatus.
 * The optimization result is transmitted in exactly the same way as with a 201 response, but now with the additional information,
 * which errors have occurred and how they were ’repaired’.
 * Examples of recoverable errors are:
 * If no geo-data was found for an address (i.e. no data was available or could be obtained via the geocoding service)
 * the order is removed from the query, or if no start address were specified for a transport, the home address of the vehicle is
 * assumed to be the starting point. If errors were encountered that could not be "corrected" (e.g., syntax errors, external service
 * errors), the request will fail.
 */
export interface ResultStatus {

    /**
     * @General Overall result of the optimization if successful - NO_ERRORS_RECORDED and result status 201 or
     * ERRORS_RECORDED and result status 202
     */
    overall: 'NO_ERRORS_RECORDED' | 'ERRORS_RECORDED';
    /**
     * @General The problems that occurred during the optimization but could be mitigated.
     * If such Mitigation Errors occur the service reponds with a reuslt und the status code 202.
     */
    errors?: MitigatedError[];
    /**
     * @General Standard messages like how much time different steps of the optimization have consumed.
     */
    messages?: string[];
}

/**
 * @General The problems that occurred during the optimization but could be mitigated.
 * If such Mitigation Errors occur the service reponds with a reuslt und the status code 202.
 */
export interface MitigatedError {
    /**
     * @General The request field that had to be adapted, e.g. "transports[0].metadata.start" if no start address was given for a tranpsort.
     */
    affectedField: string;
    /**
     * @General The detailed the description of the error,
     * e.g. "start point has to be equal to the address of the store referenced in the vehicle"
     */
    errorDescription: string;
    /**
     * @Genral The detailed the description of the error mitigation,
     * e.g. "Start address has been set to the address of the store referenced in the vehicle"
     */
    mitigationDescription: string;
    /**
     * @General If applicable the original value that had to be adapted,
     * e.g. the old address that was replaced as part of the mitigation strategy. Can be empty depending on the error and/or mitigation.
     */
    original: any;
}

/**
 * @General The main result of the optimizazion. For the available vehicles/transports tours are created that are optimized for fitting
 * the load into the respective vehicles, for meeting as many as possible time requirements, and for having the shortest (quickest) overall
 * tour durations (in that order).
 */
export interface FpTour {
    /**
     * @General An estimation of the travel time of the tour in seconds - only the time travelled.
     */
    durationTravel: number;
    /**
     * @General An estimation of the non-travel time of this tour in seconds, e.g. on-site handling.
     */
    durationHandling: number;
    /**
     * @General The expected time and date when the tour will start.
     * Usually equal to the earliestStartDate specified in the transportMetadata.
     * @Format Expressed according to ISO 8601.
     */
    expectedTourStartDate: string;
    /**
     * @General The expected time and date when the tour will end.
     * @Format Expressed according to ISO 8601.
     */
    expectedTourEndDate: string;
    /**
     * @General Length of the tour in meters. This value can only be set if "ROUTING_SERVICE" was chosen for "geojsonCreation".
     */
    routeLength?: number;
    /**
     * @General The sum of any load specified in the orders.
     * @Example
     * ``` js
     * loadSum = {
     *   weight: 123.1,
     *   volume: 2005.0
     * }
     * ```
     */
    loadSum?: {[key: string]: number}
    /**
     * @General Overall number of Orders/TourItems contained in this tour.
     */
    size: number;
    /**
     * @General Total volume of all orders serviced by this tour
     */
    store: FpStore;
    /**
     * @General The vehicle used to travel this tour.
     */
    vehicle: FpVehicle;
    /**
     * @General Each Tour consists of multiple TourItems which each represent the servicing of one of the "orders".
     */
    tourItems: FpTourItem[];
    /**
     * @General The location from which the vehicle starts its tour.
     */
    tourStart: FpAddress;
    /**
     * @General One of the possible endDestinations defined in the TransportMetadata.
     * Can also be empty if no endDestination for this tour's vehicle was defined.
     */
    tourEnd?: FpTourStop;

    /**
     * @General The FeatureCollection element can be optionally returned for debugging purposes. It contains the calculated tour including
     * the routes between the individual targets formatted as GeoJSON. The start and end points of the individual routes are represented as
     * Point and the routes between them as LineString. The data can be uploaded and visualized locally (e.g. with QGIS) or via Internet
     * (e.g. with http://geojson.io). The geojsonCreation option in OptimizationMetadata can be used to specify if and how the geojson data
     * is generated.
     * @Format RFC 7946, https://tools.ietf.org/html/rfc7946
     */
    featureCollection: FeatureCollection<LineString>;
}

/**
 * @General Each Tour consists of multiple TourItems which each represent the servicing of one of the "orders".
 * Note: expectedArrival <= expectedStartVisit < expectedDeparture
 */
export interface FpTourItem {
    /**
     * @General Route distance from the last tour stop to this stop in meters.
     * Distance is only set if "ROUTING_SERVICE" is chosen for "geojsonCreation".
     */
    distance?: number;
    /**
     * @General Time duration it takes from the latest tour stop to this stop in seconds.
     */
    duration: number;
    /**
     * @General Expected arrival date and time for this stop.
     */
    expectedArrival: string;
    /**
     * @General The order which will be serviced.
     */
    order: FpOrder;
    /**
     * @General Ordered index within the tour, e.g. the first element of the tour has index 0, the second has index 1, and so on.
     */
    index: number;
    /**
     * @General Expected departure date and time for this stop.
     * @Format Expressed according to ISO 8601.
     */
    expectedDeparture: string;
    /**
     * @General Expected start of the visit. this can diverge from the expectedArrivalTime due to waiting for the next start of a visiting
     * time window of the associated order. This waiting time is added to the travel costs (excluding the interruptions that occurre
     * during that time).
     * @Format Expressed according to ISO 8601.
     */
    expectedStartVisit: string;
    /**
     * @General Time in seconds that were still to spare from arrival until the deadline.
     * This can be negative if the deadline was missed.
     */
    spareTime: number;

    /**
     * @General If interruptions defined in the vehicle occur during this part (tourItem) of the tour they are contained in this list.
     * An interruption can only be during travel (type=INTERRUPT_TRAVEL) or before the start of the visit (type=INTERRUPT_WAITING).
     */
    interruptions?: {start: string, end: string, type: 'INTERRUPT_TRAVEL' | 'INTERRUPT_WAITING'}[]
}

/**
 * @General One of the possible endDestinations defined in the TransportMetadata.
 * Can also be empty if no endDestination for this tour's vehicle was defined.
 */
export interface FpTourStop {
    /**
     * @General Route distance from the last tour stop to this stop in meters.
     * Distance is only set if "ROUTING_SERVICE was" chosen for "geojsonCreation".
     */
    distance?: number;
    /**
     * @General Time duration it takes from the latest tour stop to this stop in seconds.
     */
    duration: number;
    /**
     * @General Expected arrival date and time for this stop.
     * @Format Expressed according to ISO 8601.
     */
    expectedArrival: string;
    /**
     * The address of the chosen endDestination as defined in the transportMetadata.
     */
    order: FpOrder;
}
