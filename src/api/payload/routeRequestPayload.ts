import { LatLngId} from '../../types'
import { TargomoClient } from '../targomoClient'
import { RouteRequestOptions } from '../../types/options'
import { TimeRequestPayload } from './timeRequestPayload';

export class RouteRequestPayload extends TimeRequestPayload {
  constructor(client: TargomoClient, sources: LatLngId[], targets: LatLngId[], options: RouteRequestOptions) {
    super(client, sources, targets, options)

    if (options.recommendations && this.sources) {
      this.sources.forEach((source: any) => {
        if (source.tm != null) {
          for (let mode in source.tm) {
            source.tm[mode].recommendations = 1
          }
        }
      })
    }
  }
}
