import { requests } from '../util/requestUtil'

import { PointsOfInterestClient } from './pointsOfInterest'
import { StatisticsClient } from './statistics'
import { ReachabilityClient } from './reachability'
import { OptimizationsClient } from './optimizations'
import { GeocodeEsriClient } from './geocode'
import { GeocodePhotonClient } from './geocodePhoton'
import { PolygonsClient } from './polygons'
import { RoutesClient } from './routes'
import { SimilarityClient } from './similarity'
import { BenchmarksClient } from './benchmarks'
import { ClientConfig, ClientOptions } from './clientConfig'
import { StatefulMultigraphClient } from './statefulMultigraph';
import { FleetsClient } from './fleets';
import { MultigraphClient } from './multigraph';
import { BasemapsClient } from './basemaps';

/**
 * @Topic Geocoding
 */
export class GeocodingClients {
  constructor(
    readonly esri: GeocodeEsriClient,
    readonly photon: GeocodePhotonClient
  ) { }
}

export class TargomoClient {

  readonly serviceUrl: string

  readonly pois: PointsOfInterestClient
  readonly statistics: StatisticsClient
  readonly reachability: ReachabilityClient
  readonly optimizations: OptimizationsClient
  readonly geocoding: GeocodingClients

  readonly polygons: PolygonsClient
  readonly routes: RoutesClient
  readonly similarity: SimilarityClient
  readonly benchmarks: BenchmarksClient
  readonly statefulMultigraph: StatefulMultigraphClient
  readonly multigraph: MultigraphClient
  readonly fleets: FleetsClient

  readonly basemaps: BasemapsClient

  readonly config: ClientConfig

  /**
   * Create a new Targomo client
   * @param region Service region name or full service URL. See: https://developers.route360.net/availability/
   * @param serviceKey Your targomo service key
   * @param additionalOptions additional options, defaults will be used if not provided
   */
  constructor(region: string, public serviceKey: string, options?: ClientOptions) {

    if (!region) {
      throw new TypeError('Region parameter is missing');
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

    this.geocoding = new GeocodingClients(
      new GeocodeEsriClient(),
      new GeocodePhotonClient(this)
    )

    this.polygons = new PolygonsClient(this)
    this.routes = new RoutesClient(this)
    this.similarity = new SimilarityClient(this)
    this.benchmarks = new BenchmarksClient(this)
    this.statefulMultigraph = new StatefulMultigraphClient(this)
    this.multigraph = new MultigraphClient(this)
    this.basemaps = new BasemapsClient(this);
    this.fleets = new FleetsClient(this);
  }

  /**
   * Extracts the endpoint part from the serviceUrl (for example `germany`)
   */
  get endpoint() {
    const items = this.serviceUrl.split('/').filter(item => !!item)
    return items[items.length - 1]
  }


  /**
   *
   */
  async metadata() {
    const endpoint = this.endpoint
    const key = this.serviceKey
    const url = `${this.config.serverUrl}/${endpoint}/v1/metadata/network?key=${encodeURIComponent(key)}`
    return await requests(this).fetch(url)
  }
}
