import { LatLngId} from '..'
import { TargomoClient } from '../../api/targomoClient'
import { TimeRequestOptionsSourcesTargets } from '../options'
import {TravelRequestPayload} from './travelRequestPayload'

export class TimeRequestPayload extends TravelRequestPayload {

  constructor(client: TargomoClient, sources: LatLngId[], targets: LatLngId[], options: TimeRequestOptionsSourcesTargets) {
    super(options)

    if (sources) {
      this.sources = this.buildSourcesCfg(sources)
    } else {
      this.sources = this.buildSourcesCfg(options.sources)
      this.sourceGeometries = this.buildSourceGeometriesCfg(options.sourceGeometries)
    }

    if (targets) {
      this.targets = this.buildTargetsCfg(targets)
    } else {
      this.targets = this.buildTargetsCfg(options.targets)
    }
  }
}
