import { LatLngId} from '../../types'
import { TargomoClient } from '../targomoClient'
import { RouteRequestOptions } from '../../types/options'
import { TravelRequestPayload } from './travelRequestPayload';

export class RouteRequestPayload extends TravelRequestPayload {

  pathSerializer?: 'compact' | 'geojson'

  constructor(client: TargomoClient, sources: LatLngId[], targets: LatLngId[], options: RouteRequestOptions) {
    super(options)
    this.sources = this.buildSourcesCfg(sources)
    this.targets = this.buildTargetsCfg(targets)
    this.pathSerializer = options.pathSerializer;

    if (Number.isInteger(options.recommendations) && this.sources) {
      this.sources.forEach((source: any) => {
        if (source.tm != null) {
          for (let mode in source.tm) {
            source.tm[mode].recommendations = options.recommendations
          }
        }
      })
    }
  }
}
