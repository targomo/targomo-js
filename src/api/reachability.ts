import { TargomoClient } from './targomoClient'
import { LatLngId, LatLngIdTravelTime, LatLngIdTravelMode, TimeResult, ReachabilityResult } from '../index'
import { requests } from '../util/requestUtil'
import { TimeRequestOptions, TimeRequestOptionsSourcesTargets } from '../types/options/timeRequestOptions'
import { TimeRequestPayload } from './payload/timeRequestPayload'
import { UrlUtil } from '../util/urlUtil'

/**
 * @Topic Reachability
 */
export class ReachabilityClient {
  constructor(private client: TargomoClient) {}

  /**
   *
   * @param sources
   * @param targets
   * @param options
   */
  async individual(
    sources: LatLngIdTravelMode[],
    targets: LatLngId[],
    options: TimeRequestOptions
  ): Promise<TimeResult[]>
  async individual(options: TimeRequestOptionsSourcesTargets): Promise<TimeResult[]>
  async individual(
    sourcesOrOptions: TimeRequestOptionsSourcesTargets | LatLngIdTravelMode[],
    targets?: LatLngId[],
    options?: TimeRequestOptionsSourcesTargets
  ): Promise<TimeResult[]> {
    const sources: LatLngIdTravelMode[] = options ? <any>sourcesOrOptions : null
    options = options || <TimeRequestOptionsSourcesTargets>sourcesOrOptions

    const url = new UrlUtil.TargomoUrl(this.client)
      .part(this.client.serviceUrl)
      .version()
      .part('/time')
      .key()
      .toString()

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
  async combined(sources: LatLngId[], targets: LatLngId[], options: TimeRequestOptions): Promise<ReachabilityResult[]>
  async combined(options: TimeRequestOptionsSourcesTargets): Promise<ReachabilityResult[]>
  async combined(
    sourcesOrOptions: TimeRequestOptionsSourcesTargets | LatLngId[],
    targets?: LatLngId[],
    options?: TimeRequestOptionsSourcesTargets
  ): Promise<ReachabilityResult[]> {
    const sources: LatLngIdTravelMode[] = options ? <any>sourcesOrOptions : null
    options = options || <TimeRequestOptionsSourcesTargets>sourcesOrOptions

    const url = new UrlUtil.TargomoUrl(this.client)
      .part(this.client.serviceUrl)
      .version()
      .part('/reachability')
      .key()
      .toString()

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
   * @deprecated
   */
  async count(sources: LatLngId[], targets: LatLngId[], options: TimeRequestOptions): Promise<number>
  async count(options: TimeRequestOptionsSourcesTargets): Promise<number>
  async count(
    sources: TimeRequestOptionsSourcesTargets | LatLngId[],
    targets?: LatLngId[],
    options?: TimeRequestOptionsSourcesTargets
  ): Promise<number> {
    return (await this.locations(<any>sources, targets, options)).length
  }

  /**
   * Makes a reachability requests to the r360 services and returns the input targets decorated with the resulting travel time
   *
   * @param sources
   * @param targets
   * @param options
   * @deprecated
   */
  async locations<T extends LatLngIdTravelTime>(
    sources: LatLngId[],
    targets: T[],
    options: TimeRequestOptions
  ): Promise<T[]>

  async locations<T extends LatLngIdTravelTime>(options: TimeRequestOptionsSourcesTargets): Promise<T[]>

  async locations<T extends LatLngIdTravelTime>(
    sourcesOrOptions: TimeRequestOptionsSourcesTargets | LatLngId[],
    targets?: T[],
    options?: TimeRequestOptionsSourcesTargets
  ): Promise<T[]> {
    const sources: LatLngIdTravelMode[] = options ? <any>sourcesOrOptions : null
    options = options || <TimeRequestOptionsSourcesTargets>sourcesOrOptions

    const map: any = {}
    targets.forEach((place) => (map[String(place.id)] = -1))

    const response: any[] = await this.combined(sources, targets, options)
    response.forEach((target) => {
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

    return (<T[]>targets).filter((place) => {
      const id = String(place.id)
      place.travelTime = map[id]
      return map[id] > -1
    })
  }
}
