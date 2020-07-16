import { LatLngId, LatLngIdProperties, LatLngProperties, TimeRequestOptions, LatLngIdTravelMode, PoiOverview, PoiHiearachy } from '../types';
import { POIRequestOptions } from '../types/options/poiRequestOptions';
import { requests } from '../util/requestUtil';
import { POIRequestPayload } from './payload/poiRequestPayload';
import { TargomoClient } from './targomoClient';
import { UrlUtil } from '../util/urlUtil';

/**
 * An object representing a point (poi/marker) which is returned from overpass queries in this module
 * @deprecated
 */
export class OSMLatLng implements LatLngProperties {
  constructor(readonly id: number,
              readonly lng: number,
              readonly lat: number,
              readonly properties: {[index: string]: any}) {

    // TODO: think...this is convenient to how we have things in mapbox widget...but maybe should not be done in a public api
    if (this.properties) {
      this.properties['marker-size'] = 1
    }
  }

  toString() {
    return this.properties ? this.properties['name'] : ''
  }

  copy() {
    const result = new OSMLatLng(this.id, this.lat, this.lng, {...this.properties})

    for (let key in this) {
      if (key != 'properties') {
        (<any>result)[key] = this[key]
      }
    }

    return result
  }
}

function parseOSMLocation(item: any): OSMLatLng {
  let lat = item.lat
  let lng = item.lon

  if (lat === undefined && item.center) {
    lat = item.center.lat
    lng = item.center.lon
  }

  return new OSMLatLng(item.id, lng, lat, item.tags)
}

/**
 *
 */
// TODO: better method names
/**
 * @Topic Points of Interest
 */
export class PointsOfInterestClient {
  constructor(private client: TargomoClient) {
  }

  /**
   * Make an overpass query to a given url (full url including the query parameters)
   *
   * The results will be parsed and returned as a list of OSMLatLng objects
   *
   * @deprecated
   */
  // TODO: ...this was used in GH...think what shape of this make best sense for a public library
  async queryGetCustom(url: string): Promise<OSMLatLng[]> {
    const result = await requests(this.client).fetch(url)
    return result.elements.map((item: any) => parseOSMLocation(item))
  }

  /**
   * Makes a request to the r360 poi service.
   * Returns a list of OSMLatLng locations of the categories specified by `osmTypes` that are reachable within the given travel options
   */
  async reachable(
    source: LatLngId, /// LatLng
    options: POIRequestOptions,
  ): Promise<{[index: string]: LatLngIdProperties}> {
     // TODO:different return type (todo: check server doesn't return array)
    const url = `${this.client.config.poiUrl}/reachability`
    return await requests(this.client, options).fetch(url, 'POST', new POIRequestPayload(this.client, source, options))
  }

  /**
   *
   * @param hash
   */
  async reachabilitySummary(hash?: string): Promise<PoiOverview> {
    const url = new UrlUtil.TargomoUrl(this.client)
      .host(this.client.config.poiUrl)
      .part('reachability/summary/')

    if (hash) {
      url.part(hash)
    }

    url
      .key()
      .params({apiKey: this.client.serviceKey})

    return await requests(this.client).fetch(url.toString())
  }

  /**
   *
   * @param hash
   */
  async requestReachabilityHash(
    sources: LatLngIdTravelMode[],
    options: TimeRequestOptions,
    osmTypes: {key: string, value: string}[]
  ) {
    const url = new UrlUtil.TargomoUrl(this.client)
    .host(this.client.config.poiUrl)
    .part('reachability/register')
    .key()

    const payload = {
      edgeWeight: options.edgeWeight,
      elevation: options.elevation,
      maxEdgeWeight: options.maxEdgeWeight,
      osmTypes,
      serviceKey: this.client.serviceKey,
      serviceUrl: this.client.serviceUrl,
      sources: sources.map(source => {
        return {
          ...source,
          tm: source.tm || {
            [options.travelType]: {
              rushHour: options.rushHour,
              maxTransfers: options.transitMaxTransfers,
              frame: options.travelType === 'transit' ? {
                duration: options.transitFrameDuration,
                maxWalkingTimeFromSource: options.transitMaxWalkingTimeFromSource,
                time: options.transitFrameTime
              } : undefined
            }
          }
        }
      })
    }

    return await requests(this.client).fetch(url.toString(), 'POST-RAW', JSON.stringify(payload), {
      'Accept': 'application/json, text/plain, */*'
    })
  }

  /**
   *
   * @param hash
   */
  tileRoute(hash: string, reachability: boolean) {
    const url = new UrlUtil.TargomoUrl(this.client).host(this.client.config.poiUrl)

    if (reachability) {
      url.part('reachability/')
    }

    if (hash) {
      url
      .part(hash + '/')
    }

    url
    .part('{z}/{x}/{y}.mvt')
    .params({apiKey: this.client.serviceKey, layerType: 'node'})

    return url.toString()
  }

  /**
   *
   */
  async hierarchy(): Promise<PoiHiearachy> {
    const url = new UrlUtil.TargomoUrl(this.client)
      .host(this.client.config.poiUrl)
      .part('poiHierarchy')
      .key('apiKey')
      .toString()

    return requests(this.client).fetch(url)
  }

  // info(osmIds: string | string[]): Observable<Cp3oPoi[]> {
  //   if (!(osmIds instanceof Array)) {
  //     osmIds = [osmIds]
  //   }

  //   return this.http.get<Cp3oPoi[]>(`${this.baseUrl}info/${osmIds.join(',')}?apiKey=${this.apiKey}`)
  // }



  // /pointofinterest/info/{poiIds}
  // /pointofinterest/osmTypes
  // /pointofinterest/osmTagValues/{tagKey}
  // /pointofinterest/poiHierarchy
}

