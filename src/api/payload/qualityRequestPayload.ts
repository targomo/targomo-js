import { TargomoClient } from ".."
import { LatLngId } from "../.."
import { QualityRequestOptions } from "../../types/options/qualityRequestOptions"

export class QualityRequestPayload {
  locations: LatLngId[]
  criteria: QualityRequestOptions
  competitors?: LatLngId[]

  constructor(
    client: TargomoClient,
    locations: LatLngId[],
    criteria: QualityRequestOptions,
    competitors?: LatLngId[]
  ) {
    this.locations = locations
    this.criteria = criteria
    this.competitors = competitors
    
  }
}