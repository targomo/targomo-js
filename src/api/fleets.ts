import { FleetResult } from './../types/responses/FleetResult';
import { FleetRequestOptions } from './../types/options/fleetRequestOptions';
import { Transport } from './../types/types';
import { TargomoClient } from './targomoClient'
import { requests} from '../util/requestUtil';
import { FleetsRequestPayload } from './payload/fleetsRequestPayload';
import { Store, Order } from '../types';

export class FleetsClient {
  constructor(private client: TargomoClient) {
  }

  /**
   * Finding the best tours/routes for a fleet of transport vehicles
   *
   */
  async fetch(stores: Store[], orders: Order[], transports: Transport[], options: FleetRequestOptions): Promise<FleetResult> {
    const url = 'https://service.route360.net/fleetplanner/v1/api/key-auth/optimizations?key=' + this.client.serviceKey;
    const cfg = new FleetsRequestPayload(this.client, options, stores, transports, orders);
    const result = await requests(this.client, options).fetch(url, 'POST', cfg);
    return result;
  }
}
