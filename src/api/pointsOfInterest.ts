import { LatLngId, LatLngIdProperties, LatLngProperties, TimeRequestOptions,
         LatLngIdTravelMode, PoiOverview, PoiHiearachy, BoundingBox, Poi } from '../types';
import { POIRequestOptions } from '../types/options/poiRequestOptions';
import { requests } from '../util/requestUtil';
import { POIRequestPayload } from './payload/poiRequestPayload';
import { TargomoClient } from './targomoClient';
import { UrlUtil } from '../util/urlUtil';
import { Geometry, FeatureCollection } from 'geojson';

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

    url.key('apiKey')

    return await requests(this.client).fetch(url.toString())
  }

  /**
   *
   * @param hash
   */
  async requestReachabilityHash(
    sources: LatLngIdTravelMode[],
    osmTypes: {key: string, value: string}[],
    options: TimeRequestOptions,
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
  tileRoute(hash: string, type?: 'reachability' | 'geometry') {
    const url = new UrlUtil.TargomoUrl(this.client).host(this.client.config.poiUrl)

    if (type === 'reachability' || type === 'geometry') {
      url.part(type + '/')
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
   * Returns the POI hierarchy supported by the service.
   * The POI Hierarchy is a hierarchy tree of POI groups.
   * Thanks to this hierarchy, one can request groups of POI by their ids.
   */
  async hierarchy(): Promise<PoiHiearachy> {
    const url = new UrlUtil.TargomoUrl(this.client)
      .host(this.client.config.poiUrl)
      .part('poiHierarchy')
      .key('apiKey')
      .toString()

    return requests(this.client).fetch(url)
  }

  /**
   * Returns a list of OSM keys that the service accepts in its requests.
   */
  async osmTypes(): Promise<string[]> {
    const url = new UrlUtil.TargomoUrl(this.client)
      .host(this.client.config.poiUrl)
      .part('osmTypes')
      .key('apiKey')
      .toString()

    return requests(this.client).fetch(url)
  }

  /**
   * Returns all OSM tag values of the requested tagKey that exist in the POI service database.
   */
  async osmTagValues(osmType: string, filter?: string, limit?: number): Promise<{name: string, count: number}[]> {
    const url = new UrlUtil.TargomoUrl(this.client)
      .host(this.client.config.poiUrl)
      .part('osmTagValues/')
      .part(osmType)
      .key('apiKey')
      .params({text: filter || undefined, limit})
      .toString()

    return requests(this.client).fetch(url)
  }

  /**
   * Retrieves the info of a list of POIs thanks to their Ids.
   *
   * Nomenclature of the ids:
   * 0_ means that the requested POI is a node.
   * 1_ means that the requested POI is a way (a line or a polygon).
   * Theses prefixes are followed by the id of the object in the OSM database.
   * If the id is negative, it means that the node or the way derives from a relation.
   */
  async info(poiIds: string[]): Promise<Poi[]> {
    const url = new UrlUtil.TargomoUrl(this.client)
      .host(this.client.config.poiUrl)
      .part('info/')
      .part(poiIds.map(encodeURIComponent).join(','))
      .key('apiKey')
      .toString()

    return requests(this.client).fetch(url)
  }

  /**
   * Retrieves all POIs that match the requested POI groups or OSM types inside a bounding box
   *
   * @param options
   */
  async boundingBox(bounds: BoundingBox, options: {
    group?: string[],
    osmType?: {[key: string]: string},
    exclude?: string[],
    match?: 'any' | 'all'
  }): Promise<Poi[]> {
    const url = new UrlUtil.TargomoUrl(this.client)
      .host(this.client.config.poiUrl)
      .part('boundingBox')
      .key('apiKey')
      .params({
        northEastX: bounds.northEast.lng,
        northEastY: bounds.northEast.lat,
        southWestX: bounds.southWest.lng,
        southWestY: bounds.southWest.lat,
        group: options && options.group,
        exclude: options && options.exclude,
        match: options && options.match,
      })
      .toString()

    return requests(this.client).fetch(url)
  }


  /**
   * Returns a list of reachable points of interest (POIs) within a given geometry.
   *
   * @param geometry
   * @param osmTypes
   * @param format
   */
  async geometry(
    geometry: Geometry,
    osmTypes: {key: string, value: string}[],
    format: 'json'
  ): Promise<{[id: string]: Poi}>
  async geometry(
    geometry: Geometry,
    osmTypes: {key: string, value: string}[],
    format?: 'geojson'
  ): Promise<FeatureCollection>
  async geometry(
    geometry: Geometry,
    osmTypes: {key: string, value: string}[],
    format: 'json' | 'geojson' = 'geojson'
  ) {
    const url = new UrlUtil.TargomoUrl(this.client)
      .host(this.client.config.poiUrl)
      .part('geometry')
      .key()
      .toString()

    const payload = {
      osmTypes,
      serviceKey: this.client.serviceKey,
      serviceUrl: this.client.serviceUrl,
      filterGeometry: {
        'crs': 4326,
        'type': 'geojson',
        'data': JSON.stringify(geometry)
      },
      format
    }

    return requests(this.client).fetch(url, 'POST', payload)
  }

  /**
   *
   * @param hash
   */
  async geometrySummary(hash?: string): Promise<PoiOverview> {
    const url = new UrlUtil.TargomoUrl(this.client)
      .host(this.client.config.poiUrl)
      .part('geometry/summary/')

    if (hash) {
      url.part(hash)
    }

    url.key('apiKey')

    return await requests(this.client).fetch(url.toString())
  }

  /**
   *
   * @param geometry
   * @param osmTypes
   * @param format
   */
  async requestGeometryHash(
    geometry: Geometry,
    options: POIRequestOptions
  ) {
    const url = new UrlUtil.TargomoUrl(this.client)
    .host(this.client.config.poiUrl)
    .part('geometry/register')
    .key()

    const payload = {
      serviceKey: this.client.serviceKey,
      serviceUrl: this.client.serviceUrl,
      filterGeometry: {
        'crs': 4326,
        'type': 'geojson',
        'data': JSON.stringify(geometry)
      },
      osmTypes: options && options.osmTypes,
      format: options && options.format || 'geojson'
    }

    return await requests(this.client).fetch(url.toString(), 'POST-RAW', JSON.stringify(payload), {
      'Accept': 'application/json, text/plain, */*'
    })
  }
}

