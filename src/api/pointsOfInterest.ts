import { LatLngId, LatLngIdProperties, LatLngProperties } from '../types';
import { POIRequestOptions } from '../types/options/poiRequestOptions';
import { requests } from '../util/requestUtil';
import { POIRequestPayload } from './payload/poiRequestPayload';
import { TargomoClient } from './targomoClient';

/**
 * An object representing a point (poi/marker) which is returned from overpass queries in this module
 */
// TODO: move elsewhere...or maybe not used in public library...things in here are too specific
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
  // Idea is this will be instantiated internally in Targomoclient,. and will receive instance of parent in its constructor
  constructor(private client: TargomoClient) {
  }

  /**
   * Make an overpass query to a given url (full url including the query parameters)
   *
   * The results will be parsed and returned as a list of OSMLatLng objects
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
  async reachable(source: LatLngId, /// LatLng
                         options: POIRequestOptions): Promise<{[index: string]: LatLngIdProperties}> {
     // TODO:different return type (todo: check server doesn't return array)
    const url = `${this.client.config.poiUrl}/reachability`
    return await requests(this.client, options).fetch(url, 'POST', new POIRequestPayload(this.client, source, options))
  }
}

