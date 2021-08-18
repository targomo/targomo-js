import { TargomoClient } from '..'
import { Location } from '../..'
import { QualityRequestOptions } from '../../types/options/qualityRequestOptions'

export class QualityRequestPayload {
  locations: Location[]
  criteria: QualityRequestOptions
  competitors?: Location[]

  constructor(
    client: TargomoClient,
    locations: Location[],
    criteria: QualityRequestOptions,
    competitors?: Location[]
  ) {
    this.locations = locations
    this.criteria = criteria
    this.competitors = competitors
  }
}
