// TODO: or rename to ClientDefaults maybe to make it more clear
// TODO: add more defaults here ...ex same stuff as in targomo-js

import { TargomoEnvironment } from '../constants'

export interface RequestLogEntry {
  url: string
  body: unknown
  response: unknown
  status: number
}

export interface ClientOptions {
  serverUrl?: string
  statisticsUrl?: string
  tilesUrl?: string
  poiUrl?: string
  mapTilesUrl?: string
  photonGeocoderUrl?: string
  overpassUrl?: string
  fleetsUrl?: string
  requestTimeout?: number
  version?: number
  routeTypes?: { routeType: string | number; color: string; haloColor: string }[]
  debug?: boolean
  environment?: TargomoEnvironment
  requestLogger?: (payload: RequestLogEntry) => void | Promise<void>
}

export class ClientConfig implements ClientOptions {
  serverUrl = 'https://api.targomo.com/'
  statisticsUrl = 'https://api.targomo.com/statistics/'
  tilesUrl = 'https://api.targomo.com/vector-statistics/'
  poiUrl = 'https://api.targomo.com/pointofinterest/'
  mapTilesUrl = 'https://maps.targomo.com/'
  photonGeocoderUrl = 'https://api.targomo.com/geocode/'
  overpassUrl = 'https://api.targomo.com/overpass/'
  fleetsUrl = 'https://api.targomo.com/fleetplanner/'
  basemapsUrl = 'https://maps.targomo.com/styles/'
  qualityUrl = 'https://api.targomo.com/quality/'
  requestTimeout: 20000
  version = 1
  debug = false
  environment: TargomoEnvironment.PROD
  requestLogger: null

  // routeTypes  = [
  //   // non transit
  //   { routeType : 'WALK'     , color : 'red',       haloColor : 'white'},
  //   { routeType : 'BIKE'     , color : '#558D54',   haloColor : 'white'},
  //   { routeType : 'CAR'      , color : '#558D54',   haloColor : 'white'},
  //   { routeType : 'TRANSFER' , color : '#C1272D',   haloColor : 'white'},

  //   // berlin
  //   { routeType : 102        , color : '#006837',   haloColor : 'white' },
  //   { routeType : 400        , color : '#156ab8',   haloColor : 'white' },
  //   { routeType : 900        , color : 'red',       haloColor : 'white' },
  //   { routeType : 700        , color : '#A3007C',   haloColor : 'white' },
  //   { routeType : 1000       , color : 'blue',      haloColor : 'white' },
  //   { routeType : 109        , color : '#006F35',   haloColor : 'white' },
  //   { routeType : 100        , color : 'red',       haloColor : 'white' },

  //   // new york
  //   { routeType : 1          , color : 'red',       haloColor : 'red'},
  //   { routeType : 2          , color : 'blue',      haloColor : 'blue'},
  //   { routeType : 3          , color : 'yellow',    haloColor : 'yellow'},
  //   { routeType : 0          , color : 'green',     haloColor : 'green'},
  //   { routeType : 4          , color : 'orange',    haloColor : 'orange'},
  //   { routeType : 5          , color : 'red',       haloColor : 'red'},
  //   { routeType : 6          , color : 'blue',      haloColor : 'blue'},
  //   { routeType : 7          , color : 'yellow',    haloColor : 'yellow' }
  // ]

  constructor(options: ClientOptions) {
    Object.assign(this, options)
  }
}
