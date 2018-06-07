import { TravelRequestOptions, TravelSpeedValues, LatLngId, TravelType, TravelSpeed, LatLngIdTravelMode } from '../../index'

/**
 * An object the contains a configuration set for making requests to the r360 services backend
 */
export class TravelRequestPayload implements TravelRequestOptions {
  closestSources = false

  requestTimeout: number = null
  walkSpeed: TravelSpeedValues = {}
  bikeSpeed: TravelSpeedValues = {}

  sources: LatLngId[] = [];
  targets: LatLngId[] = [];

  rushHour: boolean = false;

  reverse: boolean = false;
  recommendations: boolean = false;

  pathSerializer: string = 'compact'
  polygonSerializer: string = 'json'
  pointReduction: boolean = true;

  maxEdgeWeight: number = 1800
  travelType: TravelType = 'bike'
  travelSpeed: TravelSpeed = 'medium'
  edgeWeight: 'time' | 'distance' = 'time'


  transitFrameDuration: number = undefined
  transitFrameDate: number = 20170801
  transitFrameTime: number = 39600

  date = this.transitFrameDate // deprecated
  time = this.transitFrameTime // deprecated

  elevation = true
  useCache = true // TODO: maybe split...also have useClientCache
  travelEdgeWeights: number[] = null

  constructor(options?: TravelRequestOptions) {
    Object.assign(this, options)

    if (options.transitFrameDateTime != null) {
      const date = new Date(<any>options.transitFrameDateTime)
      const transitFrameDate = date ? ((date.getFullYear() * 10000) + (date.getMonth() + 1) * 100 + date.getDate()) : undefined
      const transitFrameTime = date ? ((date.getHours() * 3600) + (date.getMinutes() * 60)) : undefined

      this.date = this.transitFrameDate = transitFrameDate || this.transitFrameDate
      this.time = this.transitFrameTime = transitFrameTime || this.transitFrameTime
    }
  }

  protected buildTargetsCfg(targets: LatLngId[]) {
    return targets.map(original => {
      return {
        lat: original.lat,
        lng: original.lng,
        id: original.id,
      }
    })
  }

  protected buildSourcesCfg(sources: LatLngIdTravelMode[]) {
    return sources.map(original => {
      const source = {
        lat: original.lat,
        lng: original.lng,
        id: original.id,
        tm: original.tm
      }

      if (!source.tm) {
        switch (this.travelType) {
          case 'car':
            source.tm = {
              car: this.rushHour ? {
                rushHour: this.rushHour
              } : {}
            }
            break
          case 'walk':
            source.tm = {
              walk: this.walkSpeed
            }
            break
          case 'bike':
            source.tm = {
              bike: this.bikeSpeed
            }
            break
          case 'transit':
            source.tm = {
              transit: {
                frame: {
                  date: this.transitFrameDate,
                  time: this.transitFrameTime,
                },
                duration: this.transitFrameDuration
              }
            }
        }

      }
      return source
    })
  }
}

