import { TravelRequestOptions } from './../../types/requestOptions';
import { LatLngId, LatLngIdTravelMode } from '../../index'
import { GeometryIdTravelMode, GeometryIdTravelModePayload } from '../../types';

/**
 * An object the contains a configuration set for making requests to the r360 services backend
 */
export class TravelRequestPayload extends TravelRequestOptions {
  sources: LatLngIdTravelMode[];
  sourceGeometries: GeometryIdTravelModePayload[];
  targets: LatLngId[];

  constructor(options?: TravelRequestOptions) {
    super()

    Object.assign(this, options)

    if (options.transitFrameDateTime != null) {
      let date;
      if (options.transitFrameDateTime instanceof Date) {
        date = options.transitFrameDateTime
      } else {
        date = new Date(<any>options.transitFrameDateTime)
      }
      const transitFrameDate = date ? ((date.getFullYear() * 10000) + (date.getMonth() + 1) * 100 + date.getDate()) : undefined
      const transitFrameTime = date ? ((date.getHours() * 3600) + (date.getMinutes() * 60)) : undefined

      this.transitFrameDate = transitFrameDate || this.transitFrameDate
      this.transitFrameTime = transitFrameTime || this.transitFrameTime
    }
  }

  protected buildTargetsCfg(targets: LatLngId[]): LatLngId[] {
    return targets.map(original => {
      return {
        lat: original.lat,
        lng: original.lng,
        id: original.id,
      }
    })
  }

  protected buildSourcesCfg(sources: LatLngIdTravelMode[]): LatLngIdTravelMode[] {
    if (!sources) {
      return undefined
    }

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

  protected buildSourceGeometriesCfg(sources: GeometryIdTravelMode[]): GeometryIdTravelModePayload[] {
    if (!sources) {
      return undefined
    }

    return sources.map(original => {
      const source = {
        data: JSON.stringify(original.geometry),
        crs: original.crs || 4326,
        id: '' + original.id,
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
