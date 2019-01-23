// TODO: or rename to ClientDefaults maybe to make it more clear
// TODO: add more defaults here ...ex same stuff as in r360-js


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
  routeTypes?: {routeType: string | number, color: string, haloColor: string}[]
}

export class ClientConfig implements ClientOptions {

  serverUrl: string = 'https://api.targomo.com/'
  statisticsUrl: string = 'https://api.targomo.com/statistics/'
  tilesUrl: string = 'https://api.targomo.com/vector-statistics/'
  poiUrl: string = 'https://api.targomo.com/pointofinterest/'
  mapTilesUrl: string = 'https://maps.targomo.com/'
  photonGeocoderUrl: string = 'https://api.targomo.com/geocode/'
  overpassUrl: string = 'https://api.targomo.com/overpass/'
  fleetsUrl: string = 'https://api.targomo.com/fleetplanner/'
  basemapsUrl: string = 'https://maps.targomo.com/styles/'
  requestTimeout: 20000
  version: number = 1

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
