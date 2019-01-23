import { TargomoClient } from './targomoClient'
import { UrlUtil} from '../util';
import { requests} from '../util/requestUtil';
import { OptimizationRequestOptions } from '../types/options/optimizationRequestOptions';
import { LatLngId } from '../types/types';
import { OptimizationRequestPayload } from './payload/optimizationRequestPayload';
import { OptimizationResult } from '../types/responses/optimizationResult';

/**
 * @Topic Optimizations
 */
export class OptimizationsClient {
  constructor(private client: TargomoClient) {
  }

  /**
   * Initiates a an optimimization simulation. Given a list of locations and simulation parameters it tries to
   * derive a subset of these locations that are optimal.
   *
   * @param sources
   * @param options
   */
  // NOTE: we can't have unit tests for this....
  async create(sources: LatLngId[], options: OptimizationRequestOptions): Promise<any> {
    if (!sources.length) {
      return null
    }


    const url = new UrlUtil.TargomoUrl(this.client)
      .host(this.client.config.statisticsUrl)
      .part('simulation/start/')
      .key()
      .params({
        serviceUrl: encodeURIComponent(this.client.serviceUrl)
      })
      .toString();

    const cfg = new OptimizationRequestPayload(this.client.serviceUrl, this.client.serviceKey, sources, options)

    const result = await requests(this.client, options).fetch(url, 'POST', cfg)
    return result && +result.id
  }

  /**
   * Checks if the given optimization simulation have completed and have results ready for retrieval
   *
   * @param optimizationId
   */
  async ready(optimizationId: number | number[]): Promise<{[id: string]: boolean}> {
    if (!(optimizationId instanceof Array)) {
      optimizationId = [optimizationId]
    }

    const url = new UrlUtil.TargomoUrl(this.client)
      .host(this.client.config.statisticsUrl)
      .part('simulation/ready/')
      .key()
      .params({
        serviceUrl: encodeURIComponent(this.client.serviceUrl),
        simulationId: optimizationId
      })
      .toString();

    return requests(this.client).fetch(url)
  }

  /**
   * Retrieve the results of an optimization simulation
   *
   * @param optimizationId
   */
  async fetch(optimizationId: number) {

    const url = new UrlUtil.TargomoUrl(this.client)
      .host(this.client.config.statisticsUrl)
      .part('simulation/' + optimizationId + '/')
      .key()
      .params({
        serviceUrl: encodeURIComponent(this.client.serviceUrl)
      })
      .toString();

    return new OptimizationResult(await requests(this.client).fetch(url))
  }
}
