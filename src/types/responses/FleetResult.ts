import { Vehicle, Store, Address, Order } from './../types';
import { FeatureCollection, LineString } from 'geojson';

/**
 * Fleetplanner result
 */
export interface FleetResult {
    /**
     * Information about the results.
     */
    resultStatus: ResultStatus;
    /**
     * The tours computed by the service, one tour object per vehicle.
     */
    tours: Tour[];
}

/**
 * The ResultStatus contains errors that occurred during the evaluation, but could be mitigated by standard routines.
 * If no geo-data was found for an address
 * (i.e. no data was available or could be obtained via the geocoding service) the order is removed from the query,
 * or if no start address were specified for a transport, the home address of the vehicle is assumed to be the starting point.
 * If errors were encountered that could not be "corrected" (e.g., syntax errors, external service errors), the request will fail.
 */
export interface ResultStatus {
    /**
     * The problems that occurred during the optimization but could be mitigated.
     */
    errors: MitigatedError[];
    /**
     * Standard messages like how much time different steps of the optimization have consumed.
     */
    messages: string[];
}

export interface MitigatedError {
    /**
     * The request field that had to be adapted,
    * e.g. "transports[0].metadata.start" if no start address was given for a tranpsort.
     */
    affectedField: string;
    /**
     * The detailed the description of the error,
     * e.g. "start point has to be equal to the address of the store referenced in the vehicle"
     */
    errorDescription: string;
    /**
     * The detailed the description of the error mitigation,
     * e.g. "Start address has been set to the address of the store referenced in the vehicle"
     */
    mitigationDescription: string;
}

/**
 * The main result of the optimizazion.
 * For the available vehicles/transports tours are created that are optimized for
 * fitting the weight and volume into the respective vehicles,
 * for meeting as many as possible deadlines, and for having the shortest (quickest) overall tour durations (in that order).
 */
export interface Tour {
    /**
     * An estimation of the travel time of the tour in seconds - only the time travelled.
     */
    durationTravel: number;
    /**
     * An estimation of the non-travel time of this tour in seconds, e.g. on-site handling.
     */
    durationHandling: number;
    /**
     * The expected time and date when the tour will start. Expressed according to ISO 8601.
     * Usually equal to the earliestStartDate specified in the transportMetadata.
     */
    expectedTourStartDate: string;
    /**
     * The expected time and date when the tour wil end. Expressed according to ISO 8601.
     */
    expectedTourEndDate: string;
    /**
     * Length of the tour in meters. This value can only be set if "ROUTE_360 was" chosen for "geojsonCreation".
     */
    routeLength?: number;
    /**
     * A GeoJSON object which contains the route for this specific tour.
     */
    featureCollection: FeatureCollection<LineString>;
    /**
     * Overall number of Orders/TourItems contained in this tour.
     */
    size: number;
    /**
     * Total volume of all orders serviced by this tour
     */
    sumVolume: number;
    /**
     * Total weight of all orders serviced by this tour.
     */
    sumWeight: number;
    /**
     * The store where the vehicle loads and from which it sets out to travel to the orders within this tour.
     */
    store: Store;
    /**
     * The vehicle used to travel this tour.
     */
    vehicle: Vehicle;
    /**
     * Each Tour consists of multiple TourItems which each represent the servicing of one of the "orders".
     */
    tourItems: TourItem[];
    /**
     * The location from which the vehicle starts its tour.
     * This location needs to be the same as the location of the store referenced in "vehicle".
     */
    tourStart: Address;
    /**
     * One of the possible endDestinations defined in the TransportMetadata.
     * Can also be empty if no endDestination for this tour's vehicle was defined.
     */
    tourEnd?: TourStop;

}

/**
 * Each Tour consists of multiple TourItems which each represent the servicing of one of the "orders".
 */
export interface TourItem {
    /**
     * Route distance from the last tour stop to this stop in meters.
     * Distance is only set if "ROUTE_360" is chosen for "geojsonCreation".
     */
    distance?: number;
    /**
     * Time duration it takes from the latest tour stop to this stop in seconds.
     */
    duration: number;
    /**
     * Expected arrival date and time for this stop.
     */
    expectedArrival: string;
    /**
     * The order which will be serviced.
     */
    order: Order;
    /**
     * Ordered index within the tour, e.g. the first element of the tour has index 0, the second has index 1, and so on.
     */
    index: number;
    /**
     * Expected departure date and time for this stop. Expressed according to ISO 8601.
     */
    expectedDeparture: string;
    /**
     * Time in seconds that were still to spare from arrival until the deadline.
     * This can be negative if the deadline was missed.
     */
    spareTime: number;
}

/**
 * One of the possible endDestinations defined in the TransportMetadata.
 * Can also be empty if no endDestination for this tour's vehicle was defined.
 */
export interface TourStop {
    /**
     * Route distance from the last tour stop to this stop in meters.
     * Distance is only set if "ROUTE_360 was" chosen for "geojsonCreation".
     */
    distance?: number;
    /**
     * Time duration it takes from the latest tour stop to this stop in seconds.
     */
    duration: number;
    /**
     * Expected arrival date and time for this stop. Expressed according to ISO 8601.
     */
    expectedArrival: string;
    /**
     * The address of the chosen endDestination as defined in the transportMetadata.
     * (Only the "address" field within the order contains data)
     */
    order: Order;
}
