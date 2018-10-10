import { FpResult } from './../types/responses/FleetResult';
import { FpRequestOptions } from './../types/options/fleetRequestOptions';
import { FpTransport } from './../types/types';
import { TargomoClient } from './targomoClient'
import { requests} from '../util/requestUtil';
import { FpRequestPayload } from './payload/fleetsRequestPayload';
import { FpStore, FpOrder } from '../types';
import { UrlUtil } from '../util/urlUtil';

export class FleetsClient {
  constructor(private client: TargomoClient) {
  }

  /**
   * Finding the best tours/routes for a fleet of transport vehicles
   *
   */
  async fetch(stores: FpStore[], orders: FpOrder[], transports: FpTransport[], options: FpRequestOptions): Promise<FpResult> {

    const url =
    UrlUtil.buildTargomoUrl(this.client.config.fleetsUrl, 'api/key-auth/optimizations', this.client.serviceKey, true)
    const cfg = new FpRequestPayload(this.client, options, stores, transports, orders);

    const result = await requests(this.client, options).fetch(url, 'POST', cfg);

    return result;
  }
}
