import { TargomoClient } from './targomoClient'
import { LatLngId} from '../index';
import { requests} from '../util/requestUtil';
import { OptimizationRequestOptions } from '../types/options/optimizationRequestOptions';

export class OptimizationsClient {
  constructor(private client: TargomoClient) {
  }

  // TODO optimization....methods below may go into a separate class and be accesssed
  //  as api.optimization.create / api.optimization.ready / api.optimization.get
  /**
   *
   * @param sources
   * @param matrixOptions
   * @param options
   */
  // NOTE: we can't have unit tests for this....
  async create(sources: LatLngId[], options: OptimizationRequestOptions): Promise<any> {
    if (!sources.length) {
      return null
    }

    // const url = this.statisticsUrl + '/simulation'
    // const cfg = options.toCfgObject(sources, matrixOptions) // TODO: instead have OPtimizationPayload  or SimulationPayload
    // const result = await requests().fetchApiRequestData(url, 'POST', cfg)

    // return result


    // return null
    throw new Error('not implemented yet')
  }

  async ready(optimizationId: number | number[]) {
    if (!(optimizationId instanceof Array)) {
      optimizationId = [optimizationId]
    }

    const url = this.client.config.statisticsUrl + '/simulation/ready?'
                + optimizationId.map(id => `simulationId=${encodeURIComponent('' + +id)}`).join('&')
                + '&serviceUrl=' + encodeURIComponent(this.client.serviceUrl)

    return requests(this.client).fetch(url)
  }

  /**
   *
   * @param optimizationId
   */
  async fetch(optimizationId: number) {
    const url = this.client.config.statisticsUrl + '/simulation/'
                + encodeURIComponent('' + +optimizationId)
                + '?serviceUrl=' + encodeURIComponent(this.client.serviceUrl)

    console.log('URL', url)
    // TODO: from GH...get optimization results
    return requests(this.client).fetch(url)
  }
}
