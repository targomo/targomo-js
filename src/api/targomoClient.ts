import { requests } from '../util/requestUtil'

import { PointsOfInterestClient } from './pointsOfInterest'
import { StatisticsClient } from './statistics'
import { ReachabilityClient } from './reachability'
import { OptimizationsClient } from './optimizations'
import { GeocodeEsriClient } from './geocode'
import { GeocodePhotonClient } from './geocodePhoton'
import { PolygonsClient } from './polygons'
import { RoutesClient } from './routes'
import { ClientConfig, ClientOptions } from './clientConfig'
import { StatefulMultigraphClient } from './statefulMultigraph'
import { FleetsClient } from './fleets'
import { MultigraphClient } from './multigraph'
import { BasemapsClient } from './basemaps'
import { UrlUtil } from '..'
import { QualityClient } from './quality'

/**
 * @Topic Geocoding
 */
export class GeocodingClients {
  constructor(readonly esri: GeocodeEsriClient, readonly photon: GeocodePhotonClient) {}
}

export class TargomoClient {
  serviceUrl: string

  readonly pois: PointsOfInterestClient
  readonly statistics: StatisticsClient
  readonly reachability: ReachabilityClient
  readonly optimizations: OptimizationsClient
  readonly geocoding: GeocodingClients

  readonly polygons: PolygonsClient
  readonly routes: RoutesClient
  readonly statefulMultigraph: StatefulMultigraphClient
  readonly multigraph: MultigraphClient
  readonly fleets: FleetsClient
  readonly quality: QualityClient

  readonly basemaps: BasemapsClient

  readonly config: ClientConfig

  /**
   * Create a new Targomo client
   * @param region Service region name or full service URL. See: https://www.targomo.com/developers/resources/coverage/
   * @param serviceKey Your targomo service key
   * @param additionalOptions additional options, defaults will be used if not provided
   */
  constructor(region: string, public serviceKey: string, options?: ClientOptions) {
    if (!region) {
      throw new TypeError('Region parameter is missing')
    }

    this.config = new ClientConfig(options)

    if (!region.includes('http') && !region.includes('localhost') && !region.includes('/')) {
      this.serviceUrl = 'https://api.targomo.com/' + region + '/'
    } else {
      this.serviceUrl = region
    }

    this.pois = new PointsOfInterestClient(this)
    this.statistics = new StatisticsClient(this)
    this.reachability = new ReachabilityClient(this)
    this.optimizations = new OptimizationsClient(this)

    this.geocoding = new GeocodingClients(new GeocodeEsriClient(), new GeocodePhotonClient(this))

    this.polygons = new PolygonsClient(this)
    this.routes = new RoutesClient(this)
    this.statefulMultigraph = new StatefulMultigraphClient(this)
    this.multigraph = new MultigraphClient(this)
    this.basemaps = new BasemapsClient(this)
    this.fleets = new FleetsClient(this)
    this.quality = new QualityClient(this)
  }

  /**
   * Set the enpoint to be used in API requests
   * @param region Service region name or full service URL. See: https://www.targomo.com/developers/resources/coverage/
   */
  setServiceUrl(region: string) {
    if (!region.includes('http') && !region.includes('localhost') && !region.includes('/')) {
      this.serviceUrl = 'https://api.targomo.com/' + region + '/'
    } else {
      this.serviceUrl = region
    }
  }

  /**
   * Extracts the endpoint part from the serviceUrl (for example `germany`)
   */
  get endpoint() {
    const items = this.serviceUrl.split('/').filter((item) => !!item)
    return items[items.length - 1]
  }

  /**
   *
   */
  async metadata() {
    const url = new UrlUtil.TargomoUrl(this).part(this.serviceUrl).version().part('/metadata/network').key().toString()

    return await requests(this).fetch(url)
  }
}
