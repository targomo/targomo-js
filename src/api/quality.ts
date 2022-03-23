import { Location } from '../index';
import { QualityServiceResponse, QualityRequestOptions, QualityRequestPayload } from '../types';
import { requests, UrlUtil } from '../util';
import { TargomoClient } from './targomoClient';


/**
 * @Topic Quality client
 */
export class QualityClient {
  constructor(private client: TargomoClient) {
  }

  async fetch(locations: Location[], criteria: QualityRequestOptions): Promise<QualityServiceResponse>;
  async fetch(locations: Location[], criteria: QualityRequestOptions, showDetails: boolean): Promise<QualityServiceResponse>;
  async fetch(locations: Location[], criteria: QualityRequestOptions, showDetails: boolean, competitors: Location[]):
    Promise<QualityServiceResponse>;
  async fetch(locations: Location[], criteria: QualityRequestOptions, showDetails?: boolean, competitors?: Location[]):
    Promise<QualityServiceResponse> {

    const url = new UrlUtil.TargomoUrl(this.client)
      .host(this.client.config.qualityUrl)
      .version()
      .part('/scores')
      .key('apiKey')
      .params({
        showDetails: showDetails
      })
      .toString();

    const payload = new QualityRequestPayload (
      this.client,
      locations,
      criteria,
      competitors
    )
    const result = await requests(this.client, {}).fetch(url, 'POST', payload, {})

    return result;
  }
}
