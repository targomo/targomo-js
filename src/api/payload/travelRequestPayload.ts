import { BaseRequestOptions, TravelRequestOptions } from './../../types/requestOptions';
import { TravelSpeedValues, LatLngId, TravelType, TravelSpeed, LatLngIdTravelMode } from '../../index'

/**
 * An object the contains a configuration set for making requests to the r360 services backend
 */
export class TravelRequestPayload extends TravelRequestOptions {

  constructor(options?: TravelRequestOptions) {
    super();
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
                  duration: this.transitFrameDuration
                },
                maxTransfers: this.transitMaxTransfers
              }
            }
        }

      }
      return source
    })
  }
}
