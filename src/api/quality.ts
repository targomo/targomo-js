import { Location } from '../index'
import { QualityServiceResponse } from '../types'
import { QualityPayload, QualityRequestCriteria } from '../types/options/qualityRequestOptions'
import { requests } from '../util/requestUtil'
import { UrlUtil } from '../util/urlUtil'
import { TargomoClient } from './targomoClient'

/**
 * @Topic Quality client
 */
export class QualityClient {
  constructor(private client: TargomoClient) {}

  async fetch(locations: Location[], criteria: QualityRequestCriteria): Promise<QualityServiceResponse>
  async fetch(
    locations: Location[],
    criteria: QualityRequestCriteria,
    showDetails: boolean
  ): Promise<QualityServiceResponse>
  async fetch(
    locations: Location[],
    criteria: QualityRequestCriteria,
    showDetails: boolean,
    competitors: Location[]
  ): Promise<QualityServiceResponse>
  async fetch(
    locations: Location[],
    criteria: QualityRequestCriteria,
    showDetails?: boolean,
    competitors?: Location[]
  ): Promise<QualityServiceResponse> {
    const url = new UrlUtil.TargomoUrl(this.client)
      .host(this.client.config.qualityUrl)
      .version()
      .part('/scores')
      .key('apiKey')
      .params({
        showDetails: showDetails,
      })
      .toString()

    const payload: QualityPayload = {
      locations,
      criteria,
      competitors,
    }
    const result = await requests(this.client, {}).fetch(url, 'POST', payload, {})

    return result
  }
}
