import { TargomoClient } from './targomoClient'
import { LatLngId, LatLngIdTravelTime, LatLngIdTravelMode, TimeResult, ReachabilityResult } from '../index';
import { requests} from '../util/requestUtil';
import { TimeRequestOptions } from '../types/options/timeRequestOptions';
import { TimeRequestPayload } from './payload/timeRequestPayload';
import { UrlUtil } from '../util/urlUtil';

// TODO: decide on method names...or keep previous names
export class ReachabilityClient {
  constructor(private client: TargomoClient) {
  }

  /**
   *
   * @param sources
   * @param targets
   * @param options
   */
  async individual(sources: LatLngIdTravelMode[], targets: LatLngId[], options: TimeRequestOptions): Promise<TimeResult[]> {
    const url = UrlUtil.buildTargomoUrl(this.client.serviceUrl, 'time', this.client.serviceKey)
    const cfg = new TimeRequestPayload(this.client, sources, targets, options)
    return await requests(this.client, options).fetchCachedData(options.useClientCache, url, 'POST', cfg)
  }


  /**
   * Makes a reachability request to the r360 services, and returns the raw results of the request
   *
   * @param sources
   * @param targets
   * @param options
   */
  async combined(sources: LatLngId[], targets: LatLngId[], options: TimeRequestOptions): Promise<ReachabilityResult[]> {
    const url = UrlUtil.buildTargomoUrl(this.client.serviceUrl, 'reachability', this.client.serviceKey)
    const cfg = new TimeRequestPayload(this.client, sources, targets, options)
    // TODO: add timeout
    return await requests(this.client, options).fetchCachedData(options.useClientCache, url, 'POST', cfg)
  }

  /**
   * Makes a reachability request to the r360 services and returns the number of locations that are reachable within the given parameters
   *
   * @param sources
   * @param targets
   * @param options
   */
  async count(sources: LatLngId[], targets: LatLngId[], options: TimeRequestOptions): Promise<number> {
    // TODO: sopmething like this was used somewhere think
    // (maybe autoprop)....however since it is trivial...maybe we should not have it anymore
    return (await this.locations(sources, targets, options)).length
  }

  /**
   * Makes a reachability requests to the r360 services and returns the input targets decorated with the resulting travel time
   *
   * @param sources
   * @param targets
   * @param options
   */
  async locations<T extends LatLngIdTravelTime>(sources: LatLngId[],
                                                            targets: T[],
                                                            options: TimeRequestOptions): Promise<T[]> {
    const map: any = {}
    targets.forEach(place => map[String(place.id)] = -1)

    const response: any[] = await this.combined(sources, targets, options)
    response.forEach(target => {
      const id = String(target.id)
      if (!map[id]) {
        console.warn('NOT FOUND', String(target.id))
      } else {
        if (target.travelTime > -1) {
          if (map[id] > -1) {
            map[id] = Math.min(map[id], target.travelTime)
          } else {
            map[id] = target.travelTime
          }
        }
      }
    })

    return (<T[]>targets).filter(place => {
      const id = String(place.id)
      place.travelTime = map[id]
      return map[id] > -1
    })
  }

}
