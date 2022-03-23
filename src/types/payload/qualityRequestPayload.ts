import { TargomoClient } from '../../api'
import { Location } from '../..'
import { QualityRequestOptions } from '../options/qualityRequestOptions'

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
