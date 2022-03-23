import { LatLngId, Poi } from '..';

/**
 * @general Response from https://api.targomo.com/quality/v1/scores/post
 */
export interface QualityServiceResponse {
  data: LocationData
  message?: string
  errors?: ErrorDetailed[]
  timestamp?: string
}

interface LocationData {
  [locationId: string]: LatLngIdScores
}

export interface LatLngIdScores extends LatLngId {
  /** Each score is given in the form of key-value pair.
   * If the value is null, it means that the service couldn't calculate the scores for some reason.
  In that case, an error message should be present in the errors list.
  */
  scores: {
    [score: string]: number
  }
  details?: {
    [criteriaId: string]: {
      [edgeWeight: string]: Poi[]
    }
  }
}

interface ErrorDetailed {
  id: number
  /** Error message that comes from another Targomo's API */
  detail: string
  meta: Service
}

interface Service {
  /** Service from where the error comes */
  serviceName: string
  serviceUrl: string
  /** See https://www.targomo.com/developers/resources/coverage/ for more infos regarding Service Coverage Areas*/
  coreServiceUrl: string
  /** Ids of the criteria that are affected by this error */
  criteriaIds: string[]
  /** Id of the location that is affected by this error */
  locationId: string
}
