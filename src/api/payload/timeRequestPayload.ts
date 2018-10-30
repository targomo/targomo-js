import { LatLngId} from '../../types'
import { TargomoClient } from '../targomoClient'
import { TimeRequestOptions } from '../../types/options'
import {TravelRequestPayload} from './travelRequestPayload'

export class TimeRequestPayload extends TravelRequestPayload {

  constructor(client: TargomoClient, sources: LatLngId[], targets: LatLngId[], options: TimeRequestOptions) {
    super(options)
    this.sources = this.buildSourcesCfg(sources)
    this.targets = this.buildTargetsCfg(targets)
  }
}
