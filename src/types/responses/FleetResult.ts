import { Vehicle, Store, Address, Order } from './../types';
import { FeatureCollection, LineString } from 'geojson';

/**
 * Fleetplanner result
 * @param {ResultStatus} resultStatus Information about the results.
 * @param {Tour[]} tours The tours computed by the service, one tour object per vehicle.
 */
export interface FleetResult {
    resultStatus: ResultStatus;
    tours: Tour[];
}

/**
 * The ResultStatus contains errors that occurred during the evaluation, but could be mitigated by standard routines.
 * If no geo-data was found for an address
 * (i.e. no data was available or could be obtained via the geocoding service) the order is removed from the query,
 * or if no start address were specified for a transport, the home address of the vehicle is assumed to be the starting point.
 * If errors were encountered that could not be "corrected" (e.g., syntax errors, external service errors), the request will fail.
 * @param {MitigatedError[]} errors The problems that occurred during the optimization but could be mitigated.
 * @param {string[]} messages Standard messages like how much time different steps of the optimization have consumed.
 */
export interface ResultStatus {
    errors: MitigatedError[];
    messages: string[];
}

/**
 * MitigatedError
 * @param {string} affectedField The request field that had to be adapted,
 * e.g. "transports[0].metadata.start" if no start address was given for a tranpsort.
 * @param {string} errorDescription The detailed the description of the error,
 * e.g. "start point has to be equal to the address of the store referenced in the vehicle"
 * @param {string} mitigationDescription The detailed the description of the error mitigation,
 * e.g. "Start address has been set to the address of the store referenced in the vehicle"
 */
export interface MitigatedError {
    affectedField: string;
    errorDescription: string;
    mitigationDescription: string;
}

/**
 * The main result of the optimizazion.
 * For the available vehicles/transports tours are created that are optimized for
 * fitting the weight and volume into the respective vehicles,
 * for meeting as many as possible deadlines, and for having the shortest (quickest) overall tour durations (in that order).
 * @param {FeatureCollection} featureCollection A GeoJSON object which contains the route for this specific tour.
 * @param {number} durationTravel An estimation of the travel time of the tour in seconds - only the time travelled.
 * @param {number} durationHandling An estimation of the non-travel time of this tour in seconds, e.g. on-site handling.
 * @param {string} expectedTourStartDate The expected time and date when the tour will start. Expressed according to ISO 8601.
 * Usually equal to the earliestStartDate specified in the transportMetadata.
 * @param {string} expectedTourEndDate The expected time and date when the tour wil end. Expressed according to ISO 8601.
 * @param {number} routeLength Length of the tour in meters. This value can only be set if "ROUTE_360 was" chosen for "geojsonCreation".
 * @param {number} size Overall number of Orders/TourItems contained in this tour.
 * @param {number} sumVolume Total volume of all orders serviced by this tour
 * @param {number} sumWeight Total weight of all orders serviced by this tour.
 * @param {Store} store The store where the vehicle loads and from which it sets out to travel to the orders within this tour.
 * @param {Vehicle} vehicle The vehicle used to travel this tour.
 * @param {TourItem[]} tourItems Each Tour consists of multiple TourItems which each represent the servicing of one of the "orders".
 * @param {Address} tourStart The location from which the vehicle starts its tour.
 * This location needs to be the same as the location of the store referenced in "vehicle".
 * @param {TourStop} tourEnd One of the possible endDestinations defined in the TransportMetadata.
 * Can also be empty if no endDestination for this tour's vehicle was defined.
 */
export interface Tour {
    durationTravel: number;
    durationHandling: number;
    expectedTourStartDate: string;
    expectedTourEndDate: string;
    routeLength?: number;
    featureCollection: FeatureCollection<LineString>;
    size: number;
    sumVolume: number;
    sumWeight: number;
    store: Store;
    vehicle: Vehicle;
    tourItems: TourItem[];
    tourStart: Address;
    tourEnd?: TourStop;

}

/**
 * Each Tour consists of multiple TourItems which each represent the servicing of one of the "orders".
 * @param {number} distance Route distance from the last tour stop to this stop in meters.
 * Distance is only set if "ROUTE_360" is chosen for "geojsonCreation".
 * @param {number} duration Time duration it takes from the latest tour stop to this stop in seconds.
 * @param {string} expectedArrival Expected arrival date and time for this stop.
 * @param {Order} order The order which will be serviced.
 * @param {number} index Ordered index within the tour, e.g. the first element of the tour has index 0, the second has index 1, and so on.
 * @param {string} expectedDeparture Expected departure date and time for this stop. Expressed according to ISO 8601.
 * @param {number} spareTime Time in seconds that were still to spare from arrival until the deadline.
 * This can be negative if the deadline was missed.
 */
export interface TourItem {
    distance?: number;
    duration: number;
    expectedArrival: string;
    order: Order;
    index: number;
    expectedDeparture: string;
    spareTime: number;
}

/**
 * One of the possible endDestinations defined in the TransportMetadata.
 * Can also be empty if no endDestination for this tour's vehicle was defined.
 * @param {number} distance Route distance from the last tour stop to this stop in meters.
 * Distance is only set if "ROUTE_360 was" chosen for "geojsonCreation".
 * @param {number} duration Time duration it takes from the latest tour stop to this stop in seconds.
 * @param {string} expectedArrival Expected arrival date and time for this stop. Expressed according to ISO 8601.
 * @param {Order} order The address of the chosen endDestination as defined in the transportMetadata.
 * (Only the "address" field within the order contains data)
 */
export interface TourStop {
    distance?: number;
    duration: number;
    expectedArrival: string;
    order: Order;
}
